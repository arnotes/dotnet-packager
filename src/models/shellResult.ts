export class ShellResult{
  constructor(code:number, signal:any){
    this.code = code;
    this.signal = signal;
  }
  get success(){
    return this.code === 1;
  }
  code:number;
  signal:any;
}