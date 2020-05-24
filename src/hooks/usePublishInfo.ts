import { useSelector } from "react-redux";
import { IAppState } from "../models/appState";
import { IDictionary } from "../models/dictionary";
import { IProjectStatus } from "../models/projectStatus";
import { IProjectInfo } from "../models/projectInfo";
import { useMemo } from "react";
import { createArrSet } from "../utils/createArrSet";

interface IPublishInfo{
  projState:IDictionary<IProjectStatus>,
  projects:IProjectInfo[]
}

export function usePublishInfo(){
  const data = useSelector<IAppState,IPublishInfo>(
    state => {
      const projState = state.projectState ?? {};
      const projects = state.settings.projects ?? [];
      return{
        projState,
        projects
      }
    },
    (a, b) => {
      return a.projState === b.projState ||
        a.projects.length === b.projects.length
    }
  );

  const hasPublish = useMemo(
    () => Object.keys(data.projState).some(key => data.projState[key].checkForPublish ?? false),
    [data.projState]
  )

  return createArrSet(data.projState, data.projects, hasPublish);
}