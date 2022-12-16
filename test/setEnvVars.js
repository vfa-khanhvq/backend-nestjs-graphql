// set NODE_ENV for run
process.env.NODE_ENV = 'e2e';


// // fake date to month 10
// const fakeDate = '2022-10-10';
// Date = class extends Date {
//   constructor(params) {
//     if (params) {
//       super(params);
//     } else if (global.Date.NOW === undefined) {
//       super(fakeDate);
//     } else {
//       super(fakeDate);
//     }
//   }
//   static now() {
//     return new Date(fakeDate).getTime();
//   }
// };
