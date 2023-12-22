import {
  Button,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { formatEther } from "viem";

import { MarketplaceOrderEntity } from "@/types/database-entities";
import { useBuyMakerBid } from "@/hooks/marketplace/useBuyMakerBid";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
} from "@tanstack/table-core";

import { ProfileInfo } from "@/components/profile-info";
import { useState } from "react";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

type OrderTableEntity = MarketplaceOrderEntity & {
  fractionSize: number;
  percentagePrice: bigint;
};

export const AvailableOrders = ({ orders }: { orders: OrderTableEntity[] }) => {
  const { mutateAsync: buyFraction } = useBuyMakerBid();
  const columnHelper = createColumnHelper<OrderTableEntity>();
  const defaultColumns = [
    columnHelper.accessor("signer", {
      cell: (value) => <ProfileInfo address={value.getValue()} />,
      header: "Seller",
    }),
    columnHelper.accessor("fractionSize", {
      cell: (value) => `${value.getValue()}%`,
      header: "Fraction size",
    }),
    columnHelper.accessor("percentagePrice", {
      cell: (value) => `${formatEther(BigInt(value.getValue()))} ETH`,
      header: "Price per 1%",
    }),
    columnHelper.accessor("price", {
      cell: (value) => `${formatEther(BigInt(value.getValue()))} ETH`,
      header: "Fraction price",
    }),
  ];

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns: defaultColumns,
    data: orders,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: (x) => {
      console.log(x);
      setRowSelection(x);
    },
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
  });

  const selectedOrder = table.getRowModel().rows.find((x) => x.getIsSelected())
    ?.original;
  const onClickBuy = async () => {
    if (!selectedOrder) return;
    await buyFraction({ order: selectedOrder });
  };

  return (
    <>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta;
                return (
                  <Th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    isNumeric={meta?.isNumeric}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}

                    <Text as="span" pl="4">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === "desc" ? (
                          <ArrowDownOutlined aria-label="sorted descending" />
                        ) : (
                          <ArrowUpOutlined aria-label="sorted ascending" />
                        )
                      ) : null}
                    </Text>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => {
            const isSelected = row.getIsSelected();
            console.log(isSelected);
            return (
              <Tr
                key={row.id}
                height={"64px"}
                cursor={"pointer"}
                onClick={row.getToggleSelectedHandler()}
                backgroundColor={isSelected ? "black" : undefined}
                color={isSelected ? "white" : undefined}
                _hover={{
                  // border: "1px solid black",
                  borderRadius: "4px",
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const meta: any = cell.column.columnDef.meta;
                  return (
                    <Td
                      key={cell.id}
                      isNumeric={meta?.isNumeric}
                      _first={{ borderLeftRadius: "8px" }}
                      _last={{ borderRightRadius: "8px" }}
                      py={2}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <HStack mt={4} width={"100%"}>
        <Button width={"50%"} variant={"blackAndWhite"} isDisabled>
          Make offer
        </Button>
        <Button
          width={"50%"}
          variant={"blackAndWhite"}
          isDisabled={!selectedOrder}
          onClick={onClickBuy}
        >
          Buy
        </Button>
      </HStack>
    </>
  );
};
