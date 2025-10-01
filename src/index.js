import * as core from '@actions/core'
import lark from '@larksuiteoapi/node-sdk'

async function main() {
  try {
    const appId = core.getInput('app-id')
    const appSecret = core.getInput('app-secret')
    const image = core.getInput('image')
    const platform = core.getInput('platform')

    core.info('Starting image upload...')
    const result = await upload(platform, appId, appSecret, image);

    if (result.image_key) {
      core.info(`Image uploaded successfully, image_key: ${result.image_key}`);
      core.setOutput('image_key', result.image_key);
      return
    }
    core.setFailed(`Image upload failed: ${result.message}`);
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function upload(platform, appId, appSecret, image) {
  const client = new lark.Client({
    appId: appId,
    appSecret: appSecret,
    disableTokenCache: false,
    domain: platform === 'feishu' ? lark.Domain.Feishu : lark.Domain.Lark,
  });

  // Convert base64 string to Buffer
  // Remove data:image prefix if present
  const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');

  try {
    const res = await client.im.v1.image.create({
      data: {
        image_type: 'message',
        image: imageBuffer,
      },
    });

    if (res.code === 0 || res.message === 'success') {
      return {
        image_key: res.data.image_key
      }
    }
    return {
      message: `upload failed, code:${res.code}, message: ${res.message}`
    }
  } catch (e) {
    return {
      message: `upload error, message: ${e.message || e}`
    }
  }
}


main().catch(error => {
  core.setFailed(`Unhandled error: ${error.message}`)
})