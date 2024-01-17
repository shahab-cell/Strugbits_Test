Features
Chat API:

Create and manage chat conversations.
Delete messages for the current user and everyone.
Search for users and messages.
User API:

Register a new user.
Authenticate users with JWT.
Log out users.
View and update user profiles.
Getting Started
Install dependencies:

bash
Copy code
npm install
Run the application:

bash
Copy code
npm start
The application will be accessible at http://localhost:3000.

Chat API
POST /
Create a new chat conversation.

POST /userchat
Fetch chat conversations for a specific user.

DELETE /deleteForMe/:messageId/:userId
Delete a message for the current user.

DELETE /deleteForEveryone/:messageId
Delete a message for everyone in the chat.

GET /search/:query
Search for users and messages.

User API
POST /
Register a new user.

POST /auth
Authenticate a user and receive a JWT token.

POST /logout
Log out the user and invalidate the JWT token.

GET /profile
Fetch the user profile. (Protected route)

PUT /profile
Update the user profile. (Protected route)

Authentication
User authentication is implemented using JWT (JSON Web Tokens). Protected routes require a valid JWT token for access.
