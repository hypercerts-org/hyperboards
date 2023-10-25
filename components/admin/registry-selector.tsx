import AsyncSelect from "react-select/async";
import { supabase } from "@/lib/supabase";

const getRegistryOptions = async (name: string) => {
  return supabase
    .from("registries")
    .select("id, name")
    .ilike("name", `%${name}%`)
    .then(({ data }) => {
      return data?.map(({ id, name }) => ({ value: id, label: name })) || [];
    });
};

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
