import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { FtcBoard } from "@/components/ftc-board";
import { ConnectButton } from "@/components/ConnectButton";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "fyzUiR9xFxM4i8qbFQTNzu", // ID of a project you are using
      token:
        "9w4RzLtSF94NnD1PUKqrKUWA2hTKdKJZARgeDx39cX4BCSvgkvkoknA70mClZNxRmemLYonFE4GohvY3bWg", // API token for that project
    },
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
});

PLASMIC.registerComponent(FtcBoard, {
  name: "FtcBoard",
  importPath: "./components/ftc-board",
  props: {},
});

PLASMIC.registerComponent(ConnectButton, {
  name: "ConnectButton",
  importPath: "./components/connect-button",
  props: {},
});

PLASMIC.registerComponent(S);
