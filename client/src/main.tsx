import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/500.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/orbitron/900.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/space-mono/400.css';

createRoot(document.getElementById("root")!).render(<App />);
