import { FuncEx1 } from "./func-ex1";
import { FuncEx2 } from "./func-ex2";

export class FuncEx0<R> extends Function {
  constructor(private _f: Func0<R>) {
    super();
  }

  call(): R {
    return this._f();
  }

  wrap(wrapFunc: Func1<Func0<R>, R>): FuncEx0<R> {
    const f = this._f;
    this._f = () => wrapFunc(f);
    return this;
  }

  extend2<K, M>(): FuncEx2<K, M, R> {
    const f = this._f;
    return new FuncEx2<K, M, R>((arg1, arg2) => f());
  }

  extend1<K>(): FuncEx1<K, R> {
    const f = this._f;
    return new FuncEx1<K, R>(arg => f());
  }
}
