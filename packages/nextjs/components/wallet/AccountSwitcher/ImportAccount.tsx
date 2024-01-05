import { useEffect, useState } from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { PrivateKeyInput } from "~~/components/scaffold-eth/Input/PrivateKeyInput";
import { notification } from "~~/utils/scaffold-eth";

interface ImportAccountProps {
  onClose: any;
  privateKeys: string[];
  setSelectedPrivateKey: (selectedPrivateKey: string) => void;
  setPrivateKeys: (privateKeys: string[]) => void;
}

export const ImportAccount = ({ onClose, privateKeys, setPrivateKeys, setSelectedPrivateKey }: ImportAccountProps) => {
  const [privateKey, setPrivateKey] = useState("");
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const generateAccount = (privateKey: string) => {
    try {
      const accountExists = privateKeys.some(pKey => pKey === privateKey);
      if (accountExists) {
        setIsError(true);
        setError("Account already exists");
        return;
      }

      setPrivateKeys([...privateKeys, privateKey]);
      console.log(privateKeys);
      setSelectedPrivateKey(privateKey);
      onClose();
      notification.success("Account succesfully added");
      // return privateKey;
    } catch (error) {
      setIsError(true);
      setError("Wrong format");
    }
  };
  useEffect(() => {
    let timer: any;
    if (isError) {
      // Set a timeout to reset the error state after 5 seconds
      timer = setTimeout(() => {
        setIsError(false);
        setError(""); // Optionally, clear the error message as well
      }, 5000);
    }

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [isError]);

  return (
    <>
      <div>
        <div className="mb-5 text-center">
          <span className="font-bold">Enter your private key to import your account.</span>
        </div>
        <PrivateKeyInput value={privateKey ?? ""} onChange={privateKey => setPrivateKey(privateKey)} />
        <div className="flex flex-row justify-between gap-5 w-full">
          <button
            className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-3 flex-1"
            onClick={() => {
              console.log("Private Key", privateKeys);
            }}
          >
            Print PK
          </button>
          <button
            className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-3 flex-1"
            onClick={() => {
              generateAccount(privateKey);
              console.log("Private Key", privateKey);
            }}
          >
            Import account
          </button>
          <button
            className="btn btn-neutral h-[2.2rem] min-h-[2.2rem] mt-3 flex-2"
            onClick={() => {
              onClose();
            }}
          >
            <ArrowUturnLeftIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="py-4">
          <div className="flex flex-row items-start gap-5 mt-5">
            <div>
              <ExclamationTriangleIcon className="h-20 w-20 text-start" />
            </div>
            <div>
              <span className="font-bold">
                Warning: Never disclose your private key. Anyone with your private keys can steal any assets held in
                your account.
              </span>
            </div>
          </div>
        </div>
      </div>
      {isError && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! {error}</span>
        </div>
      )}
    </>
  );
};
