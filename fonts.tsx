import { Global } from "@emotion/react";
const Fonts = () => (
  <Global
    styles={`
      @font-face {
  font-family: "Director-Regular";
  font-style: normal;
  font-weight: 100 900;
  font-display: optional;
  src: url(https://hyperboards-git-feature-hyperboard-widget-hypercerts-foundation.vercel.app/fonts/Director-Regular.woff2) format("woff2");
}

@font-face {
  font-family: "Director-Variable";
  font-style: normal;
  font-weight: 100 900;
  font-display: optional;
  src: url(https://hyperboards-git-feature-hyperboard-widget-hypercerts-foundation.vercel.app/fonts/Director-Variable.woff2) format("woff2");
}
      `}
  />
);

export default Fonts;
