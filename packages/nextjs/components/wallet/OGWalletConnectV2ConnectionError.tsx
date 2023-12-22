export default function WalletConnectV2ConnectionError(error: any, proposer: any) {
  const proposerName = proposer?.metadata?.name;
  const title = "Coudn't connect to " + (proposerName ? proposerName : "the Dapp") + "!";
  console.log(title);
  return title;
}
