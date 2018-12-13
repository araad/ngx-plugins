import { PluginConfig } from "./plugin.config";
import { Observable } from "rxjs";
export interface PluginExtensionConfig {
    component: any;
}
export class PluginType implements PluginConfig, PluginExtensionConfig {
    hostNames: string[];
    canRender: Observable<boolean>;
    component: any;
    selector: string;
}