# CDS Playground

A playground environment for building prototypes with Coinbase Design System (CDS) outside the main frontend/cds repository.

<img src="cover.webp" alt="CDS Playground Cover" width="1200">

## 🚀 Getting Started

```bash
yarn install
yarn dev
```

Visit `http://localhost:8081` to see your app.

## 📱 Demo App

The current app (`Demo`) is a todo list application that showcases various CDS components. It includes:

- Theme switching (light/dark)
- Modal interactions
- Layout components (HStack, VStack)
- Form components
- State management with Redux Toolkit

## 🔧 Building Your Own Prototype

**Super simple!** All the technical setup is handled automatically. Just focus on building with CDS:

### Quick Start (Recommended)

1. **Create your prototype component** (e.g., `src/MyPrototype.tsx`):

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

2. **Update the import in `src/App.tsx`** (just one line!):

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

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Lint code
- `yarn format` - Format code

Happy prototyping! 🎯
