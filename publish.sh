
echo "发布「中文代码补全」插件"
echo "=========================="

echo "请输入 VSCode 令牌："
read token

vsce publish -p $token

# echo "请输入插件版本（如：1.0.0）："
# read version
# vsce publish --packagePath ./vscode-zh-completion-$version.vsix -p $token
