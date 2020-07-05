import { IProjectInfo } from "../src/models/projectInfo";
import { ISettings } from "../src/models/settings";
import { getProjectParents } from "../src/utils/getProjectParents";
import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
//----------------------------------------------------------------------------------------------
function createPromise(ms:number){
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}
//----------------------------------------------------------------------------------------------
const maxBuffer = 5e+8;
const outputPath = 'bin/dotnet-packager';
const toPublish:IProjectInfo[] = JSON.parse(process.argv[2]);
toPublish.sort((a,b) => a.level - b.level);
//----------------------------------------------------------------------------------------------
const settings:ISettings = JSON.parse(process.argv[3]);
//----------------------------------------------------------------------------------------------
function buildProject(proj:IProjectInfo){
  const cwd = path.dirname(proj.path);
  const build = execSync(`dotnet build`,{
    maxBuffer,
    cwd
  });
  console.log(build.toString());  
}
//----------------------------------------------------------------------------------------------
function packProject(proj:IProjectInfo){
  const cwd = path.dirname(proj.path);
  const outPutDir = path.join(cwd, outputPath);

  console.log(`building ${proj.path}`);
  fs.rmdirSync(outPutDir,{
    recursive: true
  });

  buildProject(proj);

  const pack = execSync(`dotnet pack -o ${outputPath}`,{
    maxBuffer,
    cwd
  });
  console.log(pack.toString());

  const files = fs.readdirSync(outPutDir);
  const nupkg = files.find(x => !x.includes('.symbols.'));
  if(!nupkg){
    throw new Error('failed to generate package');
  }
  return nupkg;
}
//----------------------------------------------------------------------------------------------
async function pushPackage(nupkg:string, proj:IProjectInfo){
  const cwd = path.dirname(proj.path);
  const outPutDir = path.join(cwd, outputPath);
  let cmd = `dotnet nuget push ${nupkg} --skip-duplicate `;
  cmd+= `-k ${settings.nugetKey} `;
  cmd+= `-s "${settings.nugetSource}" `;
  cmd+= `-ss "${settings.symbolSource}" `;
  try {    
    const push = execSync(cmd,{
      maxBuffer,
      cwd: outPutDir
    });
    console.log(push.toString());
    await createPromise(2500);
  } catch (error) {
    console.log(cmd);
    console.log(error.stdout.toString());
  }
}
//----------------------------------------------------------------------------------------------
function installToParents(nupkg:string, child:IProjectInfo){
  /**
   * https://github.com/NuGet/Home/issues/5163
   * fail :(
   */
  const parents = getProjectParents(child, settings.projects ?? []);
  const newChildVersion = nupkg.replace(`${child.name}.`,'').replace('.nupkg','');

  for (const parent of parents) {
    console.log(`Installing ${child.name} to ${parent.name}`)
    const cwd = path.dirname(parent.path);
    const install = execSync(`dotnet add package ${child.name} -v ${newChildVersion} -s "${settings.nugetAuthSource}"`,{
    //const install = execSync(`nuget install ${child.name} -Version ${newChildVersion}`,{
      maxBuffer,
      cwd
    });
    console.log(install.toString());    
    //THEN BUILD
    buildProject(parent);
  }
}
//----------------------------------------------------------------------------------------------
const main = async () => {
  try {    
    for (const proj of toPublish) {
      const nupkg = packProject(proj);
      await pushPackage(nupkg, proj);
      installToParents(nupkg, proj);
    }
  } catch (error) {
    console.log(error);
  }
  console.log('ALL DONE!!! \nPRESS ANY KEY TO CONTINUE...');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));  
}

main();