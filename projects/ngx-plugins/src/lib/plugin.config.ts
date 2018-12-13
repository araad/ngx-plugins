import { Observable } from "rxjs";

export interface PluginConfig {
  hostNames: string[];
  selector: string;
  canRender?: Observable<boolean>;
}
