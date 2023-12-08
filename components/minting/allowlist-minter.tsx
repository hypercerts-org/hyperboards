import { useToast, VStack } from "@chakra-ui/react";
import {
  MintingForm,
  MintingFormValues,
} from "@/components/minting/minting-form";
import { useRef } from "react";
import { exportAsImage } from "@/lib/exportToImage";
import {
  HypercertMetadata,
  TransferRestrictions,
  validateMetaData,
  validateClaimData,
  AllowlistEntry,
  validateAllowlist,
} from "@hypercerts-org/sdk";
import { useInteractionModal } from "@/components/interaction-modal";
import { useAddress } from "@/hooks/useAddress";
import { TransactionReceipt } from "viem";
import { useEthersProvider } from "@/hooks/useEthersProvider";
import { useHypercertClient } from "@/components/providers";

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

const formValuesToAllowlistAndTotalUnits = (
  values: MintingFormValues,
): { allowList: AllowlistEntry[]; totalUnits: bigint } => {
  if (!values.allowlist) {
    throw new Error("Allowlist is not defined");
  }

  const allowlistBigintUnits = values.allowlist.map((entry) => ({
    address: entry.address,
    units: BigInt(entry.units),
  }));

  const totalUnits: bigint = values.allowlist?.reduce(
    (acc, entry) => acc + BigInt(entry.units),
    0n,
  );

  const { errors: allowlistErrors, valid: allowlistValid } = validateAllowlist(
    allowlistBigintUnits,
    totalUnits,
  );

  if (!allowlistValid) {
    console.error(allowlistErrors);
    throw new Error("Allowlist data is not valid");
  }

  return { allowList: allowlistBigintUnits, totalUnits };
};

export const AllowlistMinter = ({
  onComplete,
}: {
  onComplete?: (txHash?: string) => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const toast = useToast();
  const { onOpen, setStep, onClose } = useInteractionModal();
  const address = useAddress();
  const provider = useEthersProvider();
  const client = useHypercertClient();

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

    const steps = [
      {
        title: "Generate image",
        description: "Generating image",
      },
      {
        title: "Minting",
        description: "Minting",
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
      const { allowList, totalUnits } =
        formValuesToAllowlistAndTotalUnits(values);
      const transactionHash = await client.createAllowlist(
        allowList,
        claimData,
        totalUnits,
        TransferRestrictions.FromCreatorOnly,
      );
      // @ts-ignore
      transactionReceipt = await provider.waitForTransaction(transactionHash);
      onComplete?.(transactionReceipt?.transactionHash);
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

    onClose();
    onComplete?.();
  };

  const initialValues: MintingFormValues = {
    name: "",
    description: "",
    externalUrl: "",
    workScope: "",
    contributors: "",
    workStart: new Date(),
    workEnd: new Date(),
    allowlist: [{ address: address!, units: 10000 }],
    backgroundColor: "#73C9CC",
    textColor: "#194446",
    contributorsGaveTheirPermission: false,
    agreeToTerms: false,
  };

  return (
    <>
      <VStack>
        <MintingForm
          initialValues={initialValues}
          disabled={!client}
          onSubmit={onMint}
          buttonLabel="Mint"
          imageRef={ref}
        />
      </VStack>
    </>
  );
};
