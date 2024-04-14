import { Badge, BadgeProps } from "@chakra-ui/react";
import { chainIdToName } from "@/utils/formatting";
import { parseClaimOrFractionId } from "@hypercerts-org/sdk";

export const ChainBadge = ({
  hypercertId,
  ...badgeProps
}: { hypercertId: string } & BadgeProps) => {
  const { chainId } = parseClaimOrFractionId(hypercertId);
  const name = chainIdToName(chainId);
  return (
    <Badge width={"fit-content"} height={"fit-content"} {...badgeProps}>
      {name}
    </Badge>
  );
};
