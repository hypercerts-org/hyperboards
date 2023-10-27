import { MintingFormValues } from "@/components/minting/minting-form";
import { MutableRefObject } from "react";

export const HypercertPreview = ({
  values,
  imageRef,
}: {
  imageRef: MutableRefObject<HTMLDivElement | null>;
  values: Partial<MintingFormValues>;
}) => {
  return (
    <div
      ref={imageRef}
      style={{
        width: "320px",
        height: "400px",
        backgroundColor: "#254D32",
        backgroundSize: "cover",
        backgroundRepeat: "repeat-y",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          color: "white",
          fontWeight: "bolder",
          fontSize: "24px",
          margin: "auto 0px 0px 0px",
        }}
      >
        {values?.name ?? "Name of the chapter"}
      </h1>

      <hr
        style={{
          borderColor: "#C2E812",
          borderWidth: "1px",
          width: "100%",
          margin: "5px 0px 12px 0px",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {values.workScope
            ?.split(", ")
            .map((w) => w.trim())
            .map((w) => (
              <span
                key={w}
                style={{
                  color: "#C2E812",
                  borderColor: "#C2E812",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderRadius: "10px",
                  height: "auto",
                  backgroundColor: "transparent",
                  fontSize: "12px",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "center",
                  padding: "3px 10px",
                }}
              >
                {w.toLowerCase()}
              </span>
            ))}
        </div>

        <div
          style={{
            width: "100%",
            justifyContent: "space-between",
            display: "flex",
            fontSize: "14px",
            lineHeight: "14px",
            fontFamily: "Raleway, sans-serif",
            fontWeight: "bolder",
            color: "white",
            marginTop: "12px",
          }}
        >
          <span>Timeframe</span>
          <span>
            {values.workStart?.toLocaleDateString() ?? "Start Date"}
            {" — "}
            {values.workEnd?.toLocaleDateString() ?? "End Date"}
          </span>
        </div>
      </div>

      <hr
        style={{
          borderColor: "#C2E812",
          borderWidth: "1px",
          width: "100%",
          margin: "12px 0px 12px 0px",
        }}
      />

      <div
        style={{
          width: "100%",
          justifyContent: "center",
          display: "flex",
          padding: "5px",
        }}
      ></div>
    </div>
  );
};
