import { initMixin } from './init';


function Vue (options) {
    this._init(options);
}
// 通过引入文件的方式，给Vue原型上添加方法
initMixin(Vue);
export default Vue;