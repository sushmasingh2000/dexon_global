import CryptoJS from "crypto-js";

export const deCryptData = (data) => {
  const value =
    (data &&
      CryptoJS.AES.decrypt(
        data,
        "sdhfjshfewuifajksldfhasuilfhasfbasjklfhasjdfnasjkfhlkasjfhdsajklfhasjfhfhaskjlf",
      )?.toString(CryptoJS.enc.Utf8)) ||
    null;
  return value && JSON.parse(value);
};
export const enCryptData = (data) => {
  const value =
    data &&
    CryptoJS.AES.encrypt(
      JSON.stringify(data),
      "sdhfjshfewuifajksldfhasuilfhasfbasjklfhasjdfnasjkfhlkasjfhdsajklfhasjfhfhaskjlf",
    )?.toString();
  return value;
};
