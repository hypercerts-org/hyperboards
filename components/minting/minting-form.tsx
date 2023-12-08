import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Stack,
  Textarea,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { HypercertPreview } from "@/components/minting/hypercert-preview";
import { MutableRefObject } from "react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

export interface MintingFormValues {
  name: string;
  workScope: string;
  description: string;
  externalUrl: string;
  workStart: Date;
  workEnd: Date;
  contributors: string;
  backgroundColor: string;
  textColor: string;
  allowlist?: { address: string; units: number }[];
}

// Default values minting form for testing
export const defaultMintingFormValues: MintingFormValues = {
  name: "Test",
  workScope: "Test",
  description: "Test",
  externalUrl: "Test",
  workStart: new Date(),
  workEnd: new Date(),
  contributors: "Test",
  backgroundColor: "#73C9CC",
  textColor: "#194446",
};

const useMintingForm = (initialValues?: MintingFormValues) =>
  useForm<MintingFormValues>({
    defaultValues: initialValues || defaultMintingFormValues,
  });

export const MintingForm = ({
  onSubmit,
  initialValues,
  buttonLabel = "Submit",
  disabled,
  imageRef,
}: {
  onSubmit: (values: MintingFormValues) => void;
  initialValues?: MintingFormValues;
  buttonLabel?: string;
  disabled?: boolean;
  imageRef?: MutableRefObject<HTMLDivElement | null>;
}) => {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useMintingForm(initialValues);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "allowlist",
  });

  const isDisabled = isSubmitting || disabled;
  const values = watch();

  // const isDevelopment = process.env.NODE_ENV === "development";
  const isDevelopment = false;

  return (
    <Stack
      direction={["column-reverse", "column-reverse", "column-reverse", "row"]}
      w={"100%"}
      minW={0}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Flex width={"100%"} minWidth={0}>
          <VStack minHeight={"100%"} spacing={4} alignItems={"flex-start"}>
            <FormControl isInvalid={!!errors.name?.message}>
              <FormLabel>Name</FormLabel>
              <Input {...register("name")} isDisabled={isDisabled} />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.workScope?.message}>
              <FormLabel>Work Scope</FormLabel>
              <Input {...register("workScope")} isDisabled={isDisabled} />
              <FormErrorMessage>{errors.workScope?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.description?.message}>
              <FormLabel>Description</FormLabel>
              <Textarea {...register("description")} isDisabled={isDisabled} />
              <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.externalUrl?.message}>
              <FormLabel>External URL</FormLabel>
              <Input {...register("externalUrl")} isDisabled={isDisabled} />
              <FormErrorMessage>{errors.externalUrl?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.workStart?.message}>
              <FormLabel>Work Start</FormLabel>
              <SingleDatepicker
                disabled={isDisabled}
                name="date-work-start"
                onDateChange={(e) => setValue("workStart", e)}
                date={watch("workStart")}
              />
              <FormErrorMessage>{errors.workStart?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.workEnd?.message}>
              <FormLabel>Work End</FormLabel>
              <SingleDatepicker
                disabled={isDisabled}
                onDateChange={(e) => setValue("workEnd", e)}
                name="date-work-end"
                date={watch("workEnd")}
              />
              <FormErrorMessage>{errors.workEnd?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.contributors?.message}>
              <FormLabel>Contributors</FormLabel>
              <Input isDisabled={isDisabled} {...register("contributors")} />
              <FormErrorMessage>
                {errors.contributors?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.allowlist?.message}>
              <FormLabel>Allowlist</FormLabel>
              <VStack>
                {fields.map((field, index) => (
                  <HStack key={field.id}>
                    <Controller
                      render={({ field }) => (
                        <InputGroup flexDirection={"column"}>
                          {index === 0 && <FormLabel>Address</FormLabel>}
                          <Input
                            placeholder={"Address"}
                            isDisabled={isDisabled}
                            required
                            {...field}
                          />
                        </InputGroup>
                      )}
                      name={`allowlist.${index}.address`}
                      control={control}
                    />
                    <InputGroup key={field.id}>
                      <Controller
                        render={({ field }) => (
                          <InputGroup flexDirection={"column"}>
                            {index === 0 && <FormLabel>Units</FormLabel>}
                            <Input
                              isDisabled={isDisabled}
                              placeholder={"Units"}
                              type="number"
                              required
                              {...field}
                            />
                          </InputGroup>
                        )}
                        name={`allowlist.${index}.units`}
                        control={control}
                      />
                    </InputGroup>{" "}
                    <Flex
                      height={"100%"}
                      alignItems={"flex-end"}
                      marginTop={"auto"}
                    >
                      {index == fields.length - 1 ? (
                        <Tooltip
                          hasArrow
                          label="Add another allowlist entry"
                          aria-label="Add another allowlist entry"
                        >
                          <IconButton
                            aria-label="Add another allowlist entry"
                            onClick={() =>
                              append({ address: "", units: 10000 })
                            }
                            icon={<AddIcon />}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip
                          hasArrow
                          label="Remove allowlist entry"
                          aria-label="Remove allowlist entry"
                        >
                          <IconButton
                            aria-label="remove allowlist entry"
                            background={"red.500"}
                            onClick={() => remove(index)}
                            icon={<DeleteIcon />}
                          />
                        </Tooltip>
                      )}
                    </Flex>
                  </HStack>
                ))}
              </VStack>

              <FormErrorMessage>{errors.allowlist?.message}</FormErrorMessage>
            </FormControl>
            {isDevelopment && (
              <FormControl isInvalid={!!errors.backgroundColor?.message}>
                <FormLabel>Background</FormLabel>
                <Input
                  type={"color"}
                  isDisabled={isDisabled}
                  defaultValue={values.backgroundColor}
                  {...register("backgroundColor")}
                />
                <FormErrorMessage>
                  {errors.backgroundColor?.message}
                </FormErrorMessage>
              </FormControl>
            )}
            {isDevelopment && (
              <FormControl isInvalid={!!errors.textColor?.message}>
                <FormLabel>Text</FormLabel>
                <Input
                  type={"color"}
                  isDisabled={isDisabled}
                  defaultValue={values.textColor}
                  {...register("textColor")}
                />
                <FormErrorMessage>{errors.textColor?.message}</FormErrorMessage>
              </FormControl>
            )}

            <Button
              width={"100%"}
              type={"submit"}
              isDisabled={isDisabled}
              variant={"blackAndWhite"}
              borderRadius={0}
            >
              {buttonLabel}
            </Button>
          </VStack>
        </Flex>
      </form>
      <Center>
        <HypercertPreview
          imageRef={imageRef}
          values={values}
          backgroundColor={values.backgroundColor}
          textColor={values.textColor}
        />
      </Center>
    </Stack>
  );
};
