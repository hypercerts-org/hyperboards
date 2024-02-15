// Find all widget divs
import React from "react";
import { createRoot } from "react-dom/client";
import { HyperboardRenderer } from "@/components/hyperboard-renderer";

const widgetDivs = document.querySelectorAll(".hyperboard-widget");

// Inject our React App into each class
widgetDivs.forEach((container) => {
  const root = createRoot(container); // createRoot(container!) if you use TypeScript
  root.render(<HyperboardRenderer hyperboardId="a" />);
});
