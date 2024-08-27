# Real-Time Chat Application

## Overview

This project is a real-time chat application that allows users to send and receive messages instantly. It supports user authentication, message history retrieval, and group chat functionality. The application is dockerized for ease of deployment and can be deployed to a hosting service.

## Features

1. **User Authentication**:

   - User registration and login endpoints.
   - JWT (JSON Web Tokens) for managing user sessions and securing endpoints.

2. **Real-Time Messaging**:

   - Socket.IO for real-time messaging.
   - Real time file sharing

3. **Message Management**:

   - Send Message API
   - Get Message History API

4. **Group Chat Functionality**:

   - Create Group API
   - Send Group Message API

5. **Reset Password Functionality**:

   - Send Mail API
   - Check Request API
   - Update Password API

### User Authentication

- **Register**: Allow users to create accounts.
- **Login**: Authenticate users and issue JWTs.

- **SignUp**

  - **Endpoint**: `/user/signup`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "name": "string",
      "email": "string",
      "number": "number",
      "password": "string"
    }
    ```
  - **Response**: No Response.

  - **Login**
  - **Endpoint**: `/user/login`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - **Response**: User data with json web token.

### Real-Time Messaging

- **Socket.IO**: Enable instant messaging between users.

### Message Management

- **Send Message API**

  - **Endpoint**: `/api/messages`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "senderId": "string",
      "receiverId": "string",
      "groupId": "string (optional)",
      "content": "string"
    }
    ```
  - **Response**: Sent message object.

- **Get Message History API**
  - **Endpoint**: `/api/messages/history`
  - **Method**: GET
  - **Request Parameters**:
    - `userId` (string): User ID for message history.
    - `withUserId` (string, optional): ID of the other user.
    - `groupId` (string, optional): ID of the group.
    - `page` (number, optional): Page number for pagination.
    - `pageSize` (number, optional): Number of messages per page.
  - **Response**: Array of message objects.

### Group Chat Functionality

- **Create Group API**

  - **Endpoint**: `/api/groups`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "name": "string",
      "members": ["string"]
    }
    ```
  - **Response**: Created group object.

- **Send Group Message API**
  - **Endpoint**: `/api/groups/{groupId}/messages`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "senderId": "string",
      "content": "string"
    }
    ```
  - **Response**: Sent group message object.

### Reset Password Functionality

- **Send Forgot Password link API**

  - **Endpoint**: `/password/forgotpassword`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "email": "string"
    }
    ```
  - **Response**: Email sent message object.

  - **Reset Password link click API**
  - **Endpoint**: `/password/checkRequest/{uuid}`
  - **Method**: GET
  - **Response**: Redirect to reset password page.

  - **Update Password API**
  - **Endpoint**: `/password/updatepassword/{userId}`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "newPassword": "string"
    }
    ```
  - **Response**: Password changed message object.

## Technical Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Real-Time Communication**: Socket.IO
- **Authentication**: JWT
- **Containerization**: Docker
- **Email**: SendInBlue
- **FileStore**: AWS S3