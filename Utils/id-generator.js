// export function initCount() {

//     let counter = 0;
//     return function () {

//         counter++;
//         return counter;
//     }
// }

export function* initCount() {

    let count = 0;

    while (true) {

        count++;
        yield count;
    }
}