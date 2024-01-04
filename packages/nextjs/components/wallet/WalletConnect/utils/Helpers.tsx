import { hexToString, isAddress, isHex } from "viem";

export function getSignParamsMessage(params: string[]) {
  const message = params.filter(p => !isAddress(p))[0];

  return convertHexToUtf8(message);
}

export function getSignTypedDataParamsData(params: string[]) {
  const data = params.filter(p => !isAddress(p))[0];

  if (typeof data === "string") {
    return JSON.parse(data);
  }
  return data;
}

export function convertHexToUtf8(value: string) {
  if (isHex(value)) {
    return hexToString(value);
  }
  return value;
}
