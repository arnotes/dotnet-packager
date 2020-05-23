import { IProjectInfo } from "../models/projectInfo";

export namespace nuget{
  export function publish(project:IProjectInfo){
    console.log(`publishing ${project.name}`);
  }

  export function installToParents(project:IProjectInfo){
    for (const parent of project.parents||[]) {
      console.log(`installing ${project.name} to ${parent}`);
    }
  }  

  export function publishBatch(projects:IProjectInfo[]){
    for (const proj of projects) {
      publish(proj);
    }

    for (const proj of projects) {
      installToParents(proj);
    }

    // const parents = projects.reduce
    // for (const parent of object) {
      
    // }
  }
}