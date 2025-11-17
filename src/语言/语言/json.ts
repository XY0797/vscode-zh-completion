import { 语言基类 } from '..';


export class 语言实现 extends 语言基类 {

    constructor() {
        super();
        this.触发字符 = [':', ',', '{', '[',];
        this.补全锚点配置 = {
            是否标识符字符: (字符) => /[a-zA-Z0-9_]/.test(字符), // JSON key 通常为简单标识符
            语法边界字符: new Set([
                ':',    // 键后（"key": ）
                ',',    // 元素分隔（{ "a": 1, ）
                '{',    // 对象开始（{ "key": ）
                '[',    // 数组开始（[ 1, ）
            ]),
            最大回退距离: 15,
        };
    }
}

export default new 语言实现();
