import * as __cp from "child_process";
import * as __path from 'path';
import { Subject } from "rxjs";
import { take } from "rxjs/operators";
import { ShellResult } from "../models/shellResult";
const cp: typeof __cp = window.require('child_process');
const path: typeof __path = window.require('path');

export class ShellService {
  dotnetVersion() {
    console.log(cp.execSync('dotnet --version').toString());
  }

  // command(cmd: string, args:string[], path: string = '.') {
  //   const sbjResult = new Subject<any>();
  //   const cmdResult = cp.spawn(cmd, args, {
  //     cwd: path,
  //     detached: true,
  //     stdio: [0, 'pipe', 'pipe']//https://stackoverflow.com/questions/30699666/nodejs-process-spawn-exit-event-not-firing?rq=1
  //   })
  //   .on('exit', (code, signal) => {
  //     console.log('command.exit');
  //     sbjResult.next({code, signal});
  //   });
  //   console.log({cmdResult});
  //   return sbjResult.pipe(take(1)).toPromise();
  // }

  //https://stackoverflow.com/questions/22337446/how-to-wait-for-a-child-process-to-finish-in-node-js
  command(cmd: string, path: string = '.') {
    const sbjResult = new Subject<ShellResult>();
    const cmdResult = cp.exec(cmd, {
      cwd: path,
      maxBuffer: 5e+8,
      windowsHide: false
    });
    //cmdResult.stdout.pipe(process.stdout)
    cmdResult.on('exit', (code:number, signal:any) => {
      //process.exit();
      console.log('shell.command.exit',{code, signal});
      sbjResult.next(new ShellResult(code, signal));
      sbjResult.complete();
      cmdResult.removeAllListeners();
    }).on('error', (code:number, signal:any)=>{
      console.log('shell.command.error',{code, signal});
      sbjResult.next(new ShellResult(code, signal));
      sbjResult.complete();
      cmdResult.removeAllListeners();      
    });
    return sbjResult.pipe(take(1)).toPromise();
  }
  getDirname(filePath: string) {
    return path.dirname(filePath);
  }
}

export const shellSvc = new ShellService();