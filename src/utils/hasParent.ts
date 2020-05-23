import { IProjectInfo } from "../models/projectInfo";

export const hasParent = (child:IProjectInfo, parentName:string) => {
  const parentNames = (child.parents ?? []).map(x => x.trim().toLowerCase());
  return parentNames.includes(parentName.trim().toLowerCase());
}