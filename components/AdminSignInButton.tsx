import { Button } from "@chakra-ui/react";
import { useLogin } from "@/hooks/useLogin";

export const AdminSignInButton = () => {
  const login = useLogin();
  return <Button onClick={login}>Sign in to admin</Button>;
};
