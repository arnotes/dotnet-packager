import { IProjectInfo } from "../src/models/projectInfo";

const strJson = process.argv[2];
const projects:IProjectInfo[] = JSON.parse(strJson);
projects.sort((a,b) => a.level - b.level);