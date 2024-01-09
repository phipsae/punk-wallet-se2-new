import { hexToString, isAddress, isHex } from "viem";

export const getSignParamsMessage = (params: string[]) => {
  const message = params.filter(p => !isAddress(p))[0];

  return convertHexToUtf8(message);
};

export const getSignTypedDataParamsData = (params: string[]) => {
  const data = params.filter(p => !isAddress(p))[0];

  if (typeof data === "string") {
    return JSON.parse(data);
  }
  return data;
};

export const convertHexToUtf8 = (value: string) => {
  if (isHex(value)) {
    return hexToString(value);
  }
  return value;
};
