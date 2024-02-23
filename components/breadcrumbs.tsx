import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { BiChevronRight } from "react-icons/bi";

export interface BreadcrumbEntry {
  name: string;
  onClick: () => void;
  isActive?: boolean;
  id: string;
}

export interface BreadcrumbsProps {
  crumbs: BreadcrumbEntry[];
}

export const Breadcrumbs = ({ crumbs }: BreadcrumbsProps) => {
  return (
    <Breadcrumb separator={<BiChevronRight color="gray.500" />}>
      {crumbs.map((crumb) => (
        <BreadcrumbItem
          isCurrentPage={crumb.isActive}
          key={crumb.id}
          onClick={crumb.onClick}
        >
          <BreadcrumbLink>{crumb.name}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};
