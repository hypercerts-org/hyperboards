import { useFetchRegistryById } from "@/hooks/useFetchRegistryById";
import { useFetchHypercertFractionsByHypercertIds } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import {
  Button,
  HStack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useAddress } from "@/hooks/useAddress";
import { downloadBlob } from "@/utils/downloadBlob";
import { arrayToCsv, parseCsv } from "@/utils/csv";
import React, { useRef } from "react";
import { useCreateOrUpdateFractionSpecificMetadata } from "@/hooks/useCreateOrUpdateFractionSpecificMetadata";
import { useChainId } from "wagmi";
import { useFetchFractionSpecificDisplay } from "@/hooks/useFetchFractionSpecificDisplay";

export const FractionDisplayDataAdmin = ({
  registryId,
}: {
  registryId: string;
}) => {
  const { data: registry } = useFetchRegistryById(registryId);

  if (!registry?.data?.claims?.length) {
    return null;
  }

  return (
    <DefaultDisplayDataForClaim
      registryId={registryId}
      claimIds={registry?.data.claims.map((claim) => claim.hypercert_id) || []}
    />
  );
};

const DefaultDisplayDataForClaim = ({
  registryId,
  claimIds,
}: {
  registryId: string;
  claimIds: string[];
}) => {
  const chainId = useChainId();
  const { data: fractions, refetch: refetchFractions } =
    useFetchHypercertFractionsByHypercertIds(claimIds);
  const { data: fractionSpecificData, refetch: refetchFractionSpecificData } =
    useFetchFractionSpecificDisplay(claimIds, chainId);
  const refresh = async () => {
    await Promise.all([refetchFractions, refetchFractionSpecificData]);
  };
  const address = useAddress();
  const fractionsOwnedByAdmin = fractions
    ?.filter((fraction) => fraction.owner === address?.toLowerCase())
    .map((fraction) => ({
      ...(fractionSpecificData?.find((x) => x.fraction_id === fraction.id) ||
        {}),
      ...fraction,
    }));
  const inputRef = useRef<HTMLInputElement>(null);

  const csvHeaders = [
    "hypercertName",
    "hypercertId",
    "fractionId",
    "Units",
    "githubUsername",
    "firstName",
    "lastName",
    "companyName",
    "image",
    "type",
  ];
  const { mutateAsync } = useCreateOrUpdateFractionSpecificMetadata("github");

  const onDownloadTemplateCsv = () => {
    if (!fractionsOwnedByAdmin?.length) {
      console.log("no fractions owned by admin");
      return;
    }
    const csvData = fractionsOwnedByAdmin.map((fraction) => [
      fraction.metadata?.name || "",
      fraction.hypercertId,
      fraction.id,
      fraction.units,
      fraction.value || "",
      fraction.firstName,
      fraction.lastName,
      fraction.companyName,
      fraction.image,
      fraction.type,
    ]);
    const csv = arrayToCsv(csvHeaders, csvData);
    downloadBlob(csv, `${registryId}-fractions-template.csv`, `text/csv`);
  };

  const onClickFileUpload = () => {
    inputRef.current?.click();
  };

  const onCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const csv = event.target?.result;
      const parsedCSV = parseCsv(csv as string);
      console.log(parsedCSV);
      await mutateAsync({
        values: parsedCSV.map((row) => ({
          hypercertId: row["hypercertId"],
          fractionId: row["fractionId"],
          chainId: chainId,
          values: {
            githubUsername: row["githubUsername"],
            image: row["image"],
            firstName: row["firstName"],
            lastName: row["lastName"],
            companyName: row["companyName"],
            type: row["type"],
          },
        })),
      });
      await refresh();
    };
    reader.readAsText(file);
  };

  return (
    <>
      <TableContainer width={"100%"}>
        <Table variant={"striped"} colorScheme="blue" size={"sm"}>
          <TableCaption placement="top">
            Fraction specific display data
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Hypercert name</Th>
              <Th>Fraction ID</Th>
              <Th>Units</Th>
              <Th>Percentage</Th>
              <Th>GitHub username</Th>
              <Th>First name</Th>
              <Th>Last name</Th>
              <Th>Company name</Th>
              <Th>Image URL</Th>
              <Th>Type</Th>
            </Tr>
          </Thead>
          <Tbody>
            {fractionsOwnedByAdmin?.map((fraction) => (
              <Tr key={fraction.id}>
                <Td>{fraction.metadata?.name}</Td>
                <Td>{fraction.tokenID}</Td>
                <Td>{fraction.units}</Td>
                <Td>{fraction.percentage}</Td>
                <Td>{fraction.value}</Td>
                <Td>{fraction.firstName}</Td>
                <Td>{fraction.lastName}</Td>
                <Td>{fraction.companyName}</Td>
                <Td>
                  <a href={fraction.image}>{fraction.image}</a>
                </Td>
                <Td>{fraction.type}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <HStack>
        <Button colorScheme="blue" onClick={onDownloadTemplateCsv}>
          Download CSV
        </Button>
        <Button onClick={onClickFileUpload}>Upload CSV</Button>
      </HStack>
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={onCsvUpload}
      />
    </>
  );
};
