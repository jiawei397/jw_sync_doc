import { loadEnv } from "../deps.ts";

export interface Config {
  baseURL: string;
  bookId: string;
  jsDocDir: string;
  authorization: string;
  userAgent: string;
  tags?: string[];
  group?: string;
  userId?: string;
  version?: string;
}

type ConfigKey = keyof Config;

type RequiredKeys =
  | "baseURL"
  | "bookId"
  | "jsDocDir"
  | "authorization"
  | "userAgent";

const config: Config = {
  baseURL: "",
  bookId: "",
  jsDocDir: "",
  authorization: "",
  userAgent: "",
  // 上面的是必需的配置
  userId: undefined, // 可选
  group: undefined,
  tags: [],
  version: undefined, //"1.0.0",
};

loadEnv({ export: true });
Object.keys(config).forEach((key) => {
  const val = Deno.env.get(key);
  if (val) {
    if (key === "tags") {
      config[key] = val.split(",");
    } else {
      config[key as Exclude<ConfigKey, "tags">] = val;
    }
  }
});
const requiredKeys: RequiredKeys[] = [
  "baseURL",
  "bookId",
  "jsDocDir",
  "authorization",
  "userAgent",
];
for (const key of requiredKeys) {
  if (!config[key]) {
    throw new Error(`Missing config value: ${key}`);
  }
}

export default config;
