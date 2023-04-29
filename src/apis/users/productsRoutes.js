import express from "express";
import { Result } from "express-validator";
import ProductsModal from "./productsModel.js";
import httpErrors from "http-errors";

const ProductsRouter = express.Router();


const { NotFound } = httpErrors;

ProductsRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductsModal.find({});
    res.send(products);
  } catch (error) {
    next(error);
  }
});

// GET a product by ID

ProductsRouter.get("/product_details/:id", async (req, res, next) => {
  try {
    const product = await ProductsModal.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      next(NotFound(`Product id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default ProductsRouter;
