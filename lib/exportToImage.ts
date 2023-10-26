import html2canvas from "html2canvas";
import { MutableRefObject } from "react";

export const exportAsImage = async (
  ref: MutableRefObject<HTMLDivElement | null>,
) => {
  const el = ref.current;

  if (!el) {
    return;
  }

  const canvas = await html2canvas(el, {
    logging: true,
    backgroundColor: null,
    //useCORS: true,
    proxy: "https://cors-proxy.hypercerts.workers.dev/",
    imageTimeout: 0,
  });
  return canvas.toDataURL("image/png", 1.0);
};
