# CDS Web Playground

A React web application playground for prototyping with Coinbase Design System (CDS) components.

## 🚀 Getting Started

From the root directory:

```bash
yarn install
yarn web:dev
```

Or from this directory:

```bash
yarn dev
```

Visit `http://localhost:8080` to see your app.

## 📱 Demo App

The current app (`Demo`) is a todo list application that showcases various CDS components:

- Theme switching (light/dark)
- Modal interactions
- Layout components (HStack, VStack)

## 🔧 Building Your Own Prototype

**Super simple!** All the technical setup is handled automatically. Just focus on building with CDS:

### Quick Start

1. **Create your prototype component** (e.g., `src/MyPrototype.tsx`):

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

2. **Update the import in `src/App.tsx`**:

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
- **Fonts**: Already included via `@cbhq/cds-fonts`
- **Themes**: Use `coinbaseTheme` or create custom themes
- **Documentation**: Available in the main CDS repository

## 📝 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Lint code
- `yarn format` - Format code
