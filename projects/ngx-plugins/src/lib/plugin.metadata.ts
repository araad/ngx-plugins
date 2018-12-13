import { PluginConfig } from "./plugin.config";
import { PluginRegistry } from "./plugin.registry";

export function Plugin(config: PluginConfig) {
    return function (target) {
        PluginRegistry.registerPlugin(config, target);

        return target;
    }
}