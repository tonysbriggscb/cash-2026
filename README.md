# Test Kit

Build interactive CDS prototypes and test them with your users.

---

## What is Test Kit?

Test Kit is a ready-to-use template for creating high-fidelity prototypes using the Coinbase Design System (CDS). It includes:

- **Realistic iPhone frame** with Dynamic Island and iOS status bar
- **Interactive toolbar** for restarting, switching flows, and toggling dark mode
- **Smooth screen transitions** that feel native
- **Full CDS component library** — use the same components as production

No setup required. Just clone and start building.

---

## Quick Start

### Option 1: Clone with Cursor (Recommended)

1. Open Cursor
2. Paste this command into Cursor chat or terminal:
   ```
   git clone https://github.cbhq.net/ben-webb/test-kit.git
   ```
3. Open the cloned folder in Cursor
4. Ask Cursor: *"Run yarn dev to start the prototype"*
5. View your prototype at `http://localhost:8081`

### Option 2: Add to an existing prototype

If you already have a CDS prototype:

1. Open your project in Cursor
2. Ask Cursor: *"Add the Test Kit wrapper from github.cbhq.net/ben-webb/test-kit"*

Cursor will copy the proto-kit folder and configure it for you.

---

## Building Your Prototype

Your prototype screens live in:
```
web/src/prototype-example/screens/
```

Each screen is a simple React component. Here's an example:

```tsx
import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";

export const MyScreen = ({ onNavigate }) => {
  return (
    <VStack gap={3} padding={3}>
      <Text font="title1">Hello!</Text>
      <Text font="body" color="fgMuted">
        This is my prototype screen.
      </Text>
      <Button onClick={() => onNavigate("next-screen")} block>
        Continue
      </Button>
    </VStack>
  );
};
```

### Working with Cursor

You don't need to write code yourself! Just describe what you want:

- *"Create a new screen with a form that has email and password fields"*
- *"Add a bottom sheet that slides up when I tap the button"*
- *"Make the background blue and add a back button"*
- *"Add a loading spinner while the data loads"*

Cursor will write the code for you using CDS components.

---

## Helpful Commands

Ask Cursor to run these for you:

| Command | What it does |
|---------|--------------|
| `yarn dev` | Start the prototype locally |
| `yarn build` | Build for production |

---

## Project Structure

```
test-kit/
├── web/src/
│   ├── proto-kit/           ← The Test Kit framework (don't edit)
│   └── prototype-example/   ← Your prototype lives here
│       ├── screens/         ← Add your screens here
│       └── index.ts         ← Configure screens & navigation
```

---

## Need Help?

- **CDS Documentation**: [go/cds](https://go/cds)
- **Questions**: Reach out in #design-systems on Slack

---

Happy prototyping! 🎯
