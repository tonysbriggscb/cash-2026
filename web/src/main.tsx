import "@coinbase/cds-icons/fonts/web/icon-font.css";
import "@coinbase/cds-web/defaultFontStyles";

import { createRoot } from "react-dom/client";
import { App } from "./App";

const node = document.createElement("div") as Element;

document.body.appendChild(node);

const root = createRoot(node);

root.render(<App />);
