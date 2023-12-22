export default function WalletConnectV2ConnectionError(error: any, proposer: any) {
  const popUp = () => {
    const proposerName = proposer?.metadata?.name;
    const title = "Coudn't connect to " + (proposerName ? proposerName : "the Dapp") + "!";

    console.log("Error Message from", title, error.message);
  };

  return popUp();
}
