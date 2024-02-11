# Express JWT Role Based API

## Table of Contents 

- [How to run the API Project](#how-to-run-the-api-project)
- [How to run the Tests](#how-to-run-the-tests)
- [Tech Stack](#tech-stack-used)
- [API Documentation](#api-documentation)


## How to Run the API Project
To run the project, follow these steps (Prequisite : Have Node.Js Installed):

1. Clone the repository: `git clone <repository_url>`
2. move into local repo folder `cd Express-JWT-Role-API`.
3. Install Dependencies `npm install`.
4. Navigate to the project directory: `cd Speer_Notes`
5. Change Database Parameters in .env as required. (Email Credentials for Node Mailer, MongoDB Connection URI, or JWT_SECRET).
6. To Run the server use `npm run dev`.
7. Open Postman and import Collection from `Postman Collection`.

## How to run the Tests

1. Follow Steps from above from 1-7.
2. Open Postman and Run the whole Collection and See the results on Postman Screen.

### Tech Stack Used

- **Programming Language:** JavaScript
- **Backend Framework:** Node.JS
- **REST Framework:** Express.JS
- **Database:** MongoDB
- **Test Framework:** Postman Collection Tests

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
- **Request.Params:** ```{ :id - id of User Model to be deleted }