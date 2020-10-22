import { initState } from './state';
import { compilerToFunction } from './compiler/index';

export function initMixin (Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
        // 数据劫持
        // vue中使用this.$options指代的就是用户传递的属性
        const vm = this; 
        vm.$options = options;
        // 初始化状态
        initState(vm);

        // 如果传入el属性，需要将页面渲染出来
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
        // 挂载优先级：默认先查找有没有render方法，没有render会采用template，没有template会用el中的内容。
        if (!options.render) {
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML;
            }
            compilerToFunction(template);
        }
    }
}
