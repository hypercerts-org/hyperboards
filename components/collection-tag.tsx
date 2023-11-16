import { Tag, Text } from "@chakra-ui/react";
import { useHover } from "@uidotdev/usehooks";

export const CollectionTag = ({
  name,
  count,
  onClick,
  isSelected,
}: {
  name: string;
  count: number;
  onClick?: () => void;
  isSelected?: boolean;
}) => {
  const [ref, isHovered] = useHover();
  const backgroundColor = (function () {
    if (!onClick) return "none";

    if (isSelected && !isHovered) return "black";
    if (isSelected && isHovered) return "white";
    if (!isSelected && isHovered) return "white";
    return "none";
  })();
  const color = (function () {
    if (isSelected && !isHovered) return "white";
    if (isSelected && isHovered) return "black";
    if (!isSelected && isHovered) return "black";
    return "black";
  })();
  return (
    <Tag
      ref={ref}
      onClick={onClick}
      data-group
      backgroundColor={backgroundColor}
      cursor={onClick ? "pointer" : "default"}
      pr={12}
      position={"relative"}
      sx={{
        color,
      }}
    >
      <Text as={"span"}>{name}</Text>
      {(!onClick || !isHovered) && (
        <Text
          as={"span"}
          position={"absolute"}
          right={3}
          opacity={isSelected ? 1 : 0.5}
        >
          {count}
        </Text>
      )}
      {onClick && isHovered && !isSelected && (
        <Text fontSize={"xl"} position={"absolute"} right={3}>
          +
        </Text>
      )}
      {onClick && isHovered && isSelected && (
        <Text fontSize={"md"} position={"absolute"} right={3}>
          x
        </Text>
      )}
    </Tag>
  );
};
