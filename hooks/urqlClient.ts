import { cacheExchange, Client, fetchExchange } from "@urql/core";
import { CONSTANTS } from "@hypercerts-org/sdk";

export const urqlClientTest = new Client({
  url: `${CONSTANTS.ENDPOINTS["test"]}/v1/graphql`,
  exchanges: [cacheExchange, fetchExchange],
});

export const urqlClient = new Client({
  url: `${CONSTANTS.ENDPOINTS["production"]}/v1/graphql`,
  exchanges: [cacheExchange, fetchExchange],
});
