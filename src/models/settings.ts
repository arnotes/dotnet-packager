import { IProjectInfo } from "./projectInfo";

export interface ISettings{
  projects?: IProjectInfo[];
  nugetKey?: string;
  nugetSource?: string;
  nugetAuthSource?: string;
}