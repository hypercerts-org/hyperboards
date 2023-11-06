import { ConnectButton as ConnectButtonInternal } from "@rainbow-me/rainbowkit";
import { Button, ButtonProps } from "@chakra-ui/react";

export const ConnectButton = ({ ...buttonProps }: ButtonProps) => {
  return (
    <ConnectButtonInternal.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    {...buttonProps}
                    variant={"blackAndWhite"}
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    {...buttonProps}
                    variant={"blackAndWhite"}
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <Button
                    {...buttonProps}
                    variant={"blackAndWhite"}
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>

                  <Button
                    {...buttonProps}
                    onClick={openAccountModal}
                    type="button"
                    variant={"blackAndWhite"}
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButtonInternal.Custom>
  );
};
