// Find all widget divs
import React from "react";
import { createRoot } from "react-dom/client";
import { HyperboardRenderer } from "@/components/hyperboard-renderer";
import { Providers } from "@/components/providers";

const widgetDivs = document.querySelectorAll(".hyperboard-widget");

// Inject our React App into each class
widgetDivs.forEach((container) => {
  const hyperboardId = container.getAttribute("data-hyperboard-id");

  if (!hyperboardId) {
    console.error("No hyperboard id found");
    return;
  }

  console.log("rendering hyperboard", hyperboardId);
  const root = createRoot(container); // createRoot(container!) if you use TypeScript
  root.render(
    <Providers showReactQueryDevtools={false}>
      <HyperboardRenderer hyperboardId={hyperboardId} />
    </Providers>,
  );
});
