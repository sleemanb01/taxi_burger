import { IStock } from "../types/interfaces";
import { DEFAULT_HEADERS } from "./constants";

export const stockPatchInfoWithoutImage = (
  stock: Partial<IStock>,
  token: string
) => {
  const body = JSON.stringify(stock);
  const headers = { Authorization: "Barer " + token, ...DEFAULT_HEADERS };

  return { body, headers };
};

export const stockPatchInfo = (formData: FormData, token: string) => {
  const body = formData;
  const headers = { Authorization: "Barer " + token };

  return { body, headers };
};
