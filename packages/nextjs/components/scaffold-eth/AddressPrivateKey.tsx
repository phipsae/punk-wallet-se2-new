import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

type TAddressProps = {
  address?: string;
  disableAddressLink?: boolean;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
};

export const AddressPrivateKey = ({ address, disableAddressLink, format, size = "base" }: TAddressProps) => {
  const [addressCopied, setAddressCopied] = useState(false);

  let displayAddress = address?.slice(0, 5) + "..." + address?.slice(-4);

  if (format === "long" && address) {
    displayAddress = address;
  }

  return (
    <>
      <div className="flex items-center">
        {disableAddressLink ? (
          <span className={`ml-1.5 text-${size} font-normal`}>{displayAddress}</span>
        ) : (
          <div className="ml-1.5 font-normal">{displayAddress}</div>
        )}
        {addressCopied ? (
          <CheckCircleIcon
            className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
            aria-hidden="true"
          />
        ) : (
          address && (
            <CopyToClipboard
              text={address}
              onCopy={() => {
                setAddressCopied(true);
                setTimeout(() => {
                  setAddressCopied(false);
                }, 800);
              }}
            >
              <DocumentDuplicateIcon
                className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
                aria-hidden="true"
              />
            </CopyToClipboard>
          )
        )}
      </div>
    </>
  );
};
