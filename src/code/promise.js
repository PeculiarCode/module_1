//  promise特点promise是一个class,有resolve,reject,all,race静态方法,实例有finally,then,catch方法
// 每个Promise类都接收(resolve,reject)回调来处理失败或成功的promise
// promise特点state一旦改变不可逆,链式调用的then接收的promise依赖上一个promise返回的resolve或reject
// catch能全局检测reject的promise,finally不管怎样都会执行,
// all接受的参数是promise实例组成的数组或一般值组成的数组,
// race参数也是数组,会返回数组元素第一个状态改变promise实例

// 上一个then方法返回的如果是一个promise实例,下一个then可以接收上一个resolve或reject返回的值
// 上一个then不返回值,下一个then接收undefined作为resolve回调参数
// 上一个then返回普通值,下一个then的resolve接收这个普通值
// 抛出错误和reject都会将state转化为reject,调用then的reject回调
// 返回等待的promise,等待state改变触发resolve回调或reject回调(一般是在处理异步)

const PEDDING = 'pedding'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
    //class构造器函数胡立即执行
    constructor(exec) {
        exec(this.resolve, this.reject)
    }
    state = PEDDING
    //成功传入的参数
    value = ''
    //收集resolve的回调函数
    successCallpack = []
    //失败传入的参数
    reason = ''
    //收集reject的回调函数
    failCallback = []
    resolve = (value) => {
        //利用箭头函数访问this
        //promise的state一旦改变就不可逆
        if (this.state !== PEDDING) return
        //将pedding转化为FULFILLED
        this.state = FULFILLED
        //将成功的promise传入的参数赋值
        this.value = value
        //实现then的链式调用
        while (this.successCallpack.length) this.successCallpack.shift()()
    }
    reject = (reason) => {
        if (this.state !== PEDDING) return
        this.state = REJECTED
        this.reason = reason
        while (this.failCallback.length) this.failCallback.shift()()
    }
    //then接收成功或失败回调,then可以链式调用应返回一个promise实例
    then = (successCallback, failCallback) => {
        //参数处理
        successCallback = successCallback ? successCallback : value => value
        failCallback = failCallback ? failCallback : reason => { throw reason }
        //每一个then方法返回一个promise实例
        let promise = new MyPromise((resolve, reject) => {
            if (this.state === FULFILLED) {
                setTimeout(() => {
                    //使得能获取到promise
                    handlePromise(successCallback, this.value, promise, resolve, reject)
                }, 0)
            } else if (this.state === REJECTED) {
                setTimeout(() => {
                    //使得能获取到promise
                    handlePromise(failCallback, this.reason, promise, resolve, reject)
                }, 0)
            } else {
                //处理state是peddin状态,可能存在异步回调,successCallpack收集的数据类型为[f1,f2,f3]
                this.successCallpack.push(() => {
                    setTimeout(() => {
                        //添加setTimeout使得能获取到promise
                        handlePromise(successCallback, this.value, promise, resolve, reject)
                    }, 0)
                })
                this.failCallback.push(() => {
                    setTimeout(() => {
                        handlePromise(failCallback, this.reason, promise, resolve, reject)
                    }, 0)
                })
            }
        })
        return promise
    }
    //接收一个回调作为参数返回一个promise对象,接收前一个promise返回reject或resolve的值
    finally = (callback) => {
        //调用then方法确定promise状态,进行相应处理
        return this.then(value => {
            //将回调函数结果转化为promise对象,在通过promise的then方法将value/reason向下传递
            return MyPromise.resolve(callback()).then(() => value)
        }, reason => {
            return MyPromise.resolve(callback()).then(() => { throw reason })
        })
    }
    //返回一个失败的promise,并将callback结果向下传递
    catch = (callback) => {
        return this.then(undefined, callback)
    }

    // 合并promise,传入所有的promise都成功返回成功状态,只要有一个失败就返回失败
    static all(array) {
        const r = []
        let index = 0
        const len = array.length
        return new MyPromise((resolve, reject) => {
            function addElement(key, data) {
                r[key] = data
                index++
                //判断集合中元素个数是否和数组参数个数一致,如果一致表示所有promise执行完毕
                if (index === len) {
                    resolve(r)
                }
            }
            for (let i = 0; i < len; i++) {
                const current = array[i]
                if (current instanceof MyPromise) {
                    current.then(val => addElement(i, val), reason => reject(reason))
                } else {
                    addElement(i, current)
                }
            }
        })
    }
    //接收数组作为参数,取第一次返回的promise状态,如果参数非promise对象,就取这个参数作为成功的resolve的参数
    static race(array) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0, len = array.length; i > len; i++) {
                const current = array[i]
                if (current instanceof MyPromise) {
                    current.then(resolve, reject)
                } else {
                    resolve(current)
                }
            }
        })
    }
    //返回一个promise对象,参数不是promise对象就直接转化成功promise对象
    static resolve(value) {
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }
    static reject(value) {
        return new MyPromise(reject => reject(value))
    }
}
function handlePromise(callback, value, promise, resolve, reject) {
    try {
        resolvePromise(promise, callback(value), resolve, reject)
    } catch (error) {
        reject(error)
    }
}
//根据then返回值,确定then返回的promise状态及参数
function resolvePromise(promise, callbackResult, resolve, reject) {
    if (promise === callbackResult) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (callbackResult instanceof MyPromise) {
        callbackResult.then(resolve, reject)
    } else {
        resolve(callbackResult)
    }
}

new MyPromise((resolve, reject) => {
    //加一个定时器 走到then方法state为pedding
    setTimeout(() => {
        resolve('haha')
    }, 1000)

}).then(res => {
    console.log(res, 1);
    return MyPromise.resolve('succ')
}, err => {
    console.log(err, 2);
}).then(res => {
    console.log(res, 3);
})

// new Promise((resolve, reject) => {
//     resolve(123)
// }).then(res => {
//     console.log(res, 'res');
//     return Promise.resolve('succ')
// }, err => {
//     console.log(err, 'err');
// }).then(res=>{
//     console.log(res);
// })