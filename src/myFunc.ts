const extend = (
  sup: { prototype: object | null; apply: (arg0: any, arg1: any) => void },
  base: { prototype: object | null; apply: (arg0: any, arg1: any) => void }
) => {
  const descriptor = Object.getOwnPropertyDescriptor(
    base.prototype,
    "constructor"
  );
  if (descriptor) {
    base.prototype = Object.create(sup.prototype);
    const handler = {
      construct: function (target: any, args: any) {
        const obj = Object.create(base.prototype);
        this.apply(target, obj, args);
        return obj;
      },
      apply: function (target: any, that: any, args: any) {
        sup.apply(that, args);
        base.apply(that, args);
      },
    };
    const proxy = new Proxy(base, handler);
    descriptor.value = proxy;
    Object.defineProperty(base.prototype, "constructor", descriptor);
    return proxy;
  }
};

export class Test {
  publicA = "publicA";
  static publicA = "static publicA";
  private privateA = "privateA";
  private static privateB = "static privateB";
  publicMethodA() {
    console.log(this.publicA);
    console.log("publicMethodA");
    this.privateMethodA();
  }
  static publicMethodB() {
    console.log("static publicMethodB");
    this.privateMethodB();
  }
  private privateMethodA() {
    console.log("privateMethodA");
  }
  private static privateMethodB() {
    console.log(this.privateB);
    console.log("static privateMethodB");
  }
}
export default { extend, Test };
