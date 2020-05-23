import React from "react";

export function getChildOfType(children:JSX.Element|undefined, type:any){
  return React.Children.toArray(children).find(x => (x as JSX.Element).type === type);
}