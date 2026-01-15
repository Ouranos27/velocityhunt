# OG Image Generation Guide

The OG (Open Graph) image is used when your site is shared on social media platforms like Twitter/X, Facebook, LinkedIn, etc.

## Quick Option: Use the HTML Template

An HTML template has been created at `public/og-template.html` that you can use to generate the OG image.

### Method 1: Screenshot Tool (Recommended)

1. **Install a browser screenshot tool:**
   ```bash
   npm install -g capture-website-cli
   ```

2. **Generate the image:**
   ```bash
   capture-website public/og-template.html --output public/og.png --width 1200 --height 630
   ```

### Method 2: Browser DevTools

1. Open `public/og-template.html` in your browser
2. Open DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M)
4. Set dimensions to 1200x630
5. Take a screenshot (Right-click → "Capture screenshot")
6. Save as `public/og.png`

### Method 3: Online Tools

Use one of these free services:
- **Screely**: https://screely.com
- **Carbon**: https://carbon.now.sh
- **Meta Tags**: https://metatags.io

### Method 4: Playwright (Automated)

If you want to automate this:

```javascript
// scripts/generate-og.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 }
  });

  await page.goto(`file://${path.resolve('public/og-template.html')}`);
  await page.screenshot({ path: 'public/og.png' });

  await browser.close();
  console.log('✅ OG image generated at public/og.png');
})();
```

Run with:
```bash
bun add -d playwright
bun run scripts/generate-og.js
```

## Customization

Edit `public/og-template.html` to customize:
- Colors and gradients
- Text content
- Stats/icons
- Font sizes
- Background effects

## Verification

After generating the image, verify it displays correctly:

1. **Local test:**
   - Build: `bun run build`
   - Start: `bun run start`
   - View source and check for `<meta property="og:image">`

2. **Online validators:**
   - Twitter: https://cards-dev.twitter.com/validator
   - Facebook: https://developers.facebook.com/tools/debug/
   - LinkedIn: https://www.linkedin.com/post-inspector/

3. **Expected result:**
   - Image displays at 1200x630
   - Text is readable
   - Gradient background looks good
   - No cropping or distortion

## Current Configuration

The metadata in `app/layout.tsx` is configured for:
- **Image path**: `/og.png`
- **Dimensions**: 1200x630 (Twitter/Facebook standard)
- **Twitter card**: `summary_large_image`
- **Creator**: `@PipolmPk`

## Tips

- Keep text large (min 32px font size)
- Use high contrast (light text on dark background)
- Test on multiple platforms
- PNG format is preferred over JPG
- Keep file size under 5MB (aim for <300KB)
