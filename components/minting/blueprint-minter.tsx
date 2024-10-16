import { useBlueprintById } from "@/hooks/useBlueprintById";
import {
  Heading,
  HStack,
  Spinner,
  useToast,
  Image,
  Button,
} from "@chakra-ui/react";
import {
  MintingForm,
  MintingFormValues,
} from "@/components/minting/minting-form";
import { useEffect, useRef, useState } from "react";
import { exportAsImage } from "@/lib/exportToImage";
import { useHypercertClient } from "@/components/providers";
import {
  HypercertMetadata,
  TransferRestrictions,
  validateMetaData,
  validateClaimData,
} from "@hypercerts-org/sdk";
import { useInteractionModal } from "@/components/interaction-modal";
import { useAddress } from "@/hooks/useAddress";
import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useChainId, useWalletClient } from "wagmi";
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/alert";
import { TransactionReceipt } from "viem";
import { NUMBER_OF_UNITS_IN_HYPERCERT } from "@/config";
import { constructClaimIdFromCreateClaimContractReceipt } from "@/utils/constructClaimIdFromCreateClaimContractReceipt";
import { waitForTransactionReceipt } from "viem/actions";

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

export const BlueprintMinter = ({
  blueprintId,
  onComplete,
}: {
  blueprintId: number;
  onComplete?: () => void;
}) => {
  const { data: blueprint, isLoading } = useBlueprintById(blueprintId);
  const ref = useRef<HTMLDivElement | null>(null);
  const toast = useToast();
  const client = useHypercertClient();
  const { onOpen, setStep, onClose } = useInteractionModal();
  const address = useAddress();
  const getClient = useGetAuthenticatedClient();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();

  const isCorrectChain = chainId === blueprint?.data?.registries?.chain_id;

  const [previewImageSrc, setPreviewImageSrc] = useState<string | undefined>(
    undefined,
  );

  const syncPreviewImage = async () => {
    const imagePreviewSrc = await exportAsImage(ref);

    setPreviewImageSrc(imagePreviewSrc);
  };

  useEffect(() => {
    syncPreviewImage();
  }, []);

  const onMint = async (values: MintingFormValues) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Address not found",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

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

    if (!walletClient) {
      toast({
        title: "Error",
        description: "Wallet client not initialized",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const supabase = await getClient();

    if (!supabase) {
      toast({
        title: "Error",
        description: "Client not initialized",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const steps = [
      {
        title: "Generate image",
        description: "Generating image",
      },
      {
        title: "Minting",
        description: "Minting",
      },
      {
        title: "Adding to registry",
        description: "Adding to registry and deleting blueprint",
      },
    ];

    onOpen(steps);
    setStep("Generate image");
    const image = await exportAsImage(ref);

    if (!image) {
      toast({
        title: "Error",
        description: "Could not export image",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      return;
    }

    let transactionReceipt: TransactionReceipt | undefined;

    setStep("Minting");
    try {
      const claimData = formValuesToHypercertMetadata(values, image);
      const transactionHash = await client.mintClaim(
        claimData,
        NUMBER_OF_UNITS_IN_HYPERCERT,
        TransferRestrictions.FromCreatorOnly,
      );

      if (!transactionHash) {
        throw new Error("No transaction hash");
      }
      transactionReceipt = await waitForTransactionReceipt(walletClient, {
        hash: transactionHash,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not mint hypercert",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      return;
    }

    let claimId: string | undefined;

    try {
      claimId = constructClaimIdFromCreateClaimContractReceipt(
        transactionReceipt!,
        chainId,
      );
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not construct claimId",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      return;
    }

    setStep("Adding to registry");
    try {
      await supabase.rpc("add_claim_from_blueprint", {
        registry_id: blueprint.data.registry_id,
        admin_id: blueprint.data.admin_id,
        chain_id: blueprint.data.registries.chain_id,
        owner_id: address,
        blueprint_id: blueprintId,
        hypercert_id: claimId,
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
      onClose();
      return;
    }

    onClose();
    onComplete?.();
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

  const isDevEnv = process.env.NODE_ENV === "development";

  return (
    <>
      {!isCorrectChain && (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>
            This blueprint is on a different chain. Please switch to the correct
            chain.
          </AlertDescription>
        </Alert>
      )}
      <HStack>
        <MintingForm
          disabled={!isCorrectChain}
          onSubmit={onMint}
          initialValues={values}
          buttonLabel="Mint"
          imageRef={ref}
        />
        {isDevEnv && <Image src={previewImageSrc} h={"400px"} w={"320px"} />}
      </HStack>
      {isDevEnv && (
        <Button onClick={syncPreviewImage}>Sync preview image</Button>
      )}
    </>
  );
};
