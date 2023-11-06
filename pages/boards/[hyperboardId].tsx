import { useRouter } from "next/router";
import { FtcBoard } from "@/components/ftc-board";

export const Index = () => {
  const { query } = useRouter();

  const hyperboardId = query.hyperboardId as string;

  return <FtcBoard hyperboardId={hyperboardId} />;
};

export default Index;
