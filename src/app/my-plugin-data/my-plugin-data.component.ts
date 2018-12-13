import { Component, Inject, OnInit } from '@angular/core';
import { NGX_PLUGIN_DATA, Plugin } from 'ngx-plugins';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-my-plugin-data',
  templateUrl: './my-plugin-data.component.html',
  styleUrls: ['./my-plugin-data.component.scss']
})
@Plugin({
  selector: 'ngx-my-plugin-data',
  hostNames: ['MyPluginHost']
})
export class MyPluginDataComponent implements OnInit {
  constructor(@Inject(NGX_PLUGIN_DATA) public data: Observable<Date>) {}

  ngOnInit() {}
}
