import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const productJSONPath = join(dataFolderPath, "products.json");
const reviewsJSONPath = join(dataFolderPath, "reviews.json");

const usersPublicFolderProductsPath = join(
  process.cwd(),
  "./public/img/products"
);

export const getProducts = () => readJSON(productJSONPath);
export const writeProducts = (productsArray) =>
  writeJSON(productJSONPath, productsArray);
export const saveProductsImage = (fileName, fileContentAsBuffer) =>
  writeFile(join(usersPublicFolderProductsPath, fileName), fileContentAsBuffer);

export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (productsReviewsArray) =>
  writeJSON(reviewsJSONPath, productsReviewsArray);
