import { uniqWith } from 'ramda';
import * as vsc from './接口封装';
import { 已配置的语言, 通用语言配置 } from './语言';
import { env } from './环境配置';

/**
补全项格式：{"label": "Case", "kind": "Class", "sortText": "05.0001.Case", "insertText": "Case"}
    - label: 显示在提示框中的具体内容（和 filterText 一样，也用于过滤）.
    - filterText: 过滤补全项（根据该值是否包含输入值）.
    - sortText: 此属性决定排序.
    - insertText: 实际插入的内容.
 */

export function 注册专用补全器(context: vsc.ExtensionContext, 语言: string, 触发字符: string[]) {
    context.subscriptions.push(
        vsc.languages.registerCompletionItemProvider(
            { language: 语言 },
            { provideCompletionItems: 补全实现, resolveCompletionItem: () => null },
            ...触发字符
        )
    );
}

export function 注册通用补全器(context: vsc.ExtensionContext) {
    context.subscriptions.push(
        vsc.languages.registerCompletionItemProvider(
            { language: '*' },
            { provideCompletionItems: 通用补全实现, resolveCompletionItem: () => null },
            ...通用语言配置.触发字符
        )
    );
}

export async function 补全实现(
    document: vsc.TextDocument, position: vsc.Position, token: vsc.CancellationToken, context: vsc.CompletionContext
) {
    const 输入值 = vsc.获得输入值();

    if (env.获得系统补全中) { return []; }  // 避免无限循环（调用'获得系统补全'时会调用'提供补全'函数, 这会导致无限循环）

    vsc.log(`补全「${输入值}」${document.fileName}, ${document.languageId}, ${position.line}:${position.character}`);

    // 获得系统补全
    env.获得系统补全中 = true;
    try {
        var 系统补全器 = await vsc.获得系统补全(document, position);
    } finally {
        env.获得系统补全中 = false; // 即使 await 抛错，也会执行
    }

    系统补全器.items.forEach((补全项) => {
        vsc.log(`系统补全项：${JSON.stringify(补全项)}`);
    });

    // 对做系统补全列表以下处理:
    // - 去重.
    // - 过滤不包含中文的补全项.
    // - 过滤现在正在输入的字段.
    // - 过滤自定义的片段(Snippet), 因为无论这个函数是否返回结果, vsc总会带上它们.
    let 补全列表: vsc.CompletionItem[] = uniqWith((a, b) => a.label === b.label, 系统补全器.items)
        .filter((补全项) => 过滤补全项(补全项, 输入值));
    // .filter((补全项) => /[\u4e00-\u9fa5\u3007]/.test(补全项.label.toString())) // 包含中文
    // .filter((补全项) => (补全项.label as any).label ? (补全项.label as any).label !== 输入值 : 补全项.label !== 输入值)
    // .filter((补全项) => 补全项.kind !== vsc.CompletionItemKind.Snippet);

    // 设置最终结果
    for (var 补全项 of 补全列表) {
        vsc.log(`补全项：${JSON.stringify(补全项)}`);
        env.编码器.生成补全码(补全项);
    }
    return new vsc.CompletionList(补全列表, true);
}

export async function 通用补全实现(
    document: vsc.TextDocument, position: vsc.Position, token: vsc.CancellationToken, context: vsc.CompletionContext
) {
    // 如果语言已配置，则不做处理（避免重复处理）
    if (已配置的语言.has(document.languageId)) {
        return [];
    }
    return await 补全实现(document, position, token, context);
}

function 过滤补全项(补全项: vsc.CompletionItem, 输入值: string): boolean {
    const 标签值 = (补全项.label as any).label ? (补全项.label as any).label : 补全项.label;
    vsc.log(`标签值：${标签值}`);

    // 检查是否包含中文字符
    const 包含中文 = /[\u4e00-\u9fa5\u3007]/.test(标签值);
    if (!包含中文) {
        return false;
    }

    // 检查是否与当前输入值相同
    if (标签值 === 输入值) {
        return false;
    }

    // 检查是否为Snippet类型
    if (补全项.kind === vsc.CompletionItemKind.Snippet) {
        return false;
    }

    return true;
}

// context.subscriptions.push(
// 	vsc.languages.registerCompletionItemProvider(
// 		[
// 			{ scheme: 'file', language: '*' },
// 			{ scheme: 'untitled', language: '*' },
// 			{ scheme: 'file', language: '*', notebookType: '*' },
// 			{ scheme: 'untitled', language: '*', notebookType: '*' },
// 		],
// 		{ provideCompletionItems: 补全实现, resolveCompletionItem: () => null }
// 	)
// );