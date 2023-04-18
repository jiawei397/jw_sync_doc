import { BookNode, TreeKey, TreeObj } from "./types.ts";
import { createMongoId } from "./utils.ts";

export function formatPath(path: string) {
  return path.replaceAll("/", "-").replace(".html", "");
}

export const pathSet = new Set<string>(); // 一本书要保障不能重复
/**
 * 格式化书籍的路径
 * 现在的API文档只有两级结构，还用不到
 */
export function formatBookPath(path: string) {
  const newPath = formatPath(path);
  if (pathSet.has(newPath)) { // 如果已经有了，再处理一遍
    return formatPath(newPath + "1");
  }
  pathSet.add(newPath);
  return newPath;
}

/**
 * 把现在页面的目录转换为书籍需要的结构
 * 目前只有两级
 */
export function transferTreeToBookNodes(
  tree: TreeObj,
  bookId: string,
): BookNode[] {
  const children: BookNode[] = [];
  (["Namespaces", "Classes"] as TreeKey[]).forEach((key) => { // 需要考虑英文的情况
    const id = createMongoId();
    const currentChildren: BookNode[] = [];
    children.push({
      id,
      name: key,
      parentId: bookId,
      children: currentChildren,
    });

    const arr = tree[key];
    arr.forEach((item) => {
      // {
      //   "text": "ActionGroupComponent",
      //   "href": "THING.ActionGroupComponent.html"
      // },
      currentChildren.push({
        id: createMongoId(),
        name: item.text,
        parentId: id,
        showName: formatBookPath(item.href),
        linkId: createMongoId(),
      });
    });
  });

  // 把全局的补上
  children.push({
    id: createMongoId(),
    name: "Global",
    parentId: bookId,
    showName: "global",
    linkId: createMongoId(),
    children: [],
  });
  return children;
}

export function findBlogIdInBook(
  books: BookNode[],
  showName: string,
): string | undefined {
  for (let i = 0; i < books.length; i++) {
    if (books[i].showName === showName) {
      return books[i].linkId;
    }
    if (books[i].children?.length) {
      const find = findBlogIdInBook(books[i].children!, showName);
      if (find) {
        return find;
      }
    }
  }
}
