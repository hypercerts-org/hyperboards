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
import { PropsWithChildren, useState } from "react";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { StrategyType } from "@hypercerts-org/marketplace-sdk";
import { BuyFractionalOrderForm } from "@/components/marketplace/buy-fractional-order-form";
import { formatStrategyType } from "@/utils/formatting";

type OrderTableEntity = MarketplaceOrderEntity & {
  fractionSize: number;
  percentagePrice: bigint;
};

const HeaderText = ({ children }: PropsWithChildren) => (
  <Text
    mb={0}
    textStyle={"primary"}
    as={"span"}
    fontWeight={500}
    textTransform={"none"}
    opacity={0.6}
    fontSize={"sm"}
  >
    {children}
  </Text>
);

export const AvailableOrders = ({
  orders,
  onBuyConfirmed,
}: {
  orders: OrderTableEntity[];
  onBuyConfirmed: (fractionId: string) => void;
}) => {
  const { mutateAsync: buyFraction } = useBuyMakerBid();
  const columnHelper = createColumnHelper<OrderTableEntity>();
  const defaultColumns = [
    columnHelper.accessor("signer", {
      header: () => <HeaderText>Seller</HeaderText>,
      cell: (value) => <ProfileInfo address={value.getValue()} />,
    }),
    columnHelper.accessor("strategyId", {
      header: () => <HeaderText>Type</HeaderText>,
      cell: (value) => formatStrategyType(value.getValue()),
    }),
    // columnHelper.accessor("fractionSize", {
    //   header: () => <HeaderText>Fraction size</HeaderText>,
    //   cell: (value) => `${value.getValue()}%`,
    // }),
    columnHelper.accessor("percentagePrice", {
      header: () => <HeaderText>Price per 1%</HeaderText>,
      cell: (value) => (
        <Text>
          {formatEther(BigInt(value.getValue()))}{" "}
          <Text opacity={0.5} as={"span"}>
            ETH
          </Text>
        </Text>
      ),
    }),
    // columnHelper.accessor("price", {
    //   header: () => <HeaderText>Fraction price</HeaderText>,
    //   cell: (value) => (
    //     <Text>
    //       {formatEther(BigInt(value.getValue()))}{" "}
    //       <Text opacity={0.5} as={"span"}>
    //         ETH
    //       </Text>
    //     </Text>
    //   ),
    // }),
  ];

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns: defaultColumns,
    data: orders,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
  });

  const [step, setStep] = useState<"table" | "fractional-order-form">("table");

  const selectedOrder = table.getRowModel().rows.find((x) => x.getIsSelected())
    ?.original;

  const onClickBuy = async () => {
    if (!selectedOrder) return;

    if (selectedOrder.strategyId === StrategyType.hypercertFractionOffer) {
      setStep("fractional-order-form");
    } else {
      await buyFraction({ order: selectedOrder });
      onBuyConfirmed(selectedOrder.itemIds[0]);
    }
  };

  return (
    <>
      {step === "table" && (
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
                        textStyle={"primary"}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        <Text as="span" pl="2">
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "desc" ? (
                              <ArrowDownOutlined
                                style={{ opacity: 0.5 }}
                                aria-label="sorted descending"
                              />
                            ) : (
                              <ArrowUpOutlined
                                style={{ opacity: 0.5 }}
                                aria-label="sorted ascending"
                              />
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
      )}
      {step === "fractional-order-form" && selectedOrder && (
        <BuyFractionalOrderForm
          order={selectedOrder}
          onCompleted={() => onBuyConfirmed(selectedOrder?.itemIds[0])}
        />
      )}
    </>
  );
};
