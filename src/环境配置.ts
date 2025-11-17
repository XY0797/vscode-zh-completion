import * as vsc from './接口封装';
import { 注册专用补全器, 注册通用补全器, 通用补全实现 } from './补全实现';
import { 语言基类, 语言配置表, 已配置的语言, 通用语言配置, 获取语言实现 } from './语言';
import { 补全码编码器, 载入编码器 } from './码表';

class Env {
    // 调用'获得系统补全'时会调用'提供补全'函数, 这会导致无限循环，为了避免此问题，添加此变量用于标识
    public 获得系统补全中: boolean = false;

    public 编码器!: 补全码编码器;

    public 语言实现: { [语言: string]: 语言基类 } = {};

    // 配置项
    public 输入习惯!: string; // 用户习惯的输入法

    async 加载配置() {
        this.输入习惯 = vsc.workspace.getConfiguration('中文代码补全').get('输入习惯') || '拼音';
        this.编码器 = await 载入编码器(this.输入习惯);
    }

    注册语言(context: vsc.ExtensionContext) {
        for (const 语言 of 已配置的语言) {
            vsc.log(`配置语言：${语言}, 触发字符：${(语言配置表 as { [key: string]: 语言T })[语言].触发字符}`);
            注册专用补全器(context, 语言, (语言配置表 as { [key: string]: 语言T })[语言].触发字符);
        }
        vsc.log(`配置语言：其他, 触发字符：${通用语言配置.触发字符}`);
        注册通用补全器(context);
    }

    // 按需加载（根据打开的文件类型）
    加载语言(context: vsc.ExtensionContext) {
        context.subscriptions.push(
            vsc.window.onDidChangeActiveTextEditor(editor => {
                const languageId = editor?.document.languageId; // 新打开文件的类型
                if (languageId) {
                    vsc.log(`打开文件类型：${languageId}`);
                    if (已配置的语言.includes(languageId)) {
                        vsc.log(`加载语言：${languageId}`);
                        获取语言实现(languageId).then(语言实现 => {
                            if (语言实现) {
                                vsc.log(`注册语言：${languageId}`);
                                注册专用补全器(context, languageId, 语言实现)
                            }
                        })
                    }
                }
            })
        );
    }
}

export const env = new Env();
