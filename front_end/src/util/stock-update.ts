import { DEFAULT_HEADERS } from "./constants";

export const upload = (value: any, token: string) => {
  const body = JSON.stringify(value);
  const headers = { Authorization: "Barer " + token, ...DEFAULT_HEADERS };

  return { body, headers };
};

export const uploadWImage = (formData: FormData, token: string) => {
  const body = formData;
  const headers = { Authorization: "Barer " + token };

  return { body, headers };
};
