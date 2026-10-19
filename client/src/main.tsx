import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// The site used hash routing (`/#/pricing`) until October 2026. Old links in
// emails, social posts and search results still arrive that way, so rewrite
// them to the real path before the router mounts. Section anchors inside a
// legacy hash route (`/#/features#slips`) are preserved as a normal hash.
const legacy = window.location.hash;
if (legacy.startsWith("#/")) {
  const [path, anchor] = legacy.slice(1).split("#");
  window.history.replaceState(null, "", `${path || "/"}${window.location.search}${anchor ? `#${anchor}` : ""}`);
}

createRoot(document.getElementById("root")!).render(<App />);
