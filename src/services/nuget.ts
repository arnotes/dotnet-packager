import { IDictionary } from "../models/dictionary";
import { IProjectInfo } from "../models/projectInfo";
import { IProjectStatus } from "../models/projectStatus";
import { projectStateSlicer } from "../redux/reducers/projectStateSlicer";
import { hasParent } from "../utils/hasParent";
import { fileSvc } from "./fileService";
import { shellSvc } from "./shellService";

export class nuget{
  static publish(project:IProjectInfo){
    console.log(`publishing ${project.name}`);
  }

  static installToParents(project:IProjectInfo){
    for (const parent of project.parents||[]) {
      console.log(`installing ${project.name} to ${parent}`);
    }
  }  

  static publishBatch(projects:IProjectInfo[]){
    for (const proj of projects) {
      nuget.publish(proj);
    }

    for (const proj of projects) {
      nuget.installToParents(proj);
    }

    // const parents = projects.reduce
    // for (const parent of object) {
      
    // }
  }

  static loadVersionsToState(projects:IProjectInfo[],dispatch:any){
    const nameToVersion:IDictionary<string> = {};
    for (const proj of projects) {
      nameToVersion[proj.name] = nuget.getProjectVersion(proj);
    }
    dispatch(projectStateSlicer.actions.setProjectVersions(nameToVersion));
  }

  static getClimbingPublish(toPublish:IProjectInfo[], allProjects:IProjectInfo[]){
    const publishList:string[] = [];
    const addToPublishList =  (projects:IProjectInfo[]) => {
      projects.forEach(proj => !publishList.includes(proj.name) && publishList.push(proj.name));
      const parents = allProjects.filter(parent =>
                                  !publishList.includes(parent.name) && 
                                  projects.some(child => hasParent(child, parent.name))
                                );
      parents.length && addToPublishList(parents);
    }
    addToPublishList(toPublish);
    const checklist:IDictionary<boolean> = {};
    publishList.forEach(x => checklist[x] = true);
    return checklist;
  }

  static getProjectVersion(project:IProjectInfo){
    const parser = new DOMParser();
    const str = fileSvc.readFile(project.path);
    const xmlDoc = parser.parseFromString(str,"text/xml");
    return xmlDoc.querySelector('Version').innerHTML;
  }

  static async _build(projState:IDictionary<IProjectStatus>, projects:IProjectInfo[]){
    const toPublish = projects.filter(x => projState[x.name]?.checkForPublish);
    return await nuget.build(toPublish[0]);
  }

  static async build(proj:IProjectInfo){
    
    //const args = ['build'];
    const result = await shellSvc.command('dotnet build --force', shellSvc.getDirname(proj.path));
    console.log('nuget.build', result);
    return result;
  }
}