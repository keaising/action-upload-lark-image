# Upload Image to Lark/Feishu Action

A GitHub Action to upload images to Lark/Feishu and get the image_key for use in messages.

## Usage

```yaml
- name: Upload image to Lark
  id: upload
  uses: keaising/action-upload-lark-image@v1
  with:
    platform: feishu
    app-id: ${{ secrets.LARK_APP_ID }}
    app-secret: ${{ secrets.LARK_APP_SECRET }}
    image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ...' # Base64 encoded image

- name: Use the image key
  run: echo "Image key is ${{ steps.upload.outputs.image_key }}"
```

## Inputs

| Input | Description | Required |
|-------|-------------|----------|
| `platform` | `feishu` or `lark` | Yes |
| `app-id` | Lark/Feishu App ID | Yes |
| `app-secret` | Lark/Feishu App Secret | Yes |
| `image` | Base64 encoded image string (with or without `data:image/...;base64,` prefix) | Yes |

## Outputs

| Output | Description |
|--------|-------------|
| `image_key` | The uploaded image key from Lark/Feishu |

## Development

### Build

After making changes to `src/index.js`, run:

```bash
npm run build
```

This will package the code and all dependencies into `dist/index.js`.

**Important**: Always commit the `dist/` folder after building, as GitHub Actions uses the built file.

### Local Setup

```bash
npm install
npm run build
```

