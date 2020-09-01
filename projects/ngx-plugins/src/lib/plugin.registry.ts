import { Subject } from 'rxjs';
import { PluginConfig } from './plugin.config';
import { PluginType } from './plugin.type';

export function registerPluginLoadOrder(
  hostNames: Array<string>,
  pluginSelectors: Array<string>
) {
  PluginRegistry.registerLoadOrder(hostNames, pluginSelectors);
}

export class PluginRegistry {
  private static plugins = new Map<string, PluginType>();
  private static pluginRegistered = new Subject<Array<string>>();
  public static pluginRegistered$ = PluginRegistry.pluginRegistered.asObservable();
  private static loadOrderMap = new Map<string, Array<string>>();

  static registerLoadOrder(
    hostNames: Array<string>,
    pluginSelectors: Array<string>
  ) {
    hostNames.forEach((host) => {
      this.loadOrderMap.set(host, pluginSelectors);
    });
  }

  static getLoadOrder(hostName: string) {
    if (this.loadOrderMap.has(hostName)) {
      return this.loadOrderMap.get(hostName);
    }
  }

  static registerPlugin(config: PluginConfig, component) {
    const pluginType = <PluginType>config;
    pluginType.component = component;

    this.plugins.set(config.selector, pluginType);
    this.pluginRegistered.next(config.hostNames);
  }

  static getPlugins(hostName: string) {
    const records = Array.from(this.plugins.values()).filter((p) =>
      p.hostNames.find((name) => name === hostName)
    );
    const plugins = records.map((rec) => {
      return {
        selector: rec.selector,
        component: rec.component,
        canRender: rec.canRender,
      };
    });

    return plugins;
  }

  getPlugins(hostName: string) {
    return PluginRegistry.getPlugins(hostName);
  }
}
