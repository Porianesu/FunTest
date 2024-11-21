// 变量提升与函数提升
// console.log(v1);
// var v1 = 100;
// function foo() {
//   console.log(v1);
//   var v1 = 200;
//   console.log(v1);
// }
// foo();
// console.log(v1);

// console.log("start");
// setTimeout(() => {
//   console.log("setImmediate");
// }, 0);
// setInterval(() => {
//   console.log("setInterval");
// }, 1000);
// setTimeout(() => {
//   console.log("timeout2");
//   new Promise((resolve, reject) => {
//     resolve();
//     console.log("timeout2_promise");
//   }).then(() => {
//     console.log("timeout2_then");
//   });
// }, 1000);
// for (let i = 1; i < 6; i++) {
//   setTimeout(() => {
//     console.log("loop" + i);
//     console.log(new Date().getTime());
//   }, i * 1000);
//   console.log(i);
// }
// setTimeout(() => {
//   console.log("timeout1");
//   new Promise((resolve, reject) => {
//     resolve();
//     console.log("timeout1_promise");
//   }).then(() => {
//     console.log("timeout1_then");
//   });
// }, 2000);
// async function xhr() {
//   console.log("xhr");
//   return "async";
// }
// async function asyncFn() {
//   console.log("asyncFn");
//   const tag = await xhr();
//   return tag;
// }
//
// asyncFn().then((res) => console.log("asyncFn().then", res));
// new Promise((resolve, reject) => {
//   console.log("promise1");
//   reject();
// }).catch(() => {
//   console.log("catch1");
// });
const B = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    console.log("B");
  });
};
const A = async () => {
  console.log("A start");
  await B();
  console.log("A end");
};
A();
