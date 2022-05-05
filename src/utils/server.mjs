import path from "path";
import express from "express";

async function main({ staticPath, staticRoute = null, port = 3000 }) {
  const DEFAULT_PORT = 3000;

  if (!staticRoute) {
    console.log("dirname: ", path.dirname(staticPath));
    console.log("basename: ", path.basename(staticPath));

    staticRoute = `/${path.basename(staticPath)}`;
  }

  express()
    .get("/", (req, res) => {
      res.send("ccvb");
    })
    .use(staticRoute, express.static(staticPath))
    .listen(port || DEFAULT_PORT);
}

main({ staticPath: "W:/CPS/MyProject/markdown-image/image" });
