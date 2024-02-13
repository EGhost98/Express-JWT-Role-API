# Express JWT Role Based API

## Table of Contents 

- [How to run the API Project](#how-to-run-the-api-project)
- [How to run the Tests](#how-to-run-the-tests)
- [Tech Stack](#tech-stack-used)
- [Implemented Security Features](#implemented-security-features)
- [Middlewares](#middlewares)
- [Model Descriptions](#model-descriptions)
- [API Documentation](#api-documentation)


## How to Run the API Project
To run the project, follow these steps (Prequisite : Have Node.Js Installed):

1. Clone the repository: `git clone <repository_url>`
2. move into local repo folder `cd Express-JWT-Role-API`.
3. Install Dependencies `npm install`.
4. Change Enviroment Variables in .env as required. (Email Credentials for Node Mailer, MongoDB Connection URI, or JWT_SECRET).
5. To Run the server use `npm run dev`.
6. Open Postman and import Collection from `Postman Collection`.

## How to run the Tests

1. Follow Steps from above from 1-6.
2. Open Postman and Run the whole Collection and See the results on Postman Screen.
3. Change Collection Variables in Postman as Required.

## How to Create Admin User

1. Follow Steps from above from 1-4.
2. In the Terminal `npm run create-admin-user {admin_email} {admin_password}`.
3. Chnage Collection Variables in Postman For Admin Credentials If Required.

### Tech Stack Used

- **Programming Language:** `JavaScript`
- **Backend Framework:** `Node.JS`
- **REST Framework:** `Express.JS`
- **Database:** `MongoDB`
- **Test Framework:** `Postman Collection Tests`

### Implemented Security Features:

1. **Helmet Middleware**: The application utilizes the Helmet middleware to set various HTTP headers to enhance security by protecting against common web vulnerabilities such as XSS (Cross-Site Scripting), CSRF (Cross-Site Request Forgery), and others.

2. **Cookie Parser Middleware**: The `cookie-parser` middleware is used to parse cookies attached to incoming requests. This enables handling and manipulation of cookies, which can be used for implementing features like session management and authentication.

3. **CORS (Cross-Origin Resource Sharing) Middleware**: The `cors` middleware is employed to enable Cross-Origin Resource Sharing. It allows controlled access to resources hosted on the server from different origins, thereby preventing unauthorized access.

4. **Logging Middleware**: The custom logging middleware (`loggingMiddleware`) is included to record user activities and security-related events. This middleware can be extended to log various events such as request details, user authentication attempts, and other security-related activities.

### Note:
- The `csurf` middleware for CSRF protection is commented out for local testing. CSRF protection should be enabled in production environments to prevent unauthorized requests originating from malicious websites. Before deploying to production, uncomment the `csurfProtection` middleware and ensure proper configuration.

### Note on Password Reset Email Functionality

![image](https://github.com/EGhost98/Express-JWT-Role-API/assets/76267623/a926f123-e46d-47d8-a376-c14e2c3edfb2)

`server\controllers\passwordResetController.js` - 

The `forgotPassword` function in the authentication controller generates a password reset token and constructs a password reset link for users who have forgotten their passwords. However, the functionality to send password reset emails using Nodemailer has been commented out for local testing purposes. To enable email functionality in a production environment, uncomment the relevant code block responsible for sending emails and configure Nodemailer with valid SMTP credentials, and comment out the below response which is sending the reset link in response.


## Middlewares

### Authenticate

The `Authenticate` middleware function verifies the authenticity of a JWT access token provided in the request headers. It checks if the token exists, if it has been blacklisted, and if it is valid. If the token is valid, it extracts the user information from the token payload and attaches it to the request object for further processing.

### isAdmin

The `isAdmin` middleware function checks if the user attached to the request object has the role of an admin. If the user is not an admin, it returns a 403 Forbidden error, indicating that only admins are allowed to access the requested resource.

### loggingMiddleware

The `loggingMiddleware` function logs information about incoming HTTP requests to a file named `access.log` located in the `logs` directory. It records details such as the request method, URL, IP address, user-agent, and timestamp of each request. This middleware is added to the request-response cycle to provide logging capabilities for monitoring and debugging purposes.

## Model Descriptions

This section provides an overview of the models used in the application.

### User Model

The `User` model represents user data in the system. It contains fields such as email, name, password, and role. The email field is required and unique, ensuring each user has a unique identifier. The role field is an enum with possible values of 'user' or 'admin', with 'user' being the default role assigned to new users.

### TokenBlacklist Model

The `TokenBlacklist` model is used to store invalidated JWT tokens. When a user logs out or their token expires, the token is added to the TokenBlacklist collection to prevent its reuse. The model contains a single field, 'token', which stores the invalidated token. The field is required and unique, ensuring each token is stored only once in the collection.

### PasswordResetToken Model

The `PasswordResetToken` model is responsible for managing password reset tokens. When a user requests a password reset, a token is generated and saved in this collection along with the associated user ID and expiry timestamp. This allows the application to verify and process password reset requests securely. The model contains fields for userId, token, and expiry, ensuring that each token is linked to a specific user and has a limited lifespan.


# API Documentation

## Authentication Endpoints

### 1. Register

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Description:** Create a new user account.
- **Request.Body:**  ``` {
    "email" : a valid email,
    "password" : password } ```

### 2. Login

- **URL:** `/api/auth/login/`
- **Method:** `POST`
- **Description:** Log in to an existing user account and receive an access token and a refresh token.
- **Request.Body:** ```{
    "email" : a valid email,
    "password" : password } ```

### 3. Refresh Token

- **URL:** `/api/auth/refresh/`
- **Method:** `POST`
- **Description:** Refresh the access token.
- **Request.Body:** ```{ "refresh" : refresh token } ```

### 4. Logout

- **URL:** `/api/auth/logout/`
- **Method:** `POST`
- **Description:** Log out and invalidate the refresh token and access token.
- **Request.Headers:** ```{ "Authorization" : Bearer {access token} } ```
- **Request.Body:** ```{ "refresh" : refresh token } ```

## User Endpoints

### 1. Get user Profile

- **URL:** `/api/user/profile`
- **Method:** `GET`
- **Description:** Get user Profile stored in database.
- **Request.Headers:** ```{ "Authorization" : Bearer {access token} } ```

### 2. Update Name of User

- **URL:** `/api/user/profile`
- **Method:** `PATCH`
- **Description:** Update Name Field of User Model.
- **Request.Headers:** ```{ "Authorization" : Bearer {access token} } ```
- **Request.Body:** ```{ "name" : name for user to be updated } ```

### 3. Forgot Password

- **URL:** `/api/user/forgot-password`
- **Method:** `POST`
- **Description:** Send a Password reset Link to User's Email using NodeMailer.
- **Request.Body:** ```{ "email" : user's email } ```

### 4. Reset Password

- **URL:** `/api/notes/reset-password/:userId/:token`
- **Method:** `POST`
- **Description:** Reset User Password by using generated token and userID sent on user;s Mail.
- **Request.Body:** ```{ "password" : new password }

## Admin Endpoints

### 1. Get All Users

- **URL:** `/api/admin/get-all-users`
- **Method:** `GET`
- **Description:** Get all User Model's in Database.
- **Request.Headers:** ```{ "Authorization" : Bearer {access token} } ``` Access Token for admin

### 2. Delete A User Model

- **URL:** `/api/admin/delete-user/:id`
- **Method:** `DELETE`
- **Description:** Delete a Particular User Model from Database.
- **Request.Headers:** ```{ "Authorization" : Bearer {access token} } ``` Access Token for admin
- **Request.Params:** ```{ :id - id of User Model to be deleted }```
