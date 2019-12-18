import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { PluginComponent } from './plugin.component';
import { PluginRegistry } from './plugin.registry';

@Directive({
  selector: '[ngxPluginHost]'
})
export class PluginHostDirective implements OnInit, OnDestroy {
  @Input() hostName: string;
  @Input() pluginData: any;
  @Input() reverse: boolean;
  componentRefMap = new Map<string, ComponentRef<PluginComponent>>();
  init: boolean;
  pluginCount = 0;
  pluginDataObs: Observable<any>;
  pluginDataSubscribers: Array<Subscriber<any>> = [];

  constructor(
    private templateRef: TemplateRef<void>,
    private vcr: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
    private zone: NgZone
  ) {
    this.pluginDataObs = new Observable(sub => {
      this.pluginDataSubscribers.push(sub);
      sub.next(this.pluginData);

      const orig_unsub = sub.unsubscribe;
      const pluginDataSubscribers = this.pluginDataSubscribers;
      sub.unsubscribe = function() {
        orig_unsub.call(this);
        const index = pluginDataSubscribers.indexOf(sub);
        pluginDataSubscribers.splice(index, 1);
      };
    });
  }

  ngOnInit() {
    this.loadAllPlugins();

    PluginRegistry.pluginRegistered$
      .pipe(
        filter(hostNames => hostNames.indexOf(this.hostName) >= 0),
        debounceTime(25)
      )
      .subscribe(() => {
        this.loadAllPlugins();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    let pluginDataChanges = changes.pluginData;
    if (pluginDataChanges && !pluginDataChanges.firstChange) {
      this.pluginDataSubscribers.forEach(sub => {
        sub.next(this.pluginData);
      });
    }
  }

  ngOnDestroy(): void {
    Array.from(this.componentRefMap.values()).forEach(element => {
      element.destroy();
    });

    this.componentRefMap.clear();

    this.pluginDataSubscribers.forEach(sub => {
      sub.unsubscribe();
    });
  }

  loadAllPlugins() {
    let plugins = PluginRegistry.getPlugins(this.hostName);

    if (this.reverse) {
      plugins = plugins.reverse();
    }

    if (plugins.length > 0) {
      let loadOrder = PluginRegistry.getLoadOrder(this.hostName);
      if (loadOrder) {
        loadOrder.forEach(sel => {
          let plugin = plugins.find(x => x.selector === sel);
          if (plugin) {
            this.checkAndLoadPlugin(sel, plugin);
          }
        });
      } else {
        plugins.forEach(plugin => {
          const sel = plugin.selector;
          this.checkAndLoadPlugin(sel, plugin);
        });
      }
    }
  }

  checkAndLoadPlugin(sel: string, plugin) {
    if (
      !this.componentRefMap.has(sel) ||
      this.componentRefMap.get(sel) === null
    ) {
      this.componentRefMap.set(sel, null);
      this.load(plugin);
    }
  }

  load(plugin) {
    const selector = plugin.selector;
    const component = plugin.component;
    const cmpFactory = this.cfr.resolveComponentFactory(PluginComponent);
    this.vcr.createEmbeddedView(this.templateRef);
    const componentRef = this.vcr.createComponent(cmpFactory);

    componentRef.instance.component = component;
    componentRef.instance.data = this.pluginDataObs;
    componentRef.instance.canRender =
      plugin.canRender ||
      new Observable<boolean>(obs => {
        obs.next(true);
        obs.complete();
      });

    this.componentRefMap.set(selector, componentRef);
  }
}
