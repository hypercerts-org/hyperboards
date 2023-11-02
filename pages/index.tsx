import React from "react";
import { FtcBoard } from "@/components/ftc-board";
import Head from "next/head";

function Index() {
  return (
    <>
      <Head>
        <title>Hyperboards - FTC</title>
      </Head>
      <FtcBoard hyperboardId={"82581a5b-7efe-48d1-b766-862c02473d15"} />
    </>
  );
}

export default Index;
