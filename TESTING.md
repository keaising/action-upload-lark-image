# 本地测试指南

## 方法 1: 使用测试脚本（推荐）

### 1. 设置环境变量

创建一个 `.env.local` 文件（不会被提交到 Git）：

```bash
export TEST_APP_ID="cli_a5xxxxxxxxxxxxxx"
export TEST_APP_SECRET="your_app_secret_here"
export TEST_PLATFORM="feishu"  # 或 "lark"
```

然后加载环境变量：

```bash
source .env.local
```

### 2. 使用默认测试图片

```bash
node test-local.js
```

### 3. 使用真实图片文件

```bash
node test-with-file.js ./my-image.png
```

## 方法 2: 使用 act 工具（完整模拟 GitHub Actions）

安装 [act](https://github.com/nektos/act):

```bash
# macOS
brew install act

# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

创建 `.github/workflows/test.yml`:

```yaml
name: Test Upload
on: workflow_dispatch

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./
        with:
          platform: feishu
          app-id: ${{ secrets.LARK_APP_ID }}
          app-secret: ${{ secrets.LARK_APP_SECRET }}
          image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
```

创建 `.secrets` 文件:

```
LARK_APP_ID=cli_a5xxxxxxxxxxxxxx
LARK_APP_SECRET=your_app_secret_here
```

运行测试：

```bash
act workflow_dispatch --secret-file .secrets
```

## 方法 3: 在 GitHub 上测试

1. 提交代码到 GitHub
2. 在仓库中创建 `.github/workflows/test.yml`
3. 在仓库设置中添加 Secrets:
   - `LARK_APP_ID`
   - `LARK_APP_SECRET`
4. 手动触发 workflow

## 注意事项

⚠️ **不要提交包含真实密钥的文件**

确保这些文件在 `.gitignore` 中：
- `.env.local`
- `.secrets`
- `*.local.js`
- 测试图片文件
