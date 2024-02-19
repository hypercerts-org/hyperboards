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
import { arrayToCsv } from "@/utils/csv";

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
    const csvHeaders = ["Fraction ID", "Units", "GitHub username"];
    const csv = arrayToCsv(csvHeaders, csvData);
    downloadBlob(csv, `${claimId}-fractions-template.csv`, `text/csv`);
  };
  return (
    <>
      <TableContainer width={"100%"}>
        <Table variant={"striped"} colorScheme="blue" size={"sm"}>
          <TableCaption placement={"top"}>
            Fractions owned by you for claim {claimId}
            <Button colorScheme="blue" onClick={onDownloadTemplateCsv}>
              Download template CSV
            </Button>
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
