import Express from "express";
import {
  getProducts,
  getReviews,
  saveProductsImage,
  writeProducts,
  writeReviews,
} from "../../lib/fs-tools.js";
import {
  checkProductsSchema,
  checkReviewSchema,
  checkproductUpdateSchema,
  triggerBadRequest,
} from "./validation.js";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import multer from "multer";
import { extname } from "path";

const productsRouter = Express.Router();

productsRouter.post(
  "/",
  checkProductsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const { name, description, brand, price, category, imageUrl } = req.body;
      const newProduct = {
        name,
        description,
        brand,
        price,
        category,
        imageUrl,
        _id: uniqid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const productArray = await getProducts();
      productArray.push(newProduct);
      await writeProducts(productArray);
      res.status(201).send(productArray);
    } catch (error) {
      next(error);
    }
  }
);
productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts();
    res.send(products);
  } catch (error) {
    next(createHttpError(500, `Server side error`));
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const productArray = await getProducts();
    const foundProduct = productArray.find(
      (product) => product._id === req.params.id
    );
    if (foundProduct) {
      res.send(foundProduct);
    } else {
      // the product has not been found, I'd like to trigger a 404 error
      next(createHttpError(404, `Product with id ${req.params.id} not found!`)); // this jumps to the error handlers
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.put(
  "/:id",
  checkproductUpdateSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const productArray = await getProducts();
      const index = productArray.findIndex(
        (product) => product._id === req.params.id
      );
      if (index !== -1) {
        const oldProduct = productArray[index];
        const updatedProduct = {
          ...oldProduct,
          ...req.body,
          updatedAt: new Date(),
        };
        productArray[index] = updatedProduct;
        await writeProducts(productArray);
        res.send(updatedProduct);
      } else {
        next(
          createHttpError(404, `Product with id ${req.params.id} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const productArray = await getProducts();
    const remainingProducts = productArray.filter(
      (product) => product._id !== req.params.id
    );
    if (productArray.length !== remainingProducts.length) {
      await writeProducts(remainingProducts);
      res.status(204).send("Product deleted");
    } else {
      next(createHttpError(404, `Product with id ${req.params.id} not found!`)); //
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post(
  "/:id/upload",
  multer().single("imageUrl"),
  async (req, res, next) => {
    try {
      console.log("FILE:", req.file);
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.id + originalFileExtension;
      await saveProductsImage(fileName, req.file.buffer);
      const productArray = await getProducts();
      const index = productArray.findIndex(
        (product) => product._id === req.params.id
      );
      if (index !== -1) {
        const oldProduct = productArray[index];
        const updatedProduct = {
          ...oldProduct,
          ...req.body,
          imageUrl: `http://localhost:3001/img/products/${fileName}`,
          updatedAt: new Date(),
        };
        productArray[index] = updatedProduct;
        await writeProducts(productArray);
        res.send({ message: "file uploaded" });
      }
    } catch (error) {
      next(error);
    }
  }
);

// review of product

productsRouter.post(
  "/:id/reviews",
  checkReviewSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const productArray = await getProducts();
      const index = productArray.findIndex(
        (product) => product._id === req.params.id
      );
      if (index !== -1) {
        const { comment, rate } = req.body;
        const newReview = {
          comment,
          rate,
          productId: req.params.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const reviews = await getReviews();
        reviews.push(newReview);
        await writeReviews(reviews);
        res.status(201).send(reviews);
      } else {
        next(createHttpError(404, `no product found with id ${req.params.id}`));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default productsRouter;
