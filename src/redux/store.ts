import { createStore } from "@reduxjs/toolkit";
import { IAppState } from "../models/appState";
import { settingsReducer } from "./reducers/settings";
export const store = createStore((state:IAppState|undefined, action:any) => {
  state = state || {};
  return {
    settings: settingsReducer(state.settings ?? {}, action)
  } as IAppState
});