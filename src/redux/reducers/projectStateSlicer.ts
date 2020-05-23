import { createSlice } from "@reduxjs/toolkit";
import { IDictionary } from "../../models/dictionary";
import { IProjectStatus } from "../../models/projectStatus";

interface IProjectStatePayload {
  name: string;
  status: IProjectStatus
}

interface ICheckPublishPayload {
  name: string;
  checked: boolean;
}

export const projectStateSlicer = createSlice({
  name: 'projectStateSlicer',
  initialState: {} as IDictionary<IProjectStatus>,
  reducers: {
    setProjectState: (state, action: { payload: IProjectStatePayload }) => {
      return { ...state, [action.payload.name]: action.payload.status }
    },
    setCheckForPublish: (state, action: { payload: ICheckPublishPayload }) => {
      return { 
        ...state, 
        [action.payload.name]: {
          ...state[action.payload.name],
          checkForPublish: action.payload.checked
        } 
      }
    },
    setCheckPublishValues: (state, action: { payload: IDictionary<boolean> }) => {
      const newState = {...state};
      for (const key in action.payload) {
        newState[key] = {
          ...newState[key],
          checkForPublish: action.payload[key]
        }
      }
      return newState;
    },
    unCheckPublishValuesAll: (state) => {
      const newState = {...state};
      for (const key in newState) {
        newState[key] = {
          ...newState[key],
          checkForPublish: false
        }
      }
      return newState;
    },    
    setProjectVersions: (state, action: { payload: IDictionary<string> }) => {
      const newState = {...state};
      for (const key in action.payload) {
        newState[key] = {
          ...newState[key],
          version: action.payload[key]
        }
      }
      return newState;
    }
  },
})