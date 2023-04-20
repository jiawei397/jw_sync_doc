import { Bson, load, TurndownService } from "../deps.ts";
import { TreeNode, TreeObj } from "./types.ts";

const turndownService = new TurndownService();
turndownService.keep(["table"]);

export function removeSourceLinesFromMarkdown(markdown: string) {
  const lines = markdown.split("\n");
  let deleteMode = false;

  const filteredLines = lines.filter((line) => {
    // 如果上一行是 Source: 行，则删除这一行
    if (deleteMode) {
      deleteMode = false;
      return false;
    }

    // 如果这一行是 Source: 行，则下一行将是 line 行，因此需要将两行都删除
    if (line.startsWith("Source:")) {
      deleteMode = true;
      return false;
    }

    // 如果这一行是 line 行，则删除它
    if (line.includes("line")) {
      return false;
    }

    // 不需要删除该行
    return true;
  });

  return filteredLines.join("\n");
}

export async function transferHtmlToMarkdown(htmlPath: string) {
  const html = await Deno.readTextFile(htmlPath);
  const $ = load(html);
  const str = $("article").html();
  const markdown = turndownService.turndown(str);
  return removeSourceLinesFromMarkdown(markdown);
}

export function getTree(html: string): TreeObj {
  const $ = load(html);
  const tree: Record<string, TreeNode[]> = {};
  $("h3").each((_i, elem) => {
    const key = $(elem).text().trim();
    if (!key) {
      return;
    }
    const arr: TreeNode[] = [];

    $(elem).nextUntil("h3", "ul").find("a").each((_j, anchor) => {
      const text = $(anchor).text().trim();
      const href = $(anchor).attr("href") || "";
      arr.push({ text, href });
    });

    tree[key] = arr;
  });

  // Deno.writeTextFile("aa.json", JSON.stringify(tree, null, 2));
  const arr = Object.values(tree);
  // 之所以这么搞，是因为jsoc可能会输出中英文两种格式
  return {
    Namespaces: arr[0],
    Classes: arr[1],
    Global: arr[2],
  };
}

export function createMongoId() {
  return new Bson.ObjectId().toHexString();
}
