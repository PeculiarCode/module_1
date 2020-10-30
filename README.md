# test1
异步编程就是为了解决同步代码阻塞线程执行
eventloop是一个程序结构,用于等待和发送消息和事件
消息队列就是存储主线程中的异步任务
只考虑浏览器环境
宏任务 setTimeout,setInterval
微任务 promise.then() promise.finally() promise.catch()
同一个进程微任务优先宏任务执行