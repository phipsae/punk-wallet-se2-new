import { useCallback, useState } from "react";
import { Address } from "viem";
import { CommonInputProps, InputBase } from "~~/components/scaffold-eth";

/**
 * Address input with ENS name resolution
 */
export const PrivateKeyInput = ({
  value,
  name,
  placeholder,
  onChange,
  disabled,
}: CommonInputProps<Address | string>) => {
  const [error, setError] = useState("");

  const handleChange = useCallback(
    (newValue: Address) => {
      if (newValue && !newValue.startsWith("0x")) {
        setError("Wrong format");
        console.log("Wrong?");
      } else {
        setError("");
      }
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <InputBase<Address>
      name={name}
      placeholder={placeholder}
      error={error !== ""}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      prefix={
        <div className="flex flex-row bg-base-300 rounded-l-full text-xs justify-end items-center w-16 px-2">
          {error !== "" ? <div style={{ color: "red" }}>{error}</div> : <div>Private Key</div>}
        </div>
      }
      suffix={<div className="flex bg-base-300 rounded-l-full items-center"></div>}
    />
  );
};
