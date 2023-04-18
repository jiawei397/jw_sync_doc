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
  const tree: Record<string, TreeNode[]> = {};
  const $ = load(html);
  $("nav > *").each((_i, el) => {
    const $el = $(el);
    const tagName = $el.prop("tagName").toLowerCase();
    const text = $el.text().trim();
    if (tagName === "h3") {
      tree[text] = [];
    } else if (tagName === "ul") {
      const parent = Object.keys(tree)[Object.keys(tree).length - 1];
      tree[parent] = [];
      $el.children().each((_j, li) => {
        const $li = $(li);
        const liText = $li.text().trim();
        const liHref = $li.children("a").attr("href")!;
        tree[parent].push({ text: liText, href: liHref });
      });
    }
  });

  // Deno.writeTextFile("aa.json", JSON.stringify(tree, null, 2));
  return tree as unknown as TreeObj;
}

export function createMongoId() {
  return new Bson.ObjectId().toHexString();
}
