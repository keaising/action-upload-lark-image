import * as core from '@actions/core'
import lark from '@larksuiteoapi/node-sdk'
import { Readable } from 'node:stream'

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
  const buffer = Buffer.from(base64Data, 'base64');

  // Convert Buffer to Readable Stream (form-data requires a stream)
  const file = Readable.from(buffer);
  // Add file metadata that form-data expects
  file.path = 'image.png';

  try {
    const res = await client.im.v1.image.create({
      data: {
        image_type: 'message',
        image: file,
      },
    });

    core.info(`Response: ${JSON.stringify(res, null, 2)}`);

    // SDK returns the data object directly on success
    if (res.image_key) {
      return {
        image_key: res.image_key
      }
    }

    // Handle error response
    return {
      message: `upload failed, code:${res.code}, message: ${res.msg || res.message}, full response: ${JSON.stringify(res)}`
    }
  } catch (e) {
    core.error(`Exception: ${JSON.stringify(e, Object.getOwnPropertyNames(e))}`);
    return {
      message: `upload error, message: ${e.message || e}`
    }
  }
}


main().catch(error => {
  core.setFailed(`Unhandled error: ${error.message}`)
})