export interface IProjectInfo{
  name: string;
  path: string;
  parents?: string[];
  checkedForPublish?: boolean;
}