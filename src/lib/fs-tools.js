import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const productJSONPath = join(dataFolderPath, "products.json");

export const getProducts = () => readJSON(productJSONPath);
export const writeProducts = (productsArray) =>
  writeJSON(productJSONPath, productsArray);
