import * as __cp from "child_process";
const cp:typeof __cp = window.require('child_process');

export class FileService {
 dotnetVersion(){
   console.log(cp.execSync('dotnet --version').toString());
 }
}

export const shellSvc = new FileService();