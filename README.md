# 中文代码补全

使用拼音首字母，高效补全中文变量、方法与类名，提升中文编码体验。

VSCode Marketplace：[vscode-zh-completion](https://marketplace.visualstudio.com/items?itemName=chinese.vscode-zh-completion)

## 配置

**一般情况无需配置**

配置参数：

|    参数名    |           参数值              |                      说明                         |
| ----------- | ---------------------------- | ------------------------------------------------- |
|   元音通配符  |  依输入法而定（如：声笔用 'v'）  | a、e、i、o、u 等元音首字母的替换符（为照顾「音形类输入法」的用户习惯）|

## 功能简介

### 简单

**只解决最大的痛点**：无法高效补全中文变量、方法与类名（所以拼音首字母，无须中英文切换）。

**保留用户输入习惯**：命名和注释还使用用户自己喜欢的输入法。

**代码变整洁、代码字符变少的同时，中英文切换次数也并不会显著增加**

「写注释时的中英文切换」可以抵消「命名时的中英文切换」（英文命需要注释，中文命名不需要注释）

### 高效

对 IDE 的性能几乎没有影响（整个插件不到 100 KB（包括程序、拼音首字母字典数据 和 效果图））

### 普适

适配不同类型的语言服务器（提供全部补全项的（如 Typescript） 和 部分补全项的（如 Python））

## 效果图

![](images/python.png)

为保持插件轻量，此处仅提供一张代表截图以供参考。

## 版本更新说明

[CHANGELOG](CHANGELOG.md)

## 协议

本项目基于 BSD 3-Clause 许可证开源

## 感谢

这个项目的诞生，离不开以下项目与朋友们的帮助：

- [中文代码快速补全](https://gitee.com/Program-in-Chinese/vscode_Chinese_Input_Assistant)：主要技术参考
- [PYFL](https://www.npmjs.com/package/pyfl)：优秀的拼音首字母方案
- 正在使用的你：非常感谢你的尝试，[如果你遇到任何问题，欢迎随时告诉我](https://github.com/remyzane/vscode-zh-completion/issues)
