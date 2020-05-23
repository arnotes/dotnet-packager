import { createStore } from "@reduxjs/toolkit";
import { IAppState } from "../models/appState";
import { settingsReducer } from "./reducers/settings";
import { searchSlice } from "./reducers/searchSlice";
import { projectStateSlicer } from "./reducers/projectStateSlicer";
export const store = createStore((state:IAppState|undefined, action:any) => {
  state = state || {};
  return {
    settings: settingsReducer(state.settings ?? {}, action),
    search: searchSlice.reducer(state.search ?? '', action),
    projectState: projectStateSlicer.reducer(state.projectState, action)
  } as IAppState
});

(window as any).__store = store;