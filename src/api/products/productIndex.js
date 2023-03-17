import Express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import q2m from "query-to-mongo";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import ProductsModel from "./model.js";

const productRouter = Express.Router();

productRouter.post("/", async (req, res, next) => {
  try {
    const product = new ProductsModel(req.body);
    const { _id } = await product.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (req, res, next) => {
  try {
    console.log("req.query", req.query);
    console.log("q2m", q2m(req.query));
    const mongoQuery = q2m(req.query);
    //  price: '>10' should be converted somehow into price: {$gt: 10}
    const products = await ProductsModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    )
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort)
      .populate({ path: "reviews", select: "comment rate" });
    const total = await ProductsModel.countDocuments(mongoQuery.criteria);
    // no matter the order of usage of these methods, Mongo will ALWAYS apply SORT then SKIP then LIMIT
    res.send({
      links: mongoQuery.links(process.env.LOCAL_URL + "/products", total),
      total,
      numberOfPages: Math.ceil(total / mongoQuery.options.limit),
      products,
    });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:id", async (req, res, next) => {
  try {
    const products = await ProductsModel.findById(req.params.id).populate({
      path: "reviews",
      select: "comment rate",
    });
    if (products) {
      res.send(products);
    } else {
      next(createHttpError(404, `Product with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

productRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.id, // WHO
      req.body, // HOW
      { new: true, runValidators: true } // OPTIONS. By default findByIdAndUpdate returns the record pre-modification. If you want to get the newly updated one you shall use new: true
      // By default validation is off in the findByIdAndUpdate --> runValidators: true
    );
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(createHttpError(404, `Product with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

productRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedProduct = await ProductsModel.findByIdAndDelete(req.params.id);
    if (deletedProduct) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Product with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default productRouter;
