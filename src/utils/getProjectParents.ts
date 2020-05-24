import { IProjectInfo } from "../models/projectInfo";

export function getProjectParents(project:IProjectInfo, allProjects:IProjectInfo[]){
  allProjects = allProjects ?? [];
  const parentNames = (project.parents ?? []).map(x => x.toLowerCase());
  return allProjects.filter(x => parentNames.includes(x.name.toLowerCase()));
}