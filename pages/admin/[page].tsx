import { Flex, useColorModeValue } from "@chakra-ui/react";
import SimpleSidebar from "@/components/admin/sidebar";
import { FiCompass, FiHome, FiTrendingUp } from "react-icons/fi";
import { useRouter } from "next/router";
import { HyperboardsAdmin } from "@/components/admin/hyperboards-admin";
import { RegistriesAdmin } from "@/components/admin/registries-admin";
import { headerHeight } from "@/components/Layout";

const SIDEBAR_ITEMS = [
  { name: "Hyperboards", icon: FiHome, href: "/admin/hyperboards/" },
  { name: "Registries", icon: FiTrendingUp, href: "/admin/registries/" },
  { name: "Blueprints", icon: FiCompass, href: "/admin/blueprints/" },
];

const Admin = () => {
  const router = useRouter();
  const page = router.query["page"];

  return (
    <Flex width={"100%"} height={`calc(100vh - ${headerHeight})`}>
      <SimpleSidebar linkItems={SIDEBAR_ITEMS} />
      <Flex width={"100%"} bg={useColorModeValue("gray.100", "gray.900")} p="4">
        {page === "hyperboards" && <HyperboardsAdmin />}
        {page === "registries" && <RegistriesAdmin />}
      </Flex>
    </Flex>
  );
};

export default Admin;
