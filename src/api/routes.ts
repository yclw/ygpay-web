import { http } from "@/utils/http";
// import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  // return http.request<Result>("get", baseUrlApi("user/menu"));
  return http.request<Result>("get", "/user/menu");
};
