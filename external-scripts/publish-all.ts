import { IProjectInfo } from "../src/models/projectInfo";
import { ISettings } from "../src/models/settings";
import { getProjectParents } from "../src/utils/getProjectParents";
import { nuget } from "../src/services/nuget";
import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
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

  console.log('---TEST---');
  const files = fs.readdirSync(outPutDir);
  console.log(JSON.stringify(files));
  console.log('---TEST---');

  const nupkg = files.find(x => !x.includes('.symbols.'));
  if(!nupkg){
    throw new Error('failed to generate package');
  }
  return nupkg;
}
//----------------------------------------------------------------------------------------------
function pushPackage(nupkg:string, proj:IProjectInfo){
  const cwd = path.dirname(proj.path);
  const outPutDir = path.join(cwd, outputPath);

  const push = execSync(`dotnet nuget push ${nupkg} --skip-duplicate -k ${settings.nugetKey} -s ${settings.nugetSource}`,{
    maxBuffer,
    cwd: outPutDir
  });
  console.log(push.toString());
}
//----------------------------------------------------------------------------------------------
function installToParents(nupkg:string, child:IProjectInfo){
  const parents = getProjectParents(child, settings.projects ?? []);
  for (const parent of parents) {
    console.log(`Installing ${child.name} to ${parent.name}`)

    const csprojXml = nuget.getXML(parent);
    const packRef = csprojXml.querySelector(`PackageReference[Include="${child.name}"]`);
    const childVersion = nupkg.replace(`${child.name}.`,'').replace('.nupkg','');
    packRef.setAttribute('Version', childVersion);
    nuget.writeXML(csprojXml, parent);

    buildProject(parent);
  }
}
//----------------------------------------------------------------------------------------------
const main = async () => {
  try {    
    for (const proj of toPublish) {
      const nupkg = packProject(proj);
      pushPackage(nupkg, proj);
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