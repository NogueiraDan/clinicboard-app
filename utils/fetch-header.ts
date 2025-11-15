/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as SecureStore from "expo-secure-store";

export const fetchHeaders = async (): Promise<{ Authorization: string } | {}> => {
  const token = await SecureStore.getItemAsync("auth_token");
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};