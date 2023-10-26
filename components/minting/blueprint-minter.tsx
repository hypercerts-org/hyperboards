import { useBlueprintById } from "@/hooks/useBlueprintById";
import { Heading, HStack, Spinner, useToast } from "@chakra-ui/react";
import {
  MintingForm,
  MintingFormValues,
} from "@/components/minting/minting-form";
import { HypercertPreview } from "@/components/minting/hypercert-preview";
import { useRef } from "react";
import { exportAsImage } from "@/lib/exportToImage";
import { useHypercertClient } from "@/components/providers";
import {
  HypercertMetadata,
  TransferRestrictions,
  validateMetaData,
  validateClaimData,
} from "@hypercerts-org/sdk";
import { ContractReceipt } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { useCreateClaims } from "@/hooks/useCreateClaims";
import { useDeleteBlueprint } from "@/hooks/useDeleteBlueprint";

const formValuesToHypercertMetadata = (
  values: MintingFormValues,
  image: string,
): HypercertMetadata => {
  const claimData = {
    work_scope: {
      value: values.workScope.split(",").map((x) => x.trim()),
    },
    contributors: {
      value: values.contributors.split(",").map((x) => x.trim()),
    },
    impact_scope: {
      value: [],
    },
    rights: {
      value: [],
    },
    impact_timeframe: {
      value: [],
    },
    work_timeframe: {
      value: [
        Math.floor(values.workStart.getTime() / 1000),
        Math.floor(values.workEnd.getTime() / 1000),
      ],
    },
  };

  const { errors: claimDataErrors, valid: claimDataValid } =
    validateClaimData(claimData);

  if (!claimDataValid) {
    console.error(claimDataErrors);
    throw new Error("Claim data is not valid");
  }

  const metaData = {
    name: values.name,
    description: values.description,
    external_url: values.externalUrl,
    image: image,
    hypercert: claimData,
  };

  const { errors: metaDataErrors, valid: metaDataValid } =
    validateMetaData(metaData);

  if (!metaDataValid) {
    console.error(metaDataErrors);
    throw new Error("Metadata is not valid");
  }

  return metaData;
};

const constructClaimIdFromContractReceipt = (receipt: ContractReceipt) => {
  const { events } = receipt;

  if (!events) {
    throw new Error("No events in receipt");
  }

  const claimEvent = events.find((e) => e.event === "TransferSingle");

  if (!claimEvent) {
    throw new Error("TransferSingle event not found");
  }

  const { args } = claimEvent;

  if (!args) {
    throw new Error("No args in event");
  }

  const tokenIdBigNumber = args[3] as BigNumber;

  if (!tokenIdBigNumber) {
    throw new Error("No tokenId arg in event");
  }

  const contractId = receipt.to.toLowerCase();
  const tokenId = tokenIdBigNumber.toString();

  return `${contractId}-${tokenId}`;
};

export const BlueprintMinter = ({ blueprintId }: { blueprintId: number }) => {
  const { data: blueprint, isLoading } = useBlueprintById(blueprintId);
  const ref = useRef<HTMLDivElement | null>(null);
  const toast = useToast();
  const client = useHypercertClient();
  const { mutateAsync: createClaims } = useCreateClaims();
  const { mutateAsync: deleteBlueprint } = useDeleteBlueprint();

  const onMint = async (values: MintingFormValues) => {
    if (!blueprint?.data?.registries) {
      toast({
        title: "Error",
        description: "Blueprint not found",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (!client) {
      toast({
        title: "Error",
        description: "Client not initialized",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const image = await exportAsImage(ref);

    if (!image) {
      toast({
        title: "Error",
        description: "Could not export image",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    let contractReceipt: ContractReceipt | undefined;

    try {
      const claimData = formValuesToHypercertMetadata(values, image);
      const mintResult = await client.mintClaim(
        claimData,
        1000,
        TransferRestrictions.FromCreatorOnly,
      );
      contractReceipt = await mintResult.wait();
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not mint hypercert",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    let claimId: string | undefined;

    try {
      claimId = constructClaimIdFromContractReceipt(contractReceipt);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not construct claimId",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      await createClaims({
        claims: [
          {
            hypercert_id: claimId,
            registry_id: blueprint.data.registry_id,
            admin_id: blueprint.data.admin_id,
            chain_id: blueprint.data.registries.chain_id,
          },
        ],
      });
      toast({
        title: "Success",
        description: "Claim added to registry",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Could not add claim to registry",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      await deleteBlueprint(blueprintId);
      toast({
        title: "Success",
        description: "Blueprint deleted",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Could not delete blueprint",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!blueprint?.data) {
    return <Heading>Blueprint not found</Heading>;
  }
  const initialValues = blueprint.data
    ?.form_values! as unknown as MintingFormValues;

  const workEnd = new Date(initialValues.workEnd);
  const workStart = new Date(initialValues?.workStart);

  const values = {
    ...initialValues,
    workEnd,
    workStart,
  };

  return (
    <HStack>
      <MintingForm
        onSubmit={onMint}
        initialValues={values}
        buttonLabel="Mint"
      />
      <HypercertPreview values={values} imageRef={ref} />
    </HStack>
  );
};
