import * as __fs from "fs";
const fs:typeof __fs = window.require('fs');

export class FileService{
  constructor(){

  }
  getSettings(){
    console.log(fs.readFileSync('tsconfig.json').toString());
  }
}

export const fileSvc = new FileService();