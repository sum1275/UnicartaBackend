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
  console.log(req.body);
  const { email, cartdata, priceT, coupan } = req.body;

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
      if (!usersData[userIndex].cart) {
        usersData[userIndex].cart = [];
      }

      usersData[userIndex].cart.push(cartdata);

      let allCarts = usersData[userIndex].cart;

      let newCouponCode = await generateCouponCode(email, allCarts);

      if (!usersData[userIndex].coupon_codes) {
        usersData[userIndex].coupon_codes = [];
      }

      // Check if provided coupon matches any in the array
      for (let i = 0; i < usersData[userIndex].coupon_codes.length; i++) {
        if (usersData[userIndex].coupon_codes[i] && usersData[userIndex].coupon_codes[i].code === coupan) {
          // Update the status of matched coupon to true
          usersData[userIndex].coupon_codes[i].status = true;
        }
      }

      // Update or add priceT and coupan to userData
      usersData[userIndex].priceT = priceT;
      usersData[userIndex].coupan = coupan;
    } else {
      const userData = { _id: email, cart: [cartdata], coupon_codes: [], priceT, coupan };
      usersData.push(userData);
    }

    fs.writeFileSync(usersFilePath, JSON.stringify(usersData));

    res.status(200).json({ message: "Checkout successful" });
  } catch (error) {
    res.status(500).json({ message: "Error during checkout", error: error.message });
  }
};





const validateCoupon = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Detailed logging
    const couponCode = req.body.couponCode;

    if (!couponCode || couponCode.trim() === "") {
      return res.status(200).json({ valid: false, message: "Coupon is not valid" });
    }

    const usersFileContent = fs.readFileSync(usersFilePath, "utf8");
    let userData;
    try {
      userData = JSON.parse(usersFileContent);
    } catch (parseError) {
      console.error("Error parsing user data:", parseError);
      return res.status(500).json({ message: "Error parsing user data", error: parseError.message });
    }

    const userWithValidCoupon = userData.find((user) =>
      user.coupon_codes &&
      user.coupon_codes.some((coupon) =>
        coupon &&
        coupon.code === couponCode &&
        (coupon.status === false || !coupon.status)
      )
    );

    if (userWithValidCoupon) {
      return res.status(200).json({ valid: true, message: "Coupon is valid" });
    } else {
      return res.status(200).json({ valid: false, message: "Coupon is not valid" });
    }
  } catch (error) {
    console.error("Error in validateCoupon function:", error);
    return res.status(500).json({ message: "Error validating coupon", error: error.message });
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


const checkoutDetails = async (req, res) => {
  const userEmail = req.body.email; // Assuming the email is sent in the request body

  try {
    let usersData = [];

    if (fs.existsSync(usersFilePath)) {
      const usersFileContent = fs.readFileSync(usersFilePath, "utf8");
      if (usersFileContent.trim() !== "") {
        usersData = JSON.parse(usersFileContent);
      }
    }

    const user = usersData.find((userData) => userData._id === userEmail);

    if (user) {
      const calculateTotalPurchaseAmount = (cart) => {
        let totalAmount = 0;
        cart.forEach((item) => {
          totalAmount += item.price * item.qty;
        });
        return totalAmount;
      };

      const calculateTotalDiscountAmount = (coupons) => {
        let totalDiscount = 0;
        coupons.forEach((coupon) => {
          if (coupon && coupon.status === true) {
            totalDiscount += 10; // Assuming a fixed discount amount of $10 for each valid coupon
          }
        });
        return totalDiscount;
      };

      const userDetails = {
        _id: user._id,
        itemsPurchased: user.cart.flat().length,
        totalPurchaseAmount: calculateTotalPurchaseAmount(user.cart.flat()),
        discountCodes: user.coupon_codes.filter((coupon) => coupon && coupon.status === true).map((coupon) => coupon.code),
        totalDiscountAmount: calculateTotalDiscountAmount(user.coupon_codes)
      };

      res.status(200).json(userDetails);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching checkout details", error: error.message });
  }
};

module.exports = { fetchData, checkOut, validateCoupon,checkoutDetails };
