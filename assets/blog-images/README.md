# Blog Hero Images

Pre-generated Midjourney images for blog posts.

## Specs
- **Aspect ratio**: 16:9
- **Recommended size**: 1920x1080 or larger

## Naming Convention
Use descriptive names that hint at the mood/theme:
- `ai-abstract-blue.png`
- `automation-gears-orange.png`
- `tech-future-dark.png`
- `data-flow-purple.png`

## Tracking Used Images
The `used-images.json` file tracks which images have been used. When publishing a post, the script automatically adds the image filename to this list so the same image won't be suggested twice.

## Usage

In your `scripts/draft-post.json`, just use the filename:

```json
{
  "image": "ai-transformation-heart.png",
  "imageAlt": "Description of the image"
}
```

The publish script automatically looks for images in this folder.

You can also use a full URL if needed:
```json
{
  "image": "https://example.com/image.png",
  "imageAlt": "Description"
}
```

Or generate with Flux/Replicate:
```json
{
  "imagePrompt": "Abstract AI visualization, blue gradient",
  "imageAlt": "Description"
}
```
