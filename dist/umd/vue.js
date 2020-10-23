(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    function isObject(data) {
      return typeof data === 'object' && data !== null;
    }
    function def(data, key, value) {
      Object.defineProperty(data, key, {
        enumerable: false,
        configurable: false,
        value
      });
    }

    // 重写数据方法
    // push shift unshift pop reverse sort splice 会导致原数组发生变化的方法
    let oldArrayMethods = Array.prototype; // 原型链查找
    // value.__proto__ = arrayMethods;
    // arrayMethods.__proto__ = oldArrayMethods;

    const arrayMethods = Object.create(oldArrayMethods);
    const methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
    methods.forEach(method => {
      arrayMethods[method] = function (...args) {
        // AOP切片编程
        console.log(`用户调用了数组${method}方法`);
        console.log('this===', this); // 调用原生数组方法

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
        }

        if (inserted) ob.observerArray(inserted);
        return result;
      };
    });

    // 核心方法：响应式原理

    class Observer {
      constructor(value) {
        // 给每一个监控过的对象增加一个__ob__属性
        def(value, '__ob__', this);

        if (Array.isArray(value)) {
          // 不会对数组的索引进行观测，会导致性能问题。
          value.__proto__ = arrayMethods; // 递归，如果数据里包含对象继续监控

          this.observerArray(value);
        } else {
          this.walk(value);
        }
      }

      observerArray(value) {
        for (let i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }

      walk(data) {
        let keys = Object.keys(data);
        keys.forEach(key => {
          // 定义响应式数据
          defineReactive(data, key, data[key]);
        });
      }

    }

    function defineReactive(data, key, value) {
      // 递归
      observe(value); // 数据劫持

      Object.defineProperty(data, key, {
        configurable: true,
        enumerable: false,

        get() {
          return value;
        },

        set(newValue) {
          if (newValue === value) return;
          console.log('数据更新了');
          console.log(key);
          console.log(newValue); // 数据修改的话，递归重新执行Object.defineProperty

          observe(newValue);
          value = newValue;
        }

      });
    }

    function observe(data) {
      const isObj = isObject(data);

      if (!isObj) {
        return;
      }

      console.log('observe==', data);
      return new Observer(data);
    }

    function initState(vm) {
      const opts = vm.$options; // vue数据来源顺序：属性，方法，数据data，计算属性，watch

      if (opts.props) ;

      if (opts.methods) ;

      if (opts.data) {
        initData(vm);
      }

      if (opts.computed) ;

      if (opts.watch) ;
    }

    function initData(vm) {
      let data = vm.$options.data;
      data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对象劫持 数据修改，等到通知
      // MVVM
      // Object.defineProperty()给属性添加get和set方法
      // 响应式原理

      observe(data);
    }

    /** 
     * ast语法书
    */
    // arguments[0] = 匹配到的标签 argument[1] = 匹配到的标签名字
    const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // aaa-12df

    const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // ?: 匹配不捕获  <aaa:dfdf>

    const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名

    function parseHTML(html) {
      // 循环解析html字符串
      while (html) {
        let textEnd = html.indexOf('<');

        if (textEnd == 0) {
          // 如果当前索引=0，则是一个标签 开始标签或者结束标签
          let startTagMatch = parseStartTag();
          break;
        }
      }

      function advance(n) {
        html = html.substring(n);
      }

      function parseStartTag() {
        let start = html.match(startTagOpen);

        if (start) {
          const match = {
            tagName: start[1],
            attrs: []
          };
          advance(start[0].length);
          console.log(start);
          console.log(html);
        }
      }
    }

    function compilerToFunction(template) {
      let root = parseHTML(template);
      return function render() {};
    }

    function initMixin(Vue) {
      // 初始化流程
      Vue.prototype._init = function (options) {
        // 数据劫持
        // vue中使用this.$options指代的就是用户传递的属性
        const vm = this;
        vm.$options = options; // 初始化状态

        initState(vm); // 如果传入el属性，需要将页面渲染出来

        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      };

      Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el); // 挂载优先级：默认先查找有没有render方法，没有render会采用template，没有template会用el中的内容。

        if (!options.render) {
          let template = options.template;

          if (!template && el) {
            template = el.outerHTML;
          }

          compilerToFunction(template);
        }
      };
    }

    function Vue(options) {
      this._init(options);
    } // 通过引入文件的方式，给Vue原型上添加方法


    initMixin(Vue);

    return Vue;

})));
//# sourceMappingURL=vue.js.map
