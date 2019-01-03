import {
  ComponentPortal,
  ComponentType,
  Portal,
  PortalInjector
} from '@angular/cdk/portal';
import {
  Component,
  InjectionToken,
  Injector,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';

export const NGX_PLUGIN_DATA = new InjectionToken<any>('NGX_PLUGIN_DATA');

@Component({
  selector: 'ngx-plugin',
  template: `
  <ng-container *ngIf="canRender | async">
      <ng-template [cdkPortalOutlet]="portalInstance"></ng-template>
    </ng-container>
  `,
  styles: [`
  :host {
    width: 100%;
  }
  `]
})
export class PluginComponent implements OnInit {
  portalInstance: Portal<any>;
  @Input() component: ComponentType<any>;
  @Input() data: Observable<any>;
  @Input() canRender: Observable<boolean>;

  constructor(private _injector: Injector) {}

  ngOnInit() {
    this.portalInstance = new ComponentPortal(
      this.component,
      null,
      this.createInjector(this.data)
    );
  }

  createInjector(data: any): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(NGX_PLUGIN_DATA, data);
    return new PortalInjector(this._injector, injectorTokens);
  }
}
