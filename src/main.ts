import { getAllBlogs } from "./blog.ts";
import { transferTreeToBookNodes } from "./book.ts";
import globals from "./globals.ts";
import { importBookAndCreateBlogs } from "./service.ts";
import { getTree } from "./utils.ts";

async function getBookNodes() {
  const html = await Deno.readTextFile(globals.jsDocDir + "/index.html");
  const tree = getTree(html);

  const children = transferTreeToBookNodes(tree, globals.bookId);

  // await Deno.writeTextFile(
  //   "public/books.json",
  //   JSON.stringify(children, null, 2),
  // );
  return children;
}

if (import.meta.main) {
  const nodes = await getBookNodes();
  console.info(`获取书籍节点成功，共有${nodes.length}个节点`);
  const blogs = await getAllBlogs(nodes);
  console.info(`获取文章成功，共有${blogs.length}篇文章`);
  await importBookAndCreateBlogs({
    bookId: globals.bookId,
    version: globals.version,
    blogs,
    children: nodes,
  });
  console.info("success imported!");
}
