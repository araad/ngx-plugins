import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PluginHostDirective } from './plugin-host.directive';
import { PluginComponent } from './plugin.component';

@NgModule({
  declarations: [PluginHostDirective, PluginComponent],
  imports: [CommonModule, PortalModule],
  entryComponents: [PluginComponent],
  exports: [PluginHostDirective]
})
export class NgxPluginsModule {}
