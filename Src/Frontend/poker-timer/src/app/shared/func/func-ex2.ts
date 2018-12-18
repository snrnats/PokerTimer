import { FuncEx0 } from "./func-ex0";
import { FuncEx3 } from "./func-ex3";

export class FuncEx2<K, M, R> extends Function {
  constructor(private _f: Func2<K, M, R>) {
    super();
  }

  call(arg1: K, arg2: M): R {
    return this._f(arg1, arg2);
  }

  wrap(wrapFunc: Func3<Func2<K, M, R>, K, M, R>): FuncEx2<K, M, R> {
    const f = this._f;
    this._f = (arg1, arg2) => wrapFunc(f, arg1, arg2);
    return this;
  }

  apply(arg1: K, arg2: M): FuncEx0<R> {
    const f = this._f;
    return new FuncEx0(() => f(arg1, arg2));
  }
}
