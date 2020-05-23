import { ISettings } from "../../models/settings";
import { createAction } from "@reduxjs/toolkit";
import { IDataAction } from "../../models/dataAction";
import { payloadGenerator } from "./payloadGenerator";
import { projectsReducer } from "./projects";

export const settingsAction = createAction('updateSettings', payloadGenerator<ISettings>());

export function settingsReducer(state: ISettings, action:IDataAction<ISettings>){
  if(action.type === settingsAction.type){
    return {
      ...action.payload
    }
  }
  return {
    ...state,
    projects: projectsReducer(state.projects ?? [], action as any)
  } as ISettings;
}