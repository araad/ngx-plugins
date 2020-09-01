import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MyPluginComponent } from './my-plugin/my-plugin.component';
import { NgxPluginsModule } from 'ngx-plugins';
import { MyPluginDataComponent } from './my-plugin-data/my-plugin-data.component';

@NgModule({
  declarations: [AppComponent, MyPluginComponent, MyPluginDataComponent],
  imports: [BrowserModule, NgxPluginsModule],
  entryComponents: [MyPluginComponent, MyPluginDataComponent],
  providers: [
    {
      // Workaround for Ivy compiler not loading all components from entryComponents
      provide: 'AppModulePlugins',
      useValue: [MyPluginComponent, MyPluginDataComponent]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
