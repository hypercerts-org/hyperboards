import React from "react";
import Head from "next/head";
import { HyperboardRendererWithUi } from "@/components/hyperboard-renderer-with-ui";

function Index() {
  return (
    <>
      <Head>
        <title>Hyperboards - FTC</title>
      </Head>
      <HyperboardRendererWithUi
        hyperboardId={"e57ed678-ef52-404c-b7aa-986314a07192"}
      />
    </>
  );
}

export default Index;
