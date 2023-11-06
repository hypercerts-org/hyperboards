import AsyncSelect from "react-select/async";
import { supabase } from "@/lib/supabase";
import { useAddress } from "@/hooks/useAddress";
import { Props } from "react-select";
import React, { forwardRef } from "react";

const getRegistryOptions = async (name: string) => {
  return supabase
    .from("registries")
    .select("id, name")
    .ilike("name", `%${name}%`)
    .then(({ data }) => {
      return data?.map(({ id, name }) => ({ value: id, label: name })) || [];
    });
};

const getMyRegistryOptions = async (address: string, name: string) => {
  return supabase
    .from("registries")
    .select("id, name")
    .eq("admin_id", address)
    .ilike("name", `%${name}%`)
    .then(({ data }) => {
      return (
        data?.map(({ id, name }) => ({
          value: id as string,
          label: name as string,
        })) || []
      );
    });
};

export const SingleRegistrySelector = forwardRef(
  function SingleRegistrySelectorRef(
    props: Omit<Props, "ref"> & { onlyMyRegistries?: boolean },
    ref: React.Ref<any>,
  ) {
    const address = useAddress();
    return (
      <AsyncSelect
        {...props}
        ref={ref}
        loadOptions={(name) =>
          props.onlyMyRegistries
            ? getMyRegistryOptions(address || "", name)
            : getRegistryOptions(name)
        }
        defaultOptions
      />
    );
  },
);

export const RegistrySelector = ({
  onChange,
}: {
  onChange: (value: { value: string; label: string }[]) => void;
}) => {
  return (
    <AsyncSelect
      onChange={(e) => onChange([...e])}
      isMulti
      loadOptions={getRegistryOptions}
    />
  );
};
