import * as __fs from "fs";
import { ISettings } from "../models/settings";
const fs:typeof __fs = window.require('fs');

export class FileService{
  getSettings():ISettings{
    const str = fs.readFileSync('settings.json').toString();
    return JSON.parse(str);
  }
}

export const fileSvc = new FileService();