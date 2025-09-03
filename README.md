# CDS Playground

A playground environment for building prototypes with Coinbase Design System (CDS) across web and mobile platforms.

<img src="cover.webp" alt="CDS Playground Cover" width="1200">

## 🏗️ Project Structure

This monorepo contains:

- **`web/`** - React web application playground using CDS Web components
- **`mobile/`** - React Native/Expo mobile application playground

## 🚀 Getting Started

### Web Playground

```bash
yarn install
yarn web:dev
```

Visit `http://localhost:8080` to see your web app.

### Mobile Playground

```bash
yarn install
yarn mobile:dev
```

This will start the Expo development server. You can then:

- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan the QR code with Expo Go app on your device

## 📱 Web Demo App

The current web app (`Demo`) is a todo list application that showcases various CDS components. It includes:

- Theme switching (light/dark)
- Modal interactions
- Layout components (HStack, VStack)
- Form components
- State management with Redux Toolkit

## 🔧 Building Your Own Web Prototype

**Super simple!** All the technical setup is handled automatically. Just focus on building with CDS:

### Quick Start (Recommended)

1. **Create your prototype component** (e.g., `web/src/MyPrototype.tsx`):

   ```tsx
   import { HStack, VStack } from "@cbhq/cds-web/layout";
   import { Text, Heading } from "@cbhq/cds-web/typography";
   import { Button } from "@cbhq/cds-web/forms";

   export const MyPrototype = () => (
     <VStack padding="large" gap="medium">
       <Heading>My Custom Prototype</Heading>
       <Text>Built with CDS components!</Text>
       <Button>Click me</Button>
     </VStack>
   );
   ```

2. **Update the import in `web/src/App.tsx`** (just one line!):

   ```tsx
   // Replace this line:
   import { Demo } from "./Demo";

   // With this:
   import { MyPrototype } from "./MyPrototype";

   // And update the component in the JSX:
   <MyPrototype />;
   ```

**That's it!** 🎉 All the technical setup (PortalProvider, ThemeProvider, global styles) is handled automatically.

## 📚 CDS Resources

- **Components**: Use `@cbhq/cds-web` for web components
- **Icons**: Import from `@cbhq/cds-icons`
- **Fonts**: Already included via `@cbhq/cds-fonts`
- **Themes**: Use `coinbaseTheme` or create custom themes
- **Documentation**: Available in the main CDS repository

## 📝 Available Scripts

### Web Scripts

- `yarn web:dev` - Start web development server
- `yarn web:build` - Build web app for production
- `yarn web:start` - Start web production server
- `yarn web:lint` - Lint web code
- `yarn web:format` - Format web code

### Mobile Scripts

- `yarn mobile:dev` - Start Expo development server
- `yarn mobile:start` - Start Expo development server
- `yarn mobile:android` - Start on Android emulator
- `yarn mobile:ios` - Start on iOS simulator
- `yarn mobile:web` - Start mobile app in web browser

Happy prototyping! 🎯
