import { useRouter } from "next/router";
import { HyperboardRenderer } from "@/components/hyperboard-renderer";

const BoardDetailPage = () => {
  const { query } = useRouter();

  const boardId = query["boardId"];

  if (!boardId || Array.isArray(boardId)) {
    return <div>Invalid uri</div>;
  }

  return <HyperboardRenderer hyperboardId={boardId} />;
};

export default BoardDetailPage;
