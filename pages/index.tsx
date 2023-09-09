import React from "react";
import { FtcBoard } from "@/components/ftc-board";
import Head from "next/head";

function Index() {
  return (
    <>
      <Head>
        <title>Hyperboards - FTC</title>
      </Head>
      <FtcBoard registryId={"c471dae2-c933-432c-abcc-84a57d809d44"} />
    </>
  );
}

export default Index;
