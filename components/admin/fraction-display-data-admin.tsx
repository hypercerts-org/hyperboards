import { useFetchRegistryById } from "@/hooks/useFetchRegistryById";
import {
  useFetchHypercertFractionsByHypercertId,
  useFetchHypercertFractionsByHypercertIds,
} from "@/hooks/useFetchHypercertFractionsByHypercertId";
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
  const { data: fractions } =
    useFetchHypercertFractionsByHypercertIds(claimIds);
  const { data: fractionSpecificData } = useFetchFractionSpecificDisplay(
    claimIds,
    chainId,
  );
  const address = useAddress();
  const fractionsOwnedByAdmin = fractions
    ?.filter((fraction) => fraction.owner === address?.toLowerCase())
    .map((fraction) => ({
      ...fraction,
      value:
        fractionSpecificData?.find((x) => x.fraction_id === fraction.id)
          ?.value || "",
    }));
  const inputRef = useRef<HTMLInputElement>(null);

  const csvHeaders = ["hypercertId", "fractionId", "Units", "githubUsername"];
  const { mutateAsync } = useCreateOrUpdateFractionSpecificMetadata("github");

  const onDownloadTemplateCsv = () => {
    if (!fractionsOwnedByAdmin?.length) {
      console.log("no fractions owned by admin");
      return;
    }
    const csvData = fractionsOwnedByAdmin.map((fraction) => [
      fraction.hypercertId,
      fraction.id,
      fraction.units,
      fraction.value,
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
          values: { githubUsername: row["githubUsername"] },
        })),
      });
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
              <Th>Fraction ID</Th>
              <Th>Units</Th>
              <Th>Percentage</Th>
              <Th>GitHub username</Th>
            </Tr>
          </Thead>
          <Tbody>
            {fractionsOwnedByAdmin?.map((fraction) => (
              <Tr key={fraction.id}>
                <Td>{fraction.tokenID}</Td>
                <Td>{fraction.units}</Td>
                <Td>{fraction.percentage}</Td>
                <Td>{fraction.value}</Td>
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
