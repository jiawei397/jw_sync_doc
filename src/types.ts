export interface TreeObj {
  // [x: string]: TreeNode[];
  Namespaces: TreeNode[];
  Classes: TreeNode[];
  Global: TreeNode[];
}

export type TreeKey = keyof TreeObj;

export interface TreeNode {
  text: string;
  href: string;
}

export interface BookNode {
  id: string;
  name: string;
  parentId: string; // 方便查找
  showName?: string;
  linkId?: string; // 博客id，如果没有，则是目录
  isDraft?: boolean; // 是否草稿
  children?: BookNode[];
}

export enum OpenStatus {
  private = 0, // 私有
  inner, // 内部
  allUsers, // 全员用户
  everyone, // 任何人
}

//审核状态
export enum CheckStatus {
  wait = 0, // 待审核
  pass, // 审核通过
  reject, // 审核关闭 拒绝
}

export interface Blog {
  id: string;
  title: string;
  mdContent: string;
  userId?: string;
  status?: OpenStatus;
  checkStatus?: CheckStatus;
  group?: string;
  tags?: string[];
}

export interface ImportBookAndCreateBlogsDto {
  bookId: string;

  version?: string;

  children: BookNode[];
  blogs: {
    id: string;
    title: string;
    mdContent: string;
    userId?: string;
    status?: OpenStatus;
    checkStatus?: CheckStatus;
    group?: string;
    tags?: string[];
  }[];
}
