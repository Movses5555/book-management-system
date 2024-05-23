# Book Management System

## Setup Instructions

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
2. **MySQL**: Install MySQL and create a database for the project.

### Installation Steps

1. **Clone the Repository**:

   ```sh
   git clone <repository-url>
   cd book-management-system
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

### Configure the Database

1. **Create a `.env` File**:

   - Create a `.env` file in the root directory of your project.

2. **Add Database Credentials**:

   - Open the `.env` file and add the following content with your database credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=password
     DB_NAME=book_management
     DB_PORT=3000
     JWT_SECRET=your_jwt_secret
     ```
     Replace the values (`localhost`, `root`, `password`, `book_management`, `3000`, `your_jwt_secret`) with your actual database connection details and JWT secret.

3. **Save the Changes**:
   - Save the `.env` file.

### Start the Development Server

```sh
npm run dev
```

## API Documentation

### Base URL

- The base URL for all API endpoints is:
  `http://localhost:3000/api`

### Authentication

#### User Registration

- **POST /api/register**
  - **Description**: Register a new user.
  - **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response**:
    - `201 Created`
    ```json
    {
      "id": "number",
      "username": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
    - `400 Bad Request` if the username is already taken or invalid.
    ```json
    {
      "message": "Username already exists"
    }
    ```

#### User Login

- **POST /api/login**

  - **Description**: Authenticate a user and receive a JWT token.
  - **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response**:

    - `200 OK`

    ```json
    {
      "token": "string"
    }
    ```

    - `400 Bad Request` if the username or password invalid.

    ```json
    {
      "message": "Invalid username or password"
    }
    ```

### Authors

#### Create an Author

- **POST /api/authors**
  - **Description**: Create a new author.
  - **Request Header**:
    - `Authorization: Bearer <token>`
  - **Request Body**:
    ```json
    {
      "name": "string",
      "biography": "string",
      "dateOfBirth": "date"
    }
    ```
  - **Response**:
  - **201 Created**: The author was successfully created.
    ```json
    {
      "id": "number",
      "name": "string",
      "biography": "string",
      "dateOfBirth": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
    - **400 Bad Request**: The request body is invalid. - Example: Missing required fields or invalid date format.
      ```json
      {
        "errors": [
          {
            "type": "field",
            "msg": "Date of Birth must be a valid date",
            "path": "dateOfBirth",
            "location": "body"
          },
          {
            "type": "field",
            "msg": "Name is required",
            "path": "name",
            "location": "body"
          }
        ]
      }
      ```
      - **401 Unauthorized**: The request is not authorized (missing token).
      ```json
      {
        "message": "Unauthorized"
      }
      ```
      - **401 Unauthorized**: The request is not authorized (invalid token).
      ```json
      {
        "message": "Invalid token"
      }
      ```

#### Retrieve All Authors

- **GET /api/authors**
  - **Description**: Retrieve all authors.
  - **Request Header**:
    - `Authorization: Bearer <token>`
  - **Response**:
    - **200 OK**: Successfully retrieved all authors.
      ```json
      [
        {
          "id": "number",
          "name": "string",
          "biography": "string",
          "dateOfBirth": "date",
          "createdAt": "date",
          "updatedAt": "date"
        },
        ...
      ]
      ```
      - **401 Unauthorized**: The request is not authorized (missing token).
      ```json
      {
        "message": "Unauthorized"
      }
      ```
      - **401 Unauthorized**: The request is not authorized (invalid token).
      ```json
      {
        "message": "Invalid token"
      }
      ```

#### Update an Author

- **PUT /api/authors/:id**
  - **Description**: Update an author by their ID.
  - **Request Header**:
    - `Authorization: Bearer <token>`
  - **Request Body**:
    ```json
    {
      "name": "string",
      "biography": "string",
      "dateOfBirth": "date"
    }
    ```
  - **Response**: - **200 OK**: The author was successfully updated.
    ```json
    {
      "id": "number",
      "name": "string",
      "biography": "string",
      "dateOfBirth": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
    - **404 Not Found**: The author with the specified ID does not exist.
    ```json
    {
      "message": "Author not found"
    }
    ```
    - **400 Bad Request**: The request body is invalid. - Example: Missing required fields.
    ```json
    {
      "id": "number",
      "name": "string",
      "biography": "string",
      "dateOfBirth": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
    - **401 Unauthorized**: The request is not authorized (missing token).
    ```json
    {
      "message": "Unauthorized"
    }
    ```
    - **401 Unauthorized**: The request is not authorized (invalid token).
    ```json
    {
      "message": "Invalid token"
    }
    ```

#### Delete an Author

- **DELETE /api/authors/:id**
  - **Description**: Delete an author by their ID.
  - **Request Header**:
    - `Authorization: Bearer <token>`
  - **Response**:
    - **204 No Content**: The author was successfully deleted.
    - **404 Not Found**: The author with the specified ID does not exist.
      ```json
      {
        "message": "Author not found"
      }
      ```
      - **401 Unauthorized**: The request is not authorized (missing token).
      ```json
      {
        "message": "Unauthorized"
      }
      ```
      - **401 Unauthorized**: The request is not authorized (invalid token).
      ```json
      {
        "message": "Invalid token"
      }
      ```

### Books

#### Create a Book

**POST /api/books**

- **Description**: Create a new book.
- **Request Header**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "isbn": "string",
    "publishedDate": "date",
    "authorId": "number"
  }
  ```
- **Response**:
  - **201 Created**: The book was successfully created.
    ```json
    {
      "id": "number",
      "title": "string",
      "isbn": "string",
      "publishedDate": "date",
      "authorId": "number",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
  - **400 Bad Request**: The request body is invalid.
    Example: Missing required fields or invalid date format.
    ```json
    {
      "errors": [
        {
          "type": "field",
          "msg": "Title is required",
          "path": "title",
          "location": "body"
        },
        {
          "type": "field",
          "msg": "ISBN is required",
          "path": "isbn",
          "location": "body"
        }
      ]
    }
    ```
  - **401 Unauthorized**: The request is not authorized (missing token).
  ```json
  {
    "message": "Unauthorized"
  }
  ```
  - **401 Unauthorized**: The request is not authorized (invalid token).
  ```json
  {
    "message": "Invalid token"
  }
  ```

#### Retrieve All Books

- **GET /api/books**
  - **Description**: Retrieve all books.
  - **Request Header**:
    - `Authorization: Bearer <token>`
  - **Response**:
    - **200 OK**: Successfully retrieved all books.
      ```json
      [
        {
          "id": "number",
          "title": "string",
          "isbn": "string",
          "publishedDate": "date",
          "authorId": "number",
          "createdAt": "date",
          "updatedAt": "date"
        },
        ...
      ]
      ```
      - **401 Unauthorized**: The request is not authorized (missing token).
      ```json
      {
        "message": "Unauthorized"
      }
      ```
      - **401 Unauthorized**: The request is not authorized (invalid token).
      ```json
      {
        "message": "Invalid token"
      }
      ```

#### Update a Book

- **PUT /api/books/:id**
  - **Description**: Update a book by its ID.
  - **Request Header**:
    - `Authorization: Bearer <token>`
  - **Request Body**:
    ```json
    {
      "title": "string",
      "isbn": "string",
      "publishedDate": "date",
      "authorId": "number"
    }
    ```
  - **Response**:
    - **200 OK**: The book was successfully updated.
      ```json
      {
        "id": "number",
        "title": "string",
        "isbn": "string",
        "publishedDate": "date",
        "authorId": "number",
        "createdAt": "date",
        "updatedAt": "date"
      }
      ```
    - **404 Not Found**: The book with the specified ID does not exist.
      ```json
      {
        "message": "Book not found."
      }
      ```
    - **400 Bad Request**: The request body is invalid.
      - Example: Missing required fields or invalid date format.
      ```json
      {
        "errors": [
          {
            "type": "field",
            "msg": "ISBN must be a string",
            "path": "isbn",
            "location": "body"
          },
          {
            "type": "field",
            "msg": "Author ID must be an integer",
            "path": "authorId",
            "location": "body"
          }
        ]
      }
      ```
      - **401 Unauthorized**: The request is not authorized (missing token).
      ```json
      {
        "message": "Unauthorized"
      }
      ```
      - **401 Unauthorized**: The request is not authorized (invalid token).
      ```json
      {
        "message": "Invalid token"
      }
      ```

#### Delete a Book

- **DELETE /api/books/:id**
  - **Description**: Delete a book by its ID.
  - **Request Header**:
    - `Authorization: Bearer <token>`
  - **Response**:
    - **204 No Content**: The book was successfully deleted.
    - **404 Not Found**: The book with the specified ID does not exist.
      ```json
      {
        "error": "Book not found."
      }
      ```
      - **401 Unauthorized**: The request is not authorized (missing token).
      ```json
      {
        "message": "Unauthorized"
      }
      ```
      - **401 Unauthorized**: The request is not authorized (invalid token).
      ```json
      {
        "message": "Invalid token"
      }
      ```
