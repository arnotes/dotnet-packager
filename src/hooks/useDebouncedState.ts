import { useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

export function useDebouncedState<T>(realState:T, callBack:(stateVal:T) => void):[T, (val:T) => void]{
  const [state, setState] = useState(realState);
  const sbjRef = useRef(new Subject<T>())
  const callbackRef = useRef(callBack);
  callbackRef.current = callBack;

  useEffect(()=>{
    const sub = sbjRef.current
                .pipe(debounceTime(500))
                .subscribe(x => callbackRef.current(x));
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => setState(realState), [realState])

  return [
    state, 
    (stateVal:T) => {
      setState(stateVal);
      sbjRef.current.next(stateVal);
    }
  ];
}