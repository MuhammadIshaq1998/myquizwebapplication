# myquizwebapplication

# Getting Started with "the quiz app"

# Description:
Well, the main aim to design a quiz web application with the user authentication. 

# Progress:

I have designed the backend as:

this project contains the backend files, so has a decent folder structure such that

middleware=> contains the file "auth.js" which has all the authentication implementation using jwt
models=> contains each folder of each file as quiz-model for "Quiz.js", scores-model for "scores.js" and users-model for "Users.js"

here the routes => contains quizzes-routes folder and within this folder we have a quizzes.js file for path defining.
routes => contains users-routes folder and within this folder we have a users.js file for path defining.

the last folder is about verfication=> has a verify.js file, an implementation of verification for the time of login of user.

Package.json contains all the dependencies

But haven't complete this project as have designed front-end login page and deshboard of quiz app but didn't meet the requirement till the deadline, so will continue this project.

## Available Scripts

In the project directory, you can run:


### `npm start` 
### `nodemon index`

This project has ".env" is hidden as paste in gitignore file,
Runs the app in the development mode.
The PORT Number for local host is "9000" (Backend)
Open [http://localhost:9000] to view it in the browser.
