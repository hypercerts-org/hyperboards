import React from "react";
import { createRoot } from "react-dom/client";
import { HyperboardRenderer } from "@/components/hyperboard-renderer";
import { Providers } from "@/components/providers";

const observer = new MutationObserver((mutationList, observer) => {
  // Callback function to execute when mutations are observed
  const widgetDivs = document.querySelectorAll(".hyperboard-widget");

  // Inject our React App into each class
  widgetDivs.forEach((container) => {
    const hyperboardId = container.getAttribute("data-hyperboard-id");
    if (container.hasChildNodes()) {
      console.log("Hyperboard already rendered. Skipping.", hyperboardId);
      return;
    }

    const showTable =
      container.getAttribute("data-hyperboard-show-table") === "true";

    if (!hyperboardId) {
      console.error("No hyperboard id found");
      return;
    }

    console.log("rendering hyperboard", hyperboardId, "showTable", showTable);
    const root = createRoot(container); // createRoot(container!) if you use TypeScript
    root.render(
      <Providers showReactQueryDevtools={false} resetCSS={false}>
        <HyperboardRenderer
          hyperboardId={hyperboardId}
          showTable={showTable}
          disableToast
        />
      </Providers>,
    );
  });
});

// Start observing the target node for configured mutations
observer.observe(document.documentElement || document.body, {
  attributes: true,
  childList: true,
  subtree: true,
});
