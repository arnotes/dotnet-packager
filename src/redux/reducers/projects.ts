import { createAction } from "@reduxjs/toolkit";
import { IArrayItemAction } from "../../models/arrayItemAction";
import { IArrayPayload } from "../../models/arrayPayload";
import { IProjectInfo } from "../../models/projectInfo";
import { payloadGenerator } from "./payloadGenerator";

export const projectsAction = createAction('updateSingleProject', payloadGenerator<IArrayPayload<IProjectInfo>>());
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