// arguments[0] = 匹配到的标签 argument[1] = 匹配到的标签名字
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;   // aaa-12df
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // ?: 匹配不捕获  <aaa:dfdf>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配{{}}

let root = null;
let currentParent;
let stack = [];
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;

function createASTElement (tagName, attrs) {
    return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs,
        parent: null
    }
}

function start (tagName, attrs) {
    // console.log('开始标签==', name, '属性==', attrs);
    let element = createASTElement(tagName, attrs);
    if (!root) {
        root = element;
    }
    // 把当前元素标记成父ast树
    currentParent = element;
    // 将开始标签存到数组中
    stack.push(element);
}
function chars (text) {
    // console.log('文本是===', text);
    text = text.replace(/\s/g, '');
    if (text) {
        currentParent.children.push({
            text,
            type: TEXT_TYPE
        })
    }
}
function end (tagName) {
    // console.log('结束标签是===', tagName);
    let element = stack.pop();
    currentParent = stack[stack.length - 1];
    if (currentParent) {
        // 实现父子关系关联
        element.parent = currentParent;
        currentParent.children.push(element);
    }
}

export function parseHTML (html) {
    // 循环解析html字符串
    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
            // 如果当前索引=0，则是一个标签 开始标签或者结束标签
            let startTagMatch = parseStartTag();
            // console.log('startTagMatch==', startTagMatch);
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                // 如果开始标签匹配完毕后，继续下一次匹配
                continue;
            }
            let endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }
        }
        let text;
        if (textEnd >= 0) {
            text = html.substring(0, textEnd);
        }
        if (text) {
            advance(text.length);
            chars(text);
        }
    }
    function advance (n) {
        html = html.substring(n);
    }
    function parseStartTag () {
        let start = html.match(startTagOpen);
        // console.log(start);
        if (start) {
            let match = {
                tagName: start[1],
                attrs: []
            }
            // 将标签删除
            advance(start[0].length);
            // console.log(html);
            let end, attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // 将属性去掉
                advance(attr[0].length);
                // console.log(attr);
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5],
                })
            }
            // console.log('===', match, html);
            // 去掉开始标签的>
            if (end) {
                // console.log('end==', end);
                advance(end[0].length);
                return match;
            }
        }
    }
    return root;
}