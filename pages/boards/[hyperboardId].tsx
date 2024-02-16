import { useRouter } from "next/router";
import { HyperboardRendererWithUi } from "@/components/hyperboard-renderer-with-ui";

export const Index = () => {
  const { query } = useRouter();

  const hyperboardId = query.hyperboardId as string;

  return <HyperboardRendererWithUi hyperboardId={hyperboardId} />;
};

export default Index;
