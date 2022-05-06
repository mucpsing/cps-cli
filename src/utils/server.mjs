import path from "path";
import express from "express";

export const serverStart = async ({ staticPath, port = 3000 }) => {
  const staticRoute = `/${path.basename(staticPath)}`;
  // console.log("staticRoute: ", staticRoute);
  // console.log("staticPath: ", staticPath);
  express()
    .get("/", (req, res) => {
      res.send("ccvb");
    })
    .use(staticRoute, express.static(staticPath))
    .listen(port);
};

// serverStart({ staticPath: "W:/CPS/MyProject/markdown-image/image" });

export default serverStart;
