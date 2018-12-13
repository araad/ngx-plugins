import {
  BasePortalOutlet,
  CdkPortalOutletAttachedRef,
  ComponentPortal,
  ComponentType,
  Portal,
  TemplatePortal
} from '@angular/cdk/portal';
import {
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef
} from '@angular/core';
import { Observable } from 'rxjs';

export abstract class PortalOutletBase extends BasePortalOutlet
  implements OnInit, OnDestroy {
  private _isInitialized = false;

  private _attachedRef: CdkPortalOutletAttachedRef;

  constructor(
    private cfr: ComponentFactoryResolver,
    private vcr: ViewContainerRef,
    private zone: NgZone
  ) {
    super();
  }

  get portal(): Portal<any> | null {
    return this._attachedPortal;
  }

  set portal(portal: Portal<any> | null) {
    if (this.hasAttached() && !portal && !this._isInitialized) {
      return;
    }

    if (this.hasAttached()) {
      super.detach();
    }

    if (portal) {
      super.attach(portal);
    }

    this._attachedPortal = portal;
  }

  @Output()
  attached: EventEmitter<CdkPortalOutletAttachedRef> = new EventEmitter<
    CdkPortalOutletAttachedRef
  >();

  get attachedRef(): CdkPortalOutletAttachedRef {
    return this._attachedRef;
  }

  ngOnInit() {
    this._isInitialized = true;

    let portal = this.getPortalConfig();
    this.loadPortal(portal.component);
  }

  ngOnDestroy() {
    if (this.portal) {
      this.detach();
    }

    this._attachedPortal = null;
    this._attachedRef = null;

    this.attached.unsubscribe();
  }

  loadPortal(component) {
    if (!this.portal) {
      let portalInstance = new ComponentPortal(component);

      this.attachComponentPortal(portalInstance);
    }
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    portal.setAttachedHost(this);

    const viewContainerRef =
      portal.viewContainerRef != null ? portal.viewContainerRef : this.vcr;

    const componentFactory = this.cfr.resolveComponentFactory(portal.component);

    const ref = viewContainerRef.createComponent(
      componentFactory,
      viewContainerRef.length,
      portal.injector || viewContainerRef.parentInjector
    );

    super.setDisposeFn(() => ref.destroy());
    this._attachedPortal = portal;
    this._attachedRef = ref;
    this.attached.emit(ref);

    return ref;
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    throw new Error('Method not implemented.');
  }

  abstract getPortalConfig(): {
    canRender: Observable<boolean>;
    component: ComponentType<any>;
  };
}
