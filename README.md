# Web Admin App

## Table Of Contents

- [Introduction](#introduction)
- [Project Requirements](#project-requirements)
- [API Structure and Endpoints](#api-structure-and-endpoints)
  - [User API](#user-api)
  - [Auth API](#auth-api)
  - [Blog API](#blog-api)
  - [Transaction API](#transaction-api)
- [Project Running Instructions](#project-running-instructions)

### Introduction

A web admin backend API with various roles and integration of password reset and email sending services.

### Project Requirements

- Various roles - Admin, Power User(s), User(s), Support Desk.

- Admin can create Power User(s) and User(s).

  - Once an Admin creates a user ID for a Power User(s) or User(s). The created entity should receive an email with a one-time password reset link.
  - The link should expire as soon as the user resets the password.

- The app should have session based authentication.

- Power User(s) can:

  - See all User(s) data.
  - Not create their own transactions.

- User(s) can:

  - Create/Delete/View their own transactions.

- Support Desk can:

  - Only View all transactions.
  - Not create their own transactions.

### API Structure and Endpoints

- #### User API

  - **Access All User Data**

    - Endpoint: `{{BASE_URL}}/user`
    - Request Type: `GET`
    - Guard Type: `Auth Guard` and `Role Guard`
    - Respone:

      ```js
      [
          {
              "_id": {{AUTO_GEN_USER_ID}},
              "fullName": {{USER_FULL_NAME}},
              "email": {{USER_EMAIL}},
              "passwordHash": {{USER_PASS_HASH}},
              "createdAt": {{CREATED_AT_TIMESTAMP}},
              "updatedAt": {{UPDATED_AT_TIMESTAMP}}
          }
      ]
      ```

  - **Access A User**

    - Endpoint: `{{BASE_URL}}/user/:userId`
    - Request Type: `GET`
    - Guard Type: `Auth Guard` and `Role Guard`
    - Response:

      ```js
      {
          "_id": {{AUTO_GEN_USER_ID}},
          "fullName": {{USER_FULL_NAME}},
          "email": {{USER_EMAIL}},
          "passwordHash": {{USER_PASS_HASH}},
          "createdAt": {{CREATED_AT_TIMESTAMP}},
          "updatedAt": {{UPDATED_AT_TIMESTAMP}}
      }
      ```

- #### Auth API

  - **Register A User or A Power User**

    - Endpoint:
      - For User: `{{BASE_URL}}/auth/user/register`
      - For Power User: `{{BASE_URL}}/auth/power/register`
    - Request Type: `POST`
    - Guard Type: `Auth Guard` and `Role Guard`
    - Request:

      ```js
      {
          "fullName": {{USER_FULL_NAME}},
          "email": {{USER_EMAIL}},
          "password": {{USER_PASS}}
      }
      ```

    - Response:

      - For User(s):

        ```js
        {
            status: 201,
            message: 'User Created And Password Reset Link Sent Successfully!'
        }
        ```

      - For Power User(s):

        ```js
        {
            status: 201,
            message: 'User Created And Password Reset Link Sent Successfully!'
        }
        ```

  - **Register An Admin or A Support Desk User**

    - Endpoint:
      - For Admin(s): `{{BASE_URL}}/auth/admin/register`
      - For Support Desk User(s): `{{BASE_URL}}/auth/support/register`
    - Request Type: `POST`
    - Request:

      ```js
      {
          "fullName": {{USER_FULL_NAME}},
          "email": {{USER_EMAIL}},
          "password": {{USER_PASS}}
      }
      ```

    - Response:

      - For Admin(s):

        ```js
        {
            status: 201,
            message: 'Admin Created Successfully!'
        }
        ```

      - For Support Desk User(s):

        ```js
        {
            status: 201,
            message: 'Support Desk User Created Successfully!'
        }
        ```

  - **Login A User**

    - Endpoint: `{{BASE_URL}}/auth/login`
    - Request Type: `POST`
    - Guard Type: `Local Auth Guard`
    - Request:

      ```js
      {
        "email": {{USER_EMAIL}},
        "password": {{USER_PASS}}
      }
      ```

    - Response:

      ```js
      {
        status: 200,
        message: 'Logged In Successfully!'
      }
      ```

- #### Blog API

  - **Create A Blog**

    - Endpoint: `{{BASE_URL}}/blog`
    - Request Type: `POST`
    - Guard Type: `Auth Guard` and `Role Guard`
    - Request:

      ```js
      {
        "title": {{BLOG_TITLE}},
        "description": {{BLOG_DESC}}
      }
      ```

    - Response:

      ```js
      {
        status: 201,
        message: 'Blog Created Successfully!'
      }
      ```

  - **Access All User Blogs**

    - Endpoint: `{{BASE_URL}}/blog`
    - Request Type: `GET`
    - Guard Type: `Auth Guard` and `Role Guard`
    - Response:

      ```js
      [
        {
            "_id": {{AUTO_GEN_BLOG_ID}},
            "title": {{BLOG_TITLE}},
            "description": {{BLOG_DESC}},
            "creator": {{CREATOR_USER_ID}},
            "createdAt": {{CREATED_AT_TIMESTAMP}},
            "updatedAt": {{UPDATED_AT_TIMESTAMP}},
        }
      ]
      ```

  - **Update A Blog**

    - Endpoint: `{{BASE_URL}}/blog/:blogId`
    - Request Type: `PATCH`
    - Guard Type: `Auth Guard` and `Role Guard`
    - Request:

      ```js
      {
        "title": {{UPDATED_BLOG_TITLE}},
        "description": {{UPDATED_BLOG_DESC}}
      }
      ```

    - Response:

      ```js
      {
        status: 200,
        message: 'Blog Updated Successfully!'
      }
      ```

  - **Delete A Blog**

    - Endpoint: `{{BASE_URL}}/blog/:blogId`
    - Request Type: `DELETE`
    - Guard Type: `Auth Guard` and `Role Guard`
    - Response:

      ```js
      {
        status: 200,
        message: 'Blog Deleted Successfully!'
      }
      ```

- #### Transaction API

  - **Access All Logs**

    - Endpoint: `{{BASE_URL}}/transaction`
    - Request Type: `GET`
    - Guard Type: `Auth Guard` and `Role Guard`
    - Response:

      ```js
      [
        {
            "log": {{LOG_STMT}},
            "user": {{USER_ID}}
        }
      ]
      ```

  - **Access All User Logs**

    - Endpoint: `{{BASE_URL}}/transaction/user`
    - Request Type: `GET`
    - Guard Type: `Auth Guard` and `Role Guard`
    - Response:

      ```js
      {
        "log": {{LOG_STMT}},
        "user": {{USER_ID}}
      }
      ```

### Project Running Instructions

1. Clone or download the project.

2. Navigate to the root directory of the project and run the `npm install` command.

3. After the previous command finishes create an `.env` file in your root directory with same configurations as given in the `.sample.env` file.

4. After you have configured the `.env` file run the command `npm run start:dev` which will fireup the server and using any `REST` client test the routes and requests.

5. For the email service go to [Ethereal Email](https://www.ethereal.email) and click on the `Create Ethereal Account` which will provide you with a dummy email and password which you can use to configure the email service.
