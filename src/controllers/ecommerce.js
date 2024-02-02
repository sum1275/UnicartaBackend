const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { log } = require("console");

const usersFilePath = path.join(__dirname, "..", "db", "users.json");

const generateCouponCode = (email, carts) => {
  if (carts.flat().length % 4 === 0) {
    console.log(`Generating coupon code for user ${email}`);
    // Generate a new coupon code
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let newCouponCode = "";

    for (let i = 0; i < 5; i++) {
      if (i < 2) {
        // Add two random characters
        newCouponCode += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      } else {
        // Add three random numbers
        newCouponCode += numbers.charAt(
          Math.floor(Math.random() * numbers.length)
        );
      }
    }

    // Return the new coupon code and status object
    return { code: newCouponCode, status: false };
  }
};

const checkOut = async (req, res) => {
  const { email, cartdata } = req.body;

  try {
    let usersData = [];

    if (fs.existsSync(usersFilePath)) {
      const usersFileContent = fs.readFileSync(usersFilePath, "utf8");
      if (usersFileContent.trim() !== "") {
        usersData = JSON.parse(usersFileContent);
      }
    }

    let userIndex = usersData.findIndex((user) => user._id === email);

    if (userIndex !== -1) {
      // User exists
      if (!usersData[userIndex].cart) {
        // Initialize cart as an empty array if it doesn't exist
        usersData[userIndex].cart = [];
      }

      // Push current cartdata to existing carts
      usersData[userIndex].cart.push(cartdata);

      // Flatten all carts for this user including current cartdata
      let allCarts = usersData[userIndex].cart;

      // Generate coupon code if needed
      let newCouponCode = await generateCouponCode(email, allCarts);

      usersData[userIndex].coupon_codes.push(newCouponCode);
    } else {
      // New user, create new userData object with initialized cart
      const userData = { _id: email, cart: [cartdata], coupon_codes: [] };
      usersData.push(userData);
    }

    fs.writeFileSync(usersFilePath, JSON.stringify(usersData));

    res.status(200).json({ message: "Checkout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during checkout", error: error.message });
  }
};



const validateCoupon = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Detailed logging
    const couponCode = req.body.couponCode;

    if (!couponCode || couponCode.trim() === "") {
      return res
        .status(200)
        .json({ valid: false, message: "Coupon is not valid" });
    }

    const usersFileContent = fs.readFileSync(usersFilePath, "utf8");
    let userData;
    try {
      userData = JSON.parse(usersFileContent);
    } catch (parseError) {
      console.error("Error parsing user data:", parseError);
      return res
        .status(500)
        .json({
          message: "Error parsing user data",
          error: parseError.message,
        });
    }

    const userWithValidCoupon = userData.find(
      (user) =>
        user.coupon_codes.length > 1 &&
        user.coupon_codes.some(
          (coupon) => coupon?.code === couponCode && !coupon?.status
        )
    );

    if (userWithValidCoupon) {
      return res.status(200).json({ valid: true, message: "Coupon is valid" });
    } else {
      return res
        .status(200)
        .json({ valid: false, message: "Coupon is not valid" });
    }
  } catch (error) {
    console.error("Error in validateCoupon function:", error);
    return res
      .status(500)
      .json({ message: "Error validating coupon", error: error.message });
  }
};

const fetchData = async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

module.exports = { fetchData, checkOut, validateCoupon };
