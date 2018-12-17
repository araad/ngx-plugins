# ngx-plugins

Create components that can be dynamically loaded at runtime into a "plugin host". A plugin host is any element that has the ```ngxPluginHost``` directive which will be used as the location to render the plugin component.

This library is built on top of the [Portal](https://material.angular.io/cdk/portal/overview) package from @angular/cdk.

## Installation
```
npm install --save ngx-plugins
```

## Usage

#### Create a plugin
```javascript
import { Component, Inject, OnInit } from '@angular/core';
import { NGX_PLUGIN_DATA, Plugin } from 'ngx-plugins';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-my-plugin-with-data',
  templateUrl: './my-plugin-with-data.component.html',
  styleUrls: ['./my-plugin-with-data.component.scss']
})
@Plugin({
  selector: 'ngx-my-plugin-with-data',
  hostNames: ['MyPluginHost']
})
export class MyPluginWithDataComponent implements OnInit {
  constructor(@Inject(NGX_PLUGIN_DATA) public data: Observable<Date>) {}

  ngOnInit() {}
}
```

```html
<p>
  my-plugin-with-data works! Data: {{data | async | date:'medium'}}
</p>
```

You must add the plugin component to the declaring module's ```entryComponents```.

#### Create a plugin host
From the component where you want to host plugins
```html
<div>
  <p>Plugins will show underneath:</p>
  <ng-template
    ngxPluginHost
    hostName="MyPluginHost"
    [pluginData]="myData"
  ></ng-template>
</div>

```

A plugin host can host multiple plugins, just add the host to the ```hostName``` list of all the plugins.

A plugin can be hosted in several hosts, just add the names of all the hosts in the plugin's ```hostName``` list.