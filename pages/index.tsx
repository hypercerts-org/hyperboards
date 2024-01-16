import React from "react";
import { HyperboardRenderer } from "@/components/hyperboard-renderer";
import Head from "next/head";

function Index() {
  return (
    <>
      <Head>
        <title>Hyperboards - FTC</title>
      </Head>
      <HyperboardRenderer
        hyperboardId={"e57ed678-ef52-404c-b7aa-986314a07192"}
      />
    </>
  );
}

export default Index;
