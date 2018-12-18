import { FuncEx0 } from "./func-ex0";
import { FuncEx2 } from "./func-ex2";

export class FuncEx1<K, R> extends Function {
  constructor(private _f: (arg: K) => R) {
    super();
  }

  call(arg: K): R {
    return this._f(arg);
  }

  wrap(wrapFunc: FuncEx2<FuncEx1<K, R>, K, R>): FuncEx1<K, R> {
    const f = this._f;
    this._f = arg => wrapFunc(f, arg);
    return this;
  }

  apply(arg: K): FuncEx0<R> {
    const f = this._f;
    return new FuncEx0(() => f(arg));
  }
}
