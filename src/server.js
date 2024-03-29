import Express from "express"; // NEW IMPORT SYNTAX (We can use it only if we add "type": "module", to package.json)
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
  genericErrorHandler,
  badRequestHandler,
  unauthorizedHandler,
  notfoundHandler,
} from "./errorsHandlers.js";
// import productsRouter from "./api/products/index.js";
import { join } from "path";
import productRouter from "./api/products/productIndex.js";
import mongoose from "mongoose";

const server = Express();
const port = 3001;
const publicFolderPath = join(process.cwd(), "./public");

const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method ${req.method} -- url ${req.url} -- ${new Date()}`
  );
  req.user = "Hardika";
  next();
};

server.use(Express.static(publicFolderPath));
server.use(cors());
server.use(loggerMiddleware);
server.use(Express.json());

// ************************** ENDPOINTS ***********************
// server.use("/products", productsRouter);
server.use("/products", productRouter);

server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(notfoundHandler); // 404
server.use(genericErrorHandler); // 500 (this should ALWAYS be the last one)

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("✅ Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`✅ Server is running on port ${port}`);
  });
});
