import { IArrayPayload } from "./arrayPayload";

export interface IArrayItemAction<T>{
  type?: string,
  payload:IArrayPayload<T>
}