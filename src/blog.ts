import { findBlogIdInBook } from "./book.ts";
import globals from "./globals.ts";
import { Blog, BookNode, OpenStatus } from "./types.ts";
import { transferHtmlToMarkdown } from "./utils.ts";

function findBlogPaths(
  bookNodes: BookNode[],
  filePaths: { path: string; showName: string }[] = [],
) {
  bookNodes.forEach((node) => {
    if (node.showName) {
      filePaths.push({
        path: node.showName + ".html",
        showName: node.showName,
      }); // TODO: 多级时需要处理showName
    } else if (node.children) {
      findBlogPaths(node.children, filePaths);
    }
  });
  return filePaths;
}

export function getAllBlogs(bookNodes: BookNode[]): Promise<Blog[]> {
  const filePaths = findBlogPaths(bookNodes);
  return Promise.all(filePaths.map(async ({ path, showName }) => {
    const markdown = await transferHtmlToMarkdown(
      globals.jsDocDir + "/" + path,
    );
    const id = findBlogIdInBook(bookNodes, showName);
    if (!id) {
      throw new Error("没有找到对应的id: " + id);
    }
    // await Deno.writeTextFile(
    //   `public/${path.replace(".html", "")}.md`,
    //   markdown,
    // );
    return {
      id,
      title: showName,
      mdContent: markdown,
      userId: globals.userId,
      status: OpenStatus.private,
      // checkStatus: CheckStatus.wait,
      group: globals.group,
      tags: globals.tags,
    };
  }));
}
