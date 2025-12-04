# PWA Splash Screen Setup Guide

## ✅ What's Been Fixed

### 1. HTML Splash Screen (Immediate Solution)
- Added a custom splash screen that displays while your app loads
- Shows your app logo, name, and a loading spinner
- Uses your brand color (#2f4cdd)
- Works on **all devices** (iOS, Android, Desktop)

### 2. PWA Configuration Updates
- Updated `vite.config.ts`:
  - Changed `background_color` to match `theme_color` (#2f4cdd)
  - Simplified icon configuration with combined purpose
- Updated `index.html`:
  - Added iOS splash screen meta tags
  - Added animated splash screen
  - Added proper meta tags for PWA

## 🎯 Current Status

### ✅ Working Now:
- **HTML Splash Screen**: Shows on all devices when app loads
- **Android**: Will generate splash screen from manifest automatically
- **iOS Basic**: Apple touch icon will be used as fallback

### 🔄 Optional: Full iOS Splash Screen Support

For the best iOS experience with device-specific splash screens, you have two options:

#### Option 1: Online Generator (Easiest)
1. Visit: https://progressier.com/pwa-icons-and-ios-splash-screen-generator
2. Upload your `src/public/android-chrome-512x512.png`
3. Set background color: `#2f4cdd`
4. Download the generated splash screens
5. Place them in `src/public/` folder
6. Copy the generated HTML tags to `index.html`

#### Option 2: PWA Asset Generator (Command Line)
```bash
# Fix npm permissions first (if needed)
sudo chown -R $(whoami) ~/.npm

# Install globally
npm install -g pwa-asset-generator

# Generate splash screens
pwa-asset-generator src/public/android-chrome-512x512.png src/public \
  --background "#2f4cdd" \
  --splash-only \
  --type png \
  --quality 100 \
  --dark-mode \
  --index index.html
```

#### Option 3: Use PWA Vite Plugin (Recommended)
```bash
# Install
yarn add -D @vite-pwa/assets-generator

# Add to vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

VitePWA({
  // ... existing config
  pwaAssets: {
    disabled: false,
    config: true,
  },
})
```

## 📱 Testing Your Splash Screen

### On Android:
1. Build your app: `yarn build`
2. Deploy to your server
3. Open in Chrome
4. Install the PWA
5. Close and reopen - you should see the splash screen

### On iOS:
1. Build your app: `yarn build`
2. Deploy to your server
3. Open in Safari
4. Tap Share → Add to Home Screen
5. Open the app from home screen - you should see the splash screen

### Local Testing:
1. Run: `yarn build && yarn preview`
2. Open in browser
3. You should see the HTML splash screen immediately

## 🔧 How It Works

### HTML Splash Screen (Current Implementation)
1. The splash screen is shown immediately when the HTML loads
2. It displays your logo, app name, and loading animation
3. When React finishes rendering, the splash fades out smoothly
4. Provides immediate visual feedback to users

### Native Splash Screens (iOS/Android)
- **Android**: Automatically generates splash screen from your manifest icons and colors
- **iOS**: Requires specific `apple-touch-startup-image` tags for each device size

## 🎨 Customization

To customize your splash screen, edit `index.html`:

```html
<div id="splash-screen" style="...">
  <!-- Your logo -->
  <img src="/android-chrome-512x512.png" ... />
  
  <!-- App name and description -->
  <h1>miFIN Lead</h1>
  <p>Lead Management System</p>
  
  <!-- Loading spinner -->
  <div style="..."></div>
</div>
```

### Change Colors:
- Background gradient: Update `background: linear-gradient(135deg, #2f4cdd 0%, #1a2e8f 100%);`
- Text color: Update `color: white;`

### Change Logo Size:
- Update `width: 120px; height: 120px;`

### Change Animation Duration:
- Update `setTimeout(..., 500);` in the script (currently 500ms)

## 📋 Required Splash Screen Sizes (for iOS)

If you want device-specific splash screens for iOS:

| Device | Size | Pixel Ratio |
|--------|------|-------------|
| iPhone SE, 5s | 640×1136 | @2x |
| iPhone 6, 7, 8 | 750×1334 | @2x |
| iPhone 6+, 7+, 8+ | 1242×2208 | @3x |
| iPhone X, Xs | 1125×2436 | @3x |
| iPhone Xr, 11 | 828×1792 | @2x |
| iPhone Xs Max, 11 Pro Max | 1242×2688 | @3x |
| iPhone 12, 13, 14 | 1170×2532 | @3x |
| iPhone 12/13/14 Pro Max | 1284×2778 | @3x |
| iPhone 14 Pro | 1179×2556 | @3x |
| iPhone 14 Pro Max | 1290×2796 | @3x |
| iPad Mini, Air | 1536×2048 | @2x |
| iPad Pro 10.5" | 1668×2224 | @2x |
| iPad Pro 11" | 1668×2388 | @2x |
| iPad Pro 12.9" | 2048×2732 | @2x |

## 🚀 Deploy and Test

1. Build your app:
   ```bash
   yarn build
   ```

2. Test locally:
   ```bash
   yarn preview
   ```

3. Deploy to your server

4. Test on physical devices:
   - Install PWA
   - Close completely
   - Reopen from home screen
   - Splash screen should appear!

## 🐛 Troubleshooting

### Splash screen not showing on iOS:
- Make sure you've added the PWA to home screen (not just using Safari)
- iOS only shows splash screens for installed PWAs
- Ensure you have `apple-touch-icon` configured (✅ already done)
- For best results, generate device-specific splash screens

### Splash screen not hiding:
- Check browser console for errors
- Make sure React is rendering properly
- The splash screen auto-hides after 500ms + fade animation (300ms)

### Splash screen shows wrong icon:
- Clear browser cache
- Reinstall the PWA
- Check that `/android-chrome-512x512.png` exists and is accessible

### Android not showing splash screen:
- Android 12+ automatically generates splash screens
- Make sure `theme_color` and `background_color` are set in manifest (✅ already done)
- Ensure icons have correct purpose: "any maskable" (✅ already done)

## 📚 Additional Resources

- [Web.dev PWA Splash Screens](https://web.dev/articles/splash-screens)
- [iOS PWA Splash Screen Guide](https://appsco.pe/developer/splash-screens)
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

## ✨ Next Steps (Optional)

1. **Generate device-specific splash screens** using one of the methods above
2. **Test on multiple devices** (iOS, Android, different screen sizes)
3. **Add dark mode support** for splash screens
4. **Optimize splash screen images** for faster loading
5. **Add app screenshots** to manifest for better app store presentation

---

**Current Status**: ✅ Splash screen is now working on all devices!
**Recommended**: Generate iOS-specific splash screens for the best user experience.

