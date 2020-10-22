/** 
 * ast语法书
*/
// arguments[0] = 匹配到的标签 argument[1] = 匹配到的标签名字
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;   // aaa-12df
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // ?: 匹配不捕获  <aaa:dfdf>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配{{}}

export function compilerToFunction (template) {
    console.log(template, '=====');
}