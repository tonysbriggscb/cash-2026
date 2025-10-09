# CDS Playground

A playground environment for building prototypes with Coinbase Design System (CDS) across web and mobile platforms.

<img src="cover.webp" alt="CDS Playground Cover" width="1200">

## 🏗️ Project Structure

This repository contains:

- **`web/`** - React web application playground using CDS Web components (Yarn workspace)
- **`mobile/`** - React Native/Expo mobile application playground with TypeScript (Standalone npm project)

## 📋 Requirements

- **Node.js**: v18.x or v20.x LTS (Expo requirement)
- **Yarn**: v4.x for web workspace
- **npm**: For mobile app dependencies

## 🚀 Getting Started

First, run the following

```bash
nvm install
nvm use
corepack enable
```

Then, run your platform specific commands:

### Web Playground

```bash
yarn install
yarn web:dev
```

Visit `http://localhost:8080` to see your web app.

### Mobile Playground

```bash
yarn mobile:install  # Install mobile dependencies
yarn mobile:dev      # Start Expo development server
```

This will start the Expo development server. You can then:

- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan the QR code with Expo Go app on your device  (**note**: this is not currently working)

## 📱 Web Demo App

The current web app (`Demo`) is a todo list application that showcases various CDS components. It includes:

- Theme switching (light/dark)
- Modal interactions
- Layout components (HStack, VStack)

## 🔧 Building Your Own Web Prototype

**Super simple!** All the technical setup is handled automatically. Just focus on building with CDS:

### Quick Start (Recommended)

1. **Create your prototype component** (e.g., `web/src/MyPrototype.tsx`):

   ```tsx
   import { HStack, VStack } from "@coinbase/cds-web/layout";
   import { Text, Heading } from "@coinbase/cds-web/typography";
   import { Button } from "@coinbase/cds-web/forms";

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

- **Components**: Use `@coinbase/cds-web` for web components
- **Icons**: Import from `@coinbase/cds-icons`
- **Themes**: Use `coinbaseTheme` or create custom themes
- **Documentation**: Available in the main CDS repository

## 📝 Available Scripts

### Web Scripts

- `yarn web:dev` - Start web development server
- `yarn web:build` - Build web app for production
- `yarn web:start` - Start web production server
- `yarn web:lint` - Lint web code
- `yarn web:format` - Format web code
- `yarn web:deploy:vercel` - Deploy to Vercel preview environment
- `yarn web:deploy:vercel:prod` - Deploy to Vercel production environment

### 🚀 Deploying to Vercel

1. **Install Vercel CLI** (one-time setup)
   ```bash
   npm i -g vercel
   ```

2. **Link your Vercel account** (one-time setup)
   ```bash
   vercel login
   vercel link
   ```

3. **Deploy**
   - For preview deployment: `yarn web:deploy:vercel`
   - For production deployment: `yarn web:deploy:vercel:prod`

The preview deployment will give you a unique URL for testing, while the production deployment will update your main domain.

### Mobile Scripts

- `yarn mobile:dev` - Start Expo development server
- `yarn mobile:start` - Start Expo development server
- `yarn mobile:android` - Start on Android emulator
- `yarn mobile:ios` - Start on iOS simulator
- `yarn mobile:web` - Start mobile app in web browser

Happy prototyping! 🎯
