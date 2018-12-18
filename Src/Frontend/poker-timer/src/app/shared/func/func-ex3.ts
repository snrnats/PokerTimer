export class FuncEx3<K, M, N, R> extends Function {
  constructor(private _f: FuncEx3<K, M, N, R>) {
    super();
  }

  call(arg1: K, arg2: M, arg3: N): R {
    return this._f(arg1, arg2, arg3);
  }
}
