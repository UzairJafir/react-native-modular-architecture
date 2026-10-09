# Finflow Assets

This directory holds all static media assets for the Finflow app.

## Structure

```
assets/
├── images/       → .png / .jpg screen illustrations, logos
├── icons/        → SVG or PNG icon files (if not using icon libraries)
└── fonts/        → Custom .ttf / .otf font files
```

## Usage

### Images
```tsx
import { Image } from 'react-native';
const Logo = () => <Image source={require('./assets/images/logo.png')} />;
```

### Custom Fonts
1. Place `.ttf` files in `assets/fonts/`
2. Add to `react-native.config.js`:
   ```js
   module.exports = { assets: ['./src/assets/fonts/'] };
   ```
3. Run `npx react-native-asset` to link.
