import { useFetchRegistryById } from "@/hooks/useFetchRegistryById";
import { useFetchHypercertFractionsByHypercertId } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import {
  Button,
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
    <>
      {registry.data?.claims?.map((claim) => (
        <DefaultDisplayDataForClainm
          key={claim.id}
          claimId={claim.hypercert_id}
        />
      ))}
    </>
  );
};

const DefaultDisplayDataForClainm = ({ claimId }: { claimId: string }) => {
  const { data: fractions } = useFetchHypercertFractionsByHypercertId(claimId);
  const address = useAddress();
  const fractionsOwnedByAdmin = fractions?.filter(
    (fraction) => fraction.owner === address?.toLowerCase(),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const csvHeaders = ["Fraction ID", "Units", "GitHub username"];

  const onDownloadTemplateCsv = () => {
    if (!fractionsOwnedByAdmin?.length) {
      console.log("no fractions owned by admin");
      return;
    }
    const csvData = fractionsOwnedByAdmin.map((fraction) => [
      fraction.id,
      fraction.units,
      "",
    ]);
    const csv = arrayToCsv(csvHeaders, csvData);
    downloadBlob(csv, `${claimId}-fractions-template.csv`, `text/csv`);
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
      const parsedCSV = parseCsv(csv as string, ";");
      console.log(parsedCSV);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <TableContainer width={"100%"}>
        <Table variant={"striped"} colorScheme="blue" size={"sm"}>
          <TableCaption placement={"top"}>
            <Button colorScheme="blue" onClick={onDownloadTemplateCsv}>
              Download template CSV
            </Button>
            <Button onClick={onClickFileUpload}>Upload complete CSV</Button>
            <input
              ref={inputRef}
              type="file"
              style={{ display: "none" }}
              onChange={onCsvUpload}
            />
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Fraction ID</Th>
              <Th>Units</Th>
              <Th>GitHub username</Th>
            </Tr>
          </Thead>
          <Tbody>
            {fractionsOwnedByAdmin?.map((fraction) => (
              <Tr key={fraction.id}>
                <Td>{fraction.id}</Td>
                <Td>{fraction.units}</Td>
                <Td>N/A</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
