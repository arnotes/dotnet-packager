import * as __fs from "fs";
import { ISettings } from "../models/settings";
import { IProjectInfo } from "../models/projectInfo";
import { hasParent } from "../utils/hasParent";
const fs:typeof __fs = window.require('fs');

export class FileService{
  getSettings():ISettings{
    const str = fs.readFileSync('settings.json').toString();
    const settings:ISettings = JSON.parse(str);
    settings.projects = settings.projects ?? [];
    const level0Projects = settings.projects.filter(x => {
      const isParent = settings.projects?.some(child => hasParent(child, x.name));
      return !isParent;
    });
    level0Projects.forEach(x => x.level = 0);

    const setParentsLevel = (children: IProjectInfo[], level:number) => {
      const parents = (settings.projects ?? []).filter(parent => children.some(child => hasParent(child, parent.name)));
      parents?.forEach(x => x.level = level);
      level++;
      parents.length  && setParentsLevel(parents, level);
    }
    setParentsLevel(level0Projects, 1);

    settings.projects.sort((a,b) => {
      let levelScore = 0;
      if(a.level < b.level)
        levelScore = -1;
      else if(a.level > b.level)
        levelScore = 1;

      let nameScore = a.name.toLowerCase().localeCompare(b.name.toLowerCase());

      return (levelScore * 10) + nameScore;
    });
    return settings;
  }

  readFile(path:string){
    const str = fs.readFileSync(path).toString();
    return str;
  }
}

export const fileSvc = new FileService();