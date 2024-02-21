import { instance } from "../index.js";
import crypto from "crypto";
import Purchase from "../model/userPurchaseModel.js";
import Cart from "../model/userCartModel.js";

let user_Id;
let product_Details;

export const checkout = async (req, res) => {
  try {
    const { userId, amount, productDetails } = req.body;
    // console.log(req.body);
    product_Details = productDetails;
    user_Id = userId;
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      // receipt: "order_rcptid_11",
    };

    const order = await instance.orders.create(options);
    // console.log(order);
    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const paymentVarification = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // DataBase
      // console.log(product_Details.allProductCost);
      const purchaseData = {
        userId: user_Id,
        orders: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          allProductCost: product_Details.allProductCost,
          cartProducts: product_Details.cartProducts,
        },
      };

      const purchaseDetails = await Purchase.create(purchaseData);
      await purchaseDetails.save();

      res.redirect(
        `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
      );

      await Cart.deleteMany({ "user.userId": user_Id });
    } else {
      res.status(400).json({
        success: false,
      });
    }
  } catch (error) {
    console.error("Error during payment verification:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};