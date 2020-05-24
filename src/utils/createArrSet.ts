export function createArrSet<T1,T2,T3,T4,T5>(val1:T1, val2:T2, val3?:T3, val4?:T4, val5?:T5){
  return [val1, val2, val3, val4, val5] as [T1,T2,T3,T4,T5];
}