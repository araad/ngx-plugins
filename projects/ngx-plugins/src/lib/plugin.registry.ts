import { Subject } from 'rxjs';
import { PluginConfig } from './plugin.config';
import { PluginType } from './plugin.type';

export class PluginRegistry {
  private static plugins = new Map<string, PluginType>();
  private static pluginRegistered = new Subject<Array<string>>();
  public static pluginRegistered$ = PluginRegistry.pluginRegistered.asObservable();

  static registerPlugin(config: PluginConfig, component) {
    if (this.plugins.has(config.selector)) {
      return;
    }

    const pluginType = <PluginType>config;
    pluginType.component = component;

    this.plugins.set(config.selector, pluginType);
    this.pluginRegistered.next(config.hostNames);
  }

  static getPlugins(hostName: string) {
    const records = Array.from(this.plugins.values()).filter(p =>
      p.hostNames.find(name => name === hostName)
    );
    const plugins = records.map(rec => {
      return {
        selector: rec.selector,
        component: rec.component,
        canRender: rec.canRender
      };
    });

    return plugins;
  }

  getPlugins(hostName: string) {
    return PluginRegistry.getPlugins(hostName);
  }
}
