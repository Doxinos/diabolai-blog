# Blog Hero Images

Pre-generated Midjourney images for blog posts.

## Specs
- **Aspect ratio**: 16:9
- **Recommended size**: 1920x1080 or larger

## Naming Convention
Use descriptive names like:
- `ai-transformation-heart.png`
- `automation-pipeline-abstract.png`
- `future-tech-blue.png`

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
