import { 语言基类 } from '..';


export class 语言实现 extends 语言基类 {

    constructor() {
        super();
        this.触发字符 = ['.', '(', '[', '{', ',',];
        this.补全锚点配置 = {
            是否标识符字符: (字符) => /[a-zA-Z0-9_]/.test(字符),
            语法边界字符: new Set([
                '.',    // 成员访问（obj.Field）
                '(',    // 函数调用（fmt.Println(）
                '[',    // 切片/索引（arr[）
                '{',    // 结构体字面量（T{Field: ）
                ',',    // 参数或字段分隔（func(a, ) 或 T{A, B}）
            ]),
            最大回退距离: 30,
        };
    }
}

export default new 语言实现();
