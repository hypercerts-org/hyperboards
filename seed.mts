import { createSeedClient } from "@snaplet/seed";

const seed = await createSeedClient({
  dryRun: false,
});

await seed.$resetDatabase();

const myAddress = "0x59266D85D94666D037C1e32dAa8FaC9E95CdaFEf".toLowerCase();
const sepoliaChainId = 11155111;

await seed.public_users([
  {
    address: myAddress.toLowerCase(),
  },
]);

await seed.hyperboards([
  {
    admin_id: myAddress,
    name: "Seeded board 1",
    tile_border_color: "black",
    background_image: "test.png",
    chain_id: sepoliaChainId,
    hyperboard_registries: () => [
      {
        label: "Seeded label 1",
        registries: () => ({
          name: "Test registry",
          chain_id: sepoliaChainId,
          claims: () => [
            {
              admin_id: myAddress,
              display_size: 1,
              hypercert_id:
                "11155111-0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941-119439110789249400675644487208550642221056",
              owner_id: myAddress,
              chain_id: sepoliaChainId,
            },
          ],
        }),
      },
    ],
  },
]);
