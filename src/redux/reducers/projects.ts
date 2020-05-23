import { createAction } from "@reduxjs/toolkit";
import { IProjectInfo } from "../../models/projectInfo";
import { IArrayItemAction } from "../../models/arrayItemAction";
import { payloadGenerator } from "./payloadGenerator";

export const projectsAction = createAction('updateSingleProject', payloadGenerator<IArrayItemAction<IProjectInfo>>());

export function projectsReducer(state:IProjectInfo[], action:IArrayItemAction<IProjectInfo>){
  if(action.type === projectsAction.type){
    return [
      ...state.slice(0, action.payload.index),
      action.payload.data,
      ...state.slice(action.payload.index + 1)
    ]
  }

 return state;
}