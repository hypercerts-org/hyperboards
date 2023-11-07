import { Flex, useColorModeValue } from "@chakra-ui/react";
import SimpleSidebar from "@/components/admin/sidebar";
import { FiCompass, FiHome, FiTrendingUp } from "react-icons/fi";
import { useRouter } from "next/router";
import { HyperboardsAdmin } from "@/components/admin/hyperboards-admin";
import { RegistriesAdmin } from "@/components/admin/registries-admin";
import { MyBlueprintsAdmin } from "@/components/admin/my-blueprints-admin";
import { MyClaimsAdmin } from "@/components/admin/my-claims-admin";
import { DefaultDisplayData } from "@/components/admin/default-display-data";
import { headerHeight } from "@/components/layout/header";

const SIDEBAR_ITEMS = [
  { name: "Hyperboards", icon: FiHome, href: "/admin/hyperboards/" },
  { name: "Registries", icon: FiTrendingUp, href: "/admin/registries/" },
  { name: "My claims", icon: FiCompass, href: "/admin/my-claims/" },
  { name: "My blueprints", icon: FiCompass, href: "/admin/my-blueprints/" },
  {
    name: "Default display data",
    icon: FiCompass,
    href: "/admin/default-display-metadata/",
  },
];

const Admin = () => {
  const router = useRouter();
  const page = router.query["page"];

  return (
    <Flex width={"100%"} height={`calc(100vh - ${headerHeight})`}>
      <SimpleSidebar linkItems={SIDEBAR_ITEMS} />
      <Flex width={"100%"} bg={useColorModeValue("gray.100", "gray.900")} p="4">
        {page === undefined && <HyperboardsAdmin />}
        {page === "hyperboards" && <HyperboardsAdmin />}
        {page === "registries" && <RegistriesAdmin />}
        {page === "my-claims" && <MyClaimsAdmin />}
        {page === "my-blueprints" && <MyBlueprintsAdmin />}
        {page === "default-display-metadata" && <DefaultDisplayData />}
      </Flex>
    </Flex>
  );
};

export default Admin;
