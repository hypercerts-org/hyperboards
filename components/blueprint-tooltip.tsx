import { Flex, FlexProps, Tooltip } from "@chakra-ui/react";
import { InfoCircleFilled } from "@ant-design/icons";

const defaultText =
  "This is a blueprint, which means the owner has not claimed their hypercert yet";
const defaultColor = "gray.600";

export const BlueprintTooltip = ({
  text = defaultText,
  ...flexProps
}: { text?: string } & FlexProps) => {
  return (
    <Flex color={defaultColor} {...flexProps}>
      <Tooltip label={text} aria-label={text}>
        <InfoCircleFilled />
      </Tooltip>
    </Flex>
  );
};
