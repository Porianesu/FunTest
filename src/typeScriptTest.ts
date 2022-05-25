//string number boolean
const stringA: string = "string";
const numberA: number = 0;
const booleanA: boolean = true;
const stringB: typeof stringA = "string";
//Array
const arrayA: number[] = [1, 2, 3];
const arrayB: Array<number> = [1, 2, 3];
//Any
let obj: any = { x: 0 };
//Function
function greet(name: string): number {
  console.log("Hello, " + name.toUpperCase() + "!!");
  return 42;
}
//Object Types
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
// Union Types
function printId(id: ID) {
  if (typeof id === "string") {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id);
  }
}
// Type Aliases
type ID = number | string;
// Interface
interface Point {
  x: number;
  y: number;
}
// Type Assertions
const x = "hello" as unknown as number;
export default stringA;
