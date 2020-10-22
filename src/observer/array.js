// 重写数据方法
// push shift unshift pop reverse sort splice 会导致原数组发生变化的方法
let oldArrayMethods = Array.prototype;
// 原型链查找
// value.__proto__ = arrayMethods;
// arrayMethods.__proto__ = oldArrayMethods;
export const arrayMethods = Object.create(oldArrayMethods);

const methods = [
    'push',
    'shift',
    'unshift',
    'pop',
    'reverse',
    'sort',
    'splice',
];

methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        // AOP切片编程
        console.log(`用户调用了数组${method}方法`);
        console.log('this===', this);
        // 调用原生数组方法
        const result = oldArrayMethods[method].apply(this, args);
        let inserted;
        const ob = this.__ob__;
        switch (method) {
            case 'push':
                break;
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        if (inserted) ob.observerArray(inserted);
        return result;
    }
})