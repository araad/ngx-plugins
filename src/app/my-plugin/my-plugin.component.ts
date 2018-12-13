import { Component, OnInit } from '@angular/core';
import { Plugin } from 'ngx-plugins';

@Component({
  selector: 'ngx-my-plugin',
  templateUrl: './my-plugin.component.html',
  styleUrls: ['./my-plugin.component.scss']
})
@Plugin({
  selector: 'ngx-my-plugin',
  hostNames: ['MyPluginHost']
})
export class MyPluginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
