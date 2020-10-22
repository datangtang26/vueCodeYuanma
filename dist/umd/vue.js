(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  // 重写数据方法
  // push shift unshift pop reverse sort splice 会导致原数组发生变化的方法
  var oldArrayMethods = Array.prototype; // 原型链查找
  // value.__proto__ = arrayMethods;
  // arrayMethods.__proto__ = oldArrayMethods;

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      // AOP切片编程
      console.log("\u7528\u6237\u8C03\u7528\u4E86\u6570\u7EC4".concat(method, "\u65B9\u6CD5"));
      console.log('this===', this); // 调用原生数组方法

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args);
      var inserted;
      var ob = this.__ob__;

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

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

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

    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(value) {
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          // 定义响应式数据
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    // 递归
    observe(value); // 数据劫持

    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: false,
      get: function get() {
        return value;
      },
      set: function set(newValue) {
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
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    console.log('observe==', data);
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; // vue数据来源顺序：属性，方法，数据data，计算属性，watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对象劫持 数据修改，等到通知
    // MVVM
    // Object.defineProperty()给属性添加get和set方法
    // 响应式原理

    observe(data);
  }

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // 数据劫持
      // vue中使用this.$options指代的就是用户传递的属性
      var vm = this;
      vm.$options = options; // 初始化状态

      initState(vm); // 如果传入el属性，需要将页面渲染出来

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 挂载优先级：默认先查找有没有render方法，没有render会采用template，没有template会用el中的内容。

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        console.log(template);
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
