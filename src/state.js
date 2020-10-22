import { observe } from './observer/index';

export function initState (vm) {
    const opts = vm.$options;
    // vue数据来源顺序：属性，方法，数据data，计算属性，watch
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethod(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }
}

function initProps (vm) {

}
function initMethod (vm) {
    
}
function initData (vm) {
    let data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    // 对象劫持 数据修改，等到通知
    // MVVM
    // Object.defineProperty()给属性添加get和set方法
    // 响应式原理
    observe(data);
}
function initComputed (vm) {
    
}
function initWatch (vm) {
    
}