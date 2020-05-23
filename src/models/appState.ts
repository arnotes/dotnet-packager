import { ISettings } from "./settings";
import { IDictionary } from "./dictionary";
import { IProjectStatus } from "./projectStatus";

export interface IAppState{
  search?: string;
  settings?: ISettings;
  projectState?: IDictionary<IProjectStatus>
}