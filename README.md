
# Unicarta Backend
UnicartaBackend is a backend service for a unicarta e-commerce site. 
## Installation
To install UnstopBackend, follow these steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/sum1275/UnicartaBackend.git

## Database and Server Configuration for Development Environment

To set up the project in your local environment, configure the `.env` file as follows:

1. Create a file named `.env` in the root directory of the project.
2. Add the following content to the `.env` file:

   ```plaintext
   # Environment variables for development
  
   DEV_PORT=8084
   NODE_ENV=development

The application provides the following endpoints:
   ## API Endpoints
- **Validate Coupon Code**:
  This feature checks the validity of a coupon code.

  - **Method**: `POST`
  - **Endpoint**: `http://localhost:8084/validateCoupon`
  - **Request Body**:
    ```json
    {
      "couponCode": "CY538"
    }
    ```
  - **Response Sample**:
    ```json
    {
      "valid": true,
      "message": "Coupon is valid"
    }
    ```
  This API endpoint allows you to verify if a coupon code is valid or not. The response will indicate the validity of the coupon along with an appropriate message.


- **Retrieve User Details**:
  This feature provides detailed information about a user.

  - **Method**: `POST`
  - **Endpoint**: `http://localhost:8084/userDetails`
  - **Request Body**:
    ```json
    {
      "email": "sumitsinha215@gmail.com"
    }
    ```
  - **Response Sample**:
    ```json
    {
      "_id": "sumitsinha215@gmail.com",
      "itemsPurchased": 8,
      "totalPurchaseAmount": 307.76000000000005,
      "discountCodes": [
        "CY538"
      ],
      "totalDiscountAmount": 10
    }
    ```
  This API endpoint provides a user's details such as their ID, items purchased, total purchase amount, list of discount codes, and total discount amount.

## Future Enhancements

### Attach a Database

- **Setup a Proper NoSQL Database**: 
  For future improvements, the aim is to integrate a proper NoSQL database to enhance the efficiency and speed of query operations. This will facilitate faster access to data and improve the overall performance of the application.


## Contributing

Contributions to Unicarta Backend are welcome. 





   

