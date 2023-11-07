import React from "react";
import { FtcBoard } from "@/components/ftc-board";
import Head from "next/head";

function Index() {
  return (
    <>
      <Head>
        <title>Hyperboards - FTC</title>
      </Head>
      <FtcBoard hyperboardId={"2c2b02ca-05ec-484a-9d6a-0ed025b05ad7"} />
    </>
  );
}

export default Index;
