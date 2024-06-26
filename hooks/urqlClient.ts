import { cacheExchange, Client, fetchExchange } from "@urql/core";
import { CONSTANTS } from "@hypercerts-org/sdk";

export const urqlClient = new Client({
  url: `${CONSTANTS.ENDPOINTS["test"]}/v1/graphql`,
  exchanges: [cacheExchange, fetchExchange],
});
