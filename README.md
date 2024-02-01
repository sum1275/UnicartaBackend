# UnstopBackend
UnstopBackend is a backend service for a seat reservation system. It provides endpoints for managing seat bookings and retrieving seat information.
## Installation
To install UnstopBackend, follow these steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/sum1275/UnstopBackend.git

## Database and Server Configuration for Development Environment

To set up the project in your local environment, configure the `.env` file as follows:

1. Create a file named `.env` in the root directory of the project.
2. Add the following content to the `.env` file:

   ```plaintext
   # Environment variables for development
   DB_DEV_URL=mongodb://localhost:27017/ReserveSpotDB
   DEV_PORT=8084
   NODE_ENV=development

The application provides the following endpoints:
   ## API Endpoints
- **Get All Seats**:
  - **Method**: `GET`
  - **Endpoint**: `http://localhost:8084/allseats`

- **Book a Seat**:
  - **Method**: `POST`
  - **Endpoint**: `http://localhost:8084/bookseat`
  - **Request Body**:
    ```json
    {
      "numberOfSeats": 7
    }
    ```
## Future Enhancements

### Automated Seat Reset

- **Daily Seat Reset Cron Job**: 
  In the future, we plan to implement a cron job within the application that will automatically reset and empty all seat bookings at the end of each day. This feature aims to streamline the seat management process, ensuring that seat availability is refreshed daily, providing a fair and efficient booking experience for all users.

This feature is in the planning stage and will be a key update to further improve the functionality and user experience of the UnstopBackend service.

## Contributing

Contributions to UnstopBackend are welcome. 

