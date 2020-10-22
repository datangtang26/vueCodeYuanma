// 核心方法：响应式原理
// Object.defineProperty()不能兼容ie8及以下（vue2不支持ie8版本的主要原因）
import { isObject, def } from '../util/index';
import { arrayMethods } from './array';

class Observer {
    constructor (value) {
        // 给每一个监控过的对象增加一个__ob__属性
        def(value, '__ob__', this);
        if (Array.isArray(value)) {
            // 不会对数组的索引进行观测，会导致性能问题。
            value.__proto__ = arrayMethods;
            // 递归，如果数据里包含对象继续监控
            this.observerArray(value);
        } else {
            this.walk(value);
        }
    }
    observerArray (value) {
        for (let i = 0; i < value.length; i++) {
            observe(value[i]);
        }
    }
    walk (data) {
        let keys = Object.keys(data);
        keys.forEach(key => {
            // 定义响应式数据
            defineReactive(data, key, data[key]);
        });
    }
}
function defineReactive (data, key, value) {
    // 递归
    observe(value);
    // 数据劫持
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: false,
        get () {
            return value;
        },
        set (newValue) {
            if (newValue === value) return;
            console.log('数据更新了');
            console.log(key);
            console.log(newValue);
            // 数据修改的话，递归重新执行Object.defineProperty
            observe(newValue);
            value = newValue;
        }
    })
}

export function observe (data) {
    const isObj = isObject(data);
    if (!isObj) {
        return;
    }
    console.log('observe==', data);
    return new Observer(data);
}