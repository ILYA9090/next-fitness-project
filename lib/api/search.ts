import { axiosInstance } from "./instance";
import type { SearchResponse } from "./types";
import type { AxiosRequestConfig } from "axios";

export const search = async (
  query: string,
  config?: AxiosRequestConfig,
): Promise<SearchResponse> => {
  const { data } = await axiosInstance.get<SearchResponse>("/search", {
    params: { q: query },
    ...config,
  });
  return data;
};
