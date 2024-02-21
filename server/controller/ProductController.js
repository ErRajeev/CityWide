import Product from "../model/productModelGet.js";

export const getAllProducts = async (req, res) => {
  try {
    const data = await Product.find();
    if (!data) {
      res.status(404).json({ error: "Data is not there" });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};