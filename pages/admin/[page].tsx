import { Flex, useColorModeValue } from "@chakra-ui/react";
import SimpleSidebar from "@/components/admin/sidebar";
import { FiCompass, FiHome, FiTrendingUp } from "react-icons/fi";
import { useRouter } from "next/router";
import { HyperboardsAdmin } from "@/components/admin/hyperboards-admin";

const SIDEBAR_ITEMS = [
  { name: "Hyperboards", icon: FiHome, href: "/admin/hyperboards" },
  { name: "Registries", icon: FiTrendingUp, href: "/admin/registries" },
  { name: "Blueprints", icon: FiCompass, href: "/admin/blueprints" },
];

const Admin = () => {
  const router = useRouter();
  const page = router.query["page"];

  return (
    <Flex width={"100%"} height={"100%"}>
      <SimpleSidebar linkItems={SIDEBAR_ITEMS} />
      <Flex
        width={"100%"}
        minHeight={"100%"}
        bg={useColorModeValue("gray.100", "gray.900")}
        ml={{ base: 0, md: 60 }}
        p="4"
      >
        {page === "hyperboards" && <HyperboardsAdmin />}
      </Flex>
    </Flex>
  );
};

export default Admin;
