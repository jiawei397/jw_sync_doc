import { loadEnv } from "../deps.ts";

export interface Config {
  baseURL: string; // 哪个环境
  bookId: string; // 书籍的id
  jsDocDir: string; // js文档html文件的目录，如果是根目录，则是./
  authorization: string; // 授权的token，下文会说
  userAgent: string; // 与授权token结合使用，下文会说
  tags?: string[]; // 标签，默认为空
  group?: string; // 文章的组，默认是书籍所在组
  userId?: string; // 是否要转移作者
  version?: string; // 新建版本
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
  jsDocDir: "./",
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
