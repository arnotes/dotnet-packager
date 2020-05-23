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
  },
})