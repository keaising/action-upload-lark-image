#!/usr/bin/env node
// 本地测试脚本
// 使用方法: 
// 1. 设置环境变量（可选，或者直接在下面修改）
// 2. node test-local.js

// 从环境变量或这里设置你的测试数据
const TEST_APP_ID = process.env.TEST_APP_ID || 'cli_xxx';
const TEST_APP_SECRET = process.env.TEST_APP_SECRET || 'cphIbnYLma_xxx';
const TEST_PLATFORM = process.env.TEST_PLATFORM || 'feishu'; // 或 'lark'

// 这是一个 1x1 像素的透明 PNG 图片的 base64
const TEST_IMAGE = process.env.TEST_IMAGE || 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// 模拟 @actions/core 的输入
// GitHub Actions 通过环境变量传递输入，格式为 INPUT_<NAME>，全大写，连字符变下划线
process.env['INPUT_PLATFORM'] = TEST_PLATFORM;
process.env['INPUT_APP-ID'] = TEST_APP_ID;
process.env['INPUT_APP-SECRET'] = TEST_APP_SECRET;
process.env['INPUT_IMAGE'] = TEST_IMAGE;

console.log('🧪 Testing GitHub Action locally...');
console.log(`Platform: ${TEST_PLATFORM}`);
console.log(`App ID: ${TEST_APP_ID.substring(0, 10)}...`);
console.log(`Image length: ${TEST_IMAGE.length} chars`);
console.log('---');

// 运行主脚本
import('./src/index.js').catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
