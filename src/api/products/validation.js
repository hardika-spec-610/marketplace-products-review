import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const productSchema = {
  name: {
    in: ["body"],
    notEmpty: true,
    trim: true,
    isString: {
      errorMessage: "name is a mandatory field and needs to be a string!",
    },
  },
  description: {
    in: ["body"],
    notEmpty: true,
    trim: true,
    isString: {
      errorMessage:
        "description is a mandatory field and needs to be a string!",
    },
  },
  brand: {
    in: ["body"],
    notEmpty: true,
    trim: true,
    isString: {
      errorMessage: "brand is a mandatory field and needs to be a string!",
    },
  },
  price: {
    in: ["body"],
    notEmpty: true,
    trim: true,
    isInt: {
      errorMessage: "price is a mandatory field and needs to be a number!",
    },
  },
  category: {
    in: ["body"],
    notEmpty: true,
    trim: true,
    isString: {
      errorMessage: "category is a mandatory field and needs to be a string!",
    },
  },
  imageUrl: {
    in: ["body"],
    notEmpty: true,
    trim: true,
    isURL: {
      errorMessage: "imageUrl is a mandatory field",
    },
  },
};

const productUpdateSchema = {
  name: {
    in: ["body"],
    optional: true, // to make the rule optional
    trim: true, //remove any leading or trailing whitespace from the parameter before validation
    notEmpty: true, //parameter is not blank if it is present
    isString: {
      errorMessage: "name is a mandatory field and needs to be a string!",
    },
  },
  description: {
    in: ["body"],
    optional: true,
    trim: true,
    notEmpty: true,
    isString: {
      errorMessage:
        "description is a mandatory field and needs to be a string!",
    },
  },
  brand: {
    in: ["body"],
    optional: true,
    trim: true,
    notEmpty: true,
    isString: {
      errorMessage: "brand is a mandatory field and needs to be a string!",
    },
  },
  price: {
    in: ["body"],
    optional: true,
    trim: true,
    notEmpty: true,
    isInt: {
      errorMessage: "price is a mandatory field and needs to be a number!",
    },
  },
  category: {
    in: ["body"],
    optional: true,
    trim: true,
    notEmpty: true,
    isString: {
      errorMessage: "category is a mandatory field and needs to be a string!",
    },
  },
  imageUrl: {
    in: ["body"],
    optional: true,
    notEmpty: true,
    isURL: {
      errorMessage: "imageUrl is a mandatory field",
    },
  },
};

const reviewSchema = {
  comment: {
    in: ["body"],
    notEmpty: true,
    isString: {
      errorMessage: "comment must be String",
    },
  },
  rate: {
    in: ["body"],
    notEmpty: true,
    isFloat: {
      options: { max: 5 },
    },
    isIn: {
      options: [[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]],
      errorMessage: "Rating must be in the range of 0 to 5",
    },
  },
};
const reviewUpdateSchema = {
  comment: {
    in: ["body"],
    optional: true,
    trim: true,
    notEmpty: true,
    isString: {
      errorMessage: "comment must be String",
    },
  },
  rate: {
    in: ["body"],
    optional: true,
    trim: true,
    notEmpty: true,
    isFloat: {
      options: { max: 5 },
    },
    isIn: {
      options: [[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]],
      errorMessage: "Rating must be in the range of 0 to 5",
    },
  },
};

export const checkProductsSchema = checkSchema(productSchema);
export const checkproductUpdateSchema = checkSchema(productUpdateSchema);
export const checkReviewSchema = checkSchema(reviewSchema);
export const checkReviewUpdateSchema = checkSchema(reviewUpdateSchema);

export const triggerBadRequest = (req, res, next) => {
  // 1. Check if checkBooksSchema has found any error in req.body
  const errors = validationResult(req);
  console.log(errors.array());
  if (errors.isEmpty()) {
    // 2.1 If we don't have errors --> normal flow (next)
    next();
  } else {
    // 2.2 If we have any error --> trigger 400
    next(
      createHttpError(400, "Errors during product validation", {
        errorsList: errors.array(), // if check for error write errorsList: errors(o/p:err.errorsList.map is not a function)
      })
    );
  }
};
