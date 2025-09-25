# manik-server

## Installation:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Rename `.env.example` to `.env`.
4. Run the server using `npm run dev`.

## Configuration:

- Environment Variables:
  - `PORT`: Port number the server listens on. Default: 3000
  - `MONGODB_URI`: URI for MongoDB database.
  - `JWT_SECRET`: Secret key for JWT token generation.
  - `EXPIRES_IN`: Token expiration time.

## Usage:

- API Endpoints:

  - POST `/api/auth/login`

    - Description: Authenticates user and returns a JWT token.
    - Request:
      ```json
      {
        "email": "example@email.com",
        "password": "password"
      }
      ```
    - Response:
      ```json
      {
        "success": true,
        "message": "User registered successfully"
      }
      ```

  - POST `/api/auth/register`
    - Description: Registers a new user.
    - Request:
      ```json
      {
        "name": "John",
        "email": "example@email.com",
        "password": "password"
      }
      ```

## Dependencies:

- `bcrypt`: Library for hashing passwords.
- `cors`: Express middleware for enabling CORS.
- `dotenv`: Loads environment variables from .env file.
- `express`: Web framework for Node.js.
- `jsonwebtoken`: Library for generating and verifying JWT tokens.
- `mongodb`: MongoDB driver for Node.js.
- `nodemon`: Utility for automatically restarting the server during development.
# MitravelBackend
