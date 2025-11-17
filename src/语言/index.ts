export interface 补全锚点配置 {
    /** 判断一个字符是否属于标识符（如变量名中的字符） */
    是否标识符字符: (字符: string) => boolean;

    /** 构成语法边界的字符集合（遇到这些符号可作为锚点参考） */
    语法边界字符: Set<string>;

    /** 最大回退距离，防止向左扫描过远影响性能 */
    最大回退距离?: number;
}

export interface 语言T {
    触发字符: string[];
    补全锚点配置?: 补全锚点配置
}


export abstract class 语言基类 {
    public 触发字符!: string[];
    public 补全锚点配置?: 补全锚点配置;
}


const 全部语言 = [
    "abap", "bat", "bibtex", "clojure", "coffeescript", "c", "cpp", "csharp", "css", "cuda-cpp", "d", "dart", "pascal",
    "diff", "dockerfile", "erlang", "fsharp", "git-commit", "git-rebase", "go", "groovy", "handlebars", "haml",
    "haskell", "html", "ini", "java", "javascript", "javascriptreact", "json", "jsonc", "julia", "latex", "less", "lua",
    "makefile", "markdown", "objective-c", "objective-cpp", "ocaml", "perl", "perl6", "php", "plaintext", "powershell",
    "pug", "python", "r", "razor", "ruby", "rust", "scss", "sass", "shaderlab", "shellscript", "slim", "sql", "stylus",
    "svelte", "swift", "typescript", "typescriptreact", "tex", "vb", "vue", "vue-html", "xml", "xsl", "yaml"
];

import go from './语言/go';
import html from './语言/html';
import java from './语言/java';
import javascript from './语言/javascript';
import json from './语言/json';
import python from './语言/python';
import rust from './语言/rust';
import typescript from './语言/typescript';

export const 语言配置表 = {
    go,
    html,
    java,
    javascript,
    json,
    python,
    rust,
    typescript,
};

export const 已配置的语言 = new Set(Object.keys(语言配置表));

/**
 * 通用默认语言配置
 *
 * 适用场景：
 * - 未显式定义的语言（如 lua, kotlin, swift, dart, php 等）
 * - 插件启动初期兜底
 * - 快速原型开发
 *
 * 设计理念：宁可多回退、多触发，也不漏掉补全机会。
 */
export class 通用语言配置 extends 语言基类 {
    constructor() {
        super();
        /**
         * 通用触发字符（与语法边界字符对齐，但排除引号以避免干扰）
         *
         * 排除 " ' ` 的原因：
         *   - 输入引号通常表示“开始写字符串”，而非请求代码补全
         *   - 引号内补全应由语言服务器或专用提供者处理（如 SQL in string）
         *   - 避免在普通文本中误触发（如写注释时）
         *
         * 保留其余符号，确保核心场景不失效。
         */
        this.触发字符 = ['.', '(', '[', '{', ',', '=', ':', '<', '@',];
        this.补全锚点配置 = {
            /**
             * 通用标识符字符规则（仅 ASCII）：
             * - 字母、数字、下划线（所有语言都支持）
             * - 美元符号 $（JS/Java/PHP 等常用）
             * - 不包含连字符 -（因在多数语言中不是标识符，但在 HTML/CSS 中是；此处为代码语言优先）
             */
            是否标识符字符: (字符) => /[a-zA-Z0-9_$]/.test(字符),

            /**
             * 通用语法边界字符集合
             * 注意：即使某些语言不用某个符号（如 PHP 不常用 @ 触发补全），
             *       保留它也不会出错，只是多一次判断。
             */
            语法边界字符: new Set([
                '.',    // 成员访问（如 obj.prop）
                '(',    // 函数调用 / 元组 / 参数列表（如 func(）
                '[',    // 索引 / 数组 / 切片（如 arr[）
                '{',    // 对象 / 字典 / 块作用域（如 { key: ）
                ',',    // 参数 / 元素分隔（如 func(a, ）
                '=',    // 赋值 / 默认值 / 关键字参数（如 param=）
                ':',    // 类型注解 / 字典键值 / 标签（switch）（如 x: Type 或 {k: ）
                '<',    // 泛型 / 模板 / JSX 标签（如 List<）
                '@',    // 注解 / 装饰器（如 @decorator）
                '"', "'", '`'   // 字符串开始（某些语言支持字符串内补全，如 SQL in JS）
            ]),

            /**
             * 较大的回退距离，确保能跨过长链式调用：
             *   obj.method().another[0].field
             * 最坏情况约需 25~30 字符，设为 40 留有余量
             */
            最大回退距离: 40,
        };
    }
};
