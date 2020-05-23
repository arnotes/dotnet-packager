export function payloadGenerator<T>(){
  return function(payloadData:T){
    return {
      payload: payloadData
    }
  }
}