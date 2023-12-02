interface ShowPrivateKeyProps {
  address: string;
}

export const ShowPrivateKey = ({ address }: ShowPrivateKeyProps) => {
  console.log(address);
  return (
    <>
      {/* <div className="py-4">
        <button
          className="btn btn-error h-[2.2rem] min-h-[2.2rem] w-full mt-3"
          onClick={() => {
            togglePrivateKey();
          }}
        >
          {showPrivateKey ? "Hide private key" : "Reveal private key"}
        </button>
        {showPrivateKey && (
          <div className="flex flex-row justify-center mt-5">
            Private Key:
            <AddressPrivateKey address={revealedPrivateKey} />
          </div>
        )}
        <div className="flex flex-row items-start gap-5">
          <div>
            <ExclamationTriangleIcon className="h-20 w-20 text-start" />
          </div>
          <div>
            <span className="font-bold">
              Warning: Never disclose your private key. Anyone with your private keys can steal any assets held in your
              account.
            </span>
          </div>
        </div>
      </div> */}
    </>
  );
};
