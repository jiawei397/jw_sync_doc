import { Ajax } from "../deps.ts";
import globals from "./globals.ts";
import { ImportBookAndCreateBlogsDto } from "./types.ts";

Ajax.defaults.baseURL = globals.baseURL;
const ajax = new Ajax();

ajax.interceptors.request.use(function (mergedConfig) {
  mergedConfig.headers = mergedConfig.headers || {};
  mergedConfig.headers["user-agent"] = globals["user-agent"];
  mergedConfig.headers["authorization"] = globals.authorization;
  return mergedConfig;
}, function (err) {
  return Promise.reject(err);
});

export function importBookAndCreateBlogs(params: ImportBookAndCreateBlogsDto) {
  return ajax.post<string>("/api/book/importBookAndCreateBlogs", params);
}
