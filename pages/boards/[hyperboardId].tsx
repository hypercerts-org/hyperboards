import { useRouter } from "next/router";
import { HyperboardRenderer } from "@/components/hyperboard-renderer";

export const Index = () => {
  const { query } = useRouter();

  const hyperboardId = query.hyperboardId as string;

  return <HyperboardRenderer hyperboardId={hyperboardId} />;
};

export default Index;
