import { useRouter } from "next/router";
import { FtcBoard } from "@/components/ftc-board";

const BoardDetailPage = () => {
  const { query } = useRouter();

  const boardId = query["boardId"];

  if (!boardId || Array.isArray(boardId)) {
    return <div>Invalid uri</div>;
  }

  return <FtcBoard registryId={boardId} />;
};

export default BoardDetailPage;
