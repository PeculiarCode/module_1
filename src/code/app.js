new Promise((resolve, reject) => {
    setTimeout(() => {
        const a = 'hello'
        resolve(a)
    }, 30)
})
    .then((res) => {
        const b = res + ' ' + 'lagou'
        return b
    })
    .then((res) => {
        const c = res + ' ' + 'i love you'
        console.log(c)
    })

const cars = [
    {
        name: 'Ferrari FF',
        horsepower: 660,
        dollar_value: 700000,
        in_stock: true,
    },
    {
        name: 'Spyker C12 Zagato',
        horsepower: 650,
        dollar_value: 648000,
        in_stock: false,
    },
    {
        name: 'Jaguar XKR-S',
        horsepower: 550,
        dollar_value: 132000,
        in_stock: false,
    },
    {
        name: 'Audi R8',
        horsepower: 525,
        dollar_value: 114200,
        in_stock: false,
    },
    {
        name: 'Aston Martin One-77',
        horsepower: 750,
        dollar_value: 1850000,
        in_stock: true,
    },
    {
        name: 'Pagani Huayra',
        horsepower: 700,
        dollar_value: 1300000,
        in_stock: false,
    },
]
//fp模块函数优先,数据之后
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
//练习1
const isLastInStock = () => {
    return fp.flowRight(fp.prop('in_stock'), fp.last)
}
let res = isLastInStock()
console.log(res(cars))
//练习2
const first = fp.flowRight(fp.prop('name'), fp.first)
console.log(first(cars))
//练习3
function _average(xs) {
    return fp.reduce(fp.add, 0, xs)
}
const avarageDollarValue = () => {
    return fp.flowRight(_average, fp.map((item) => item.dollar_value))
}
const average = avarageDollarValue()
console.log(average(cars))
//练习4
let _underscore = fp.replace(/\W+/g, '_')
// let str = ['Hello World']
// let qus = fp.flowRight(fp.split(','),_underscore, fp.toLower, fp.split(' '), fp.join(' '))
// console.log(qus(str))
const sanitizeNames = () => {
    return fp.flowRight(fp.split(','), _underscore, fp.toLower, fp.split(' '), fp.join(' '))
}
let transValue = sanitizeNames()
console.log(transValue(['Hello World']));

//练习5
//只考虑用了相关api 没有按照函数式编程开发
let maybe = Maybe.of([5, 6, 11])
let ex1 = () => {
    let result = []
    let arr = fp.map(item => item, maybe._value)
    let sum = 0
    for (let i = 1; i < arr.length; i++) {
        sum += arr[i - 1]
    }
    result.push(sum, arr[arr.length - 1])
    return fp.add(...result)
}
let total = ex1()
console.log(total);

//练习6
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
    return fp.first(xs._value)
}
let firstVal = ex2()
console.log(firstVal);


