import React from "react";
import { HyperboardRenderer } from "@/components/hyperboard-renderer";
import Head from "next/head";
import { Button } from "@chakra-ui/react";
import { utils } from "@hypercerts-org/marketplace-sdk";

function Index() {
  return (
    <>
      <Head>
        <title>Hyperboards - FTC</title>
      </Head>
      <Button
        onClick={() => utils.api.fetchOrderNonce({ address: "a", chainId: 10 })}
      >
        make request
      </Button>
      <HyperboardRenderer
        hyperboardId={"e57ed678-ef52-404c-b7aa-986314a07192"}
      />
    </>
  );
}

export default Index;
