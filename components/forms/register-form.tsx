import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRegisterUser } from "@/hooks/useRegisterUser";
import { useRouter } from "next/router";

export const RegisterForm = ({}: {}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>();

  const { mutateAsync: registerAsync } = useRegisterUser();
  const toast = useToast();
  const { push } = useRouter();

  const onSubmitted = async ({ email }: { email: string }) => {
    try {
      await registerAsync(email);
      toast({
        title: "Registration successful",
        description: "You are now able to use the admin panel",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      await push("/admin/hyperboards");
    } catch (e) {
      console.error(e);
      toast({
        title: "Registration error",
        description: "There was an error registering your email.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitted)}>
      <VStack>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            placeholder="Email"
            {...register("email", {
              required: "This is required",
              minLength: {
                value: 4,
                message: "Minimum length should be 4",
              },
            })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          isLoading={isSubmitting}
          type="submit"
          colorScheme="blue"
          width="full"
        >
          Register
        </Button>
      </VStack>
    </form>
  );
};
