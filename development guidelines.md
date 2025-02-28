# General Development Rules

You should do task-based development. For every task, you should write the tests, implement the code, and run the tests to make sure everything works. 

For .NET projects, use `dotnet test` to run the tests or use `dotnet test --filter "FullyQualifiedName~TypeConversionTests"` to run a specific test.

For JavaScript projects using Jest, use `npm test` to run all tests or `npm test -- --testPathPattern=tests/auth.test.js` to run a specific test file.

When the tests pass:
* Update the todo list to reflect the task being completed
* Update the memory file to reflect the current state of the project
* Fix any warnings or errors in the code
<!-- * Commit the changes to the repository with a descriptive commit message -->
* Update the development guidelines to reflect anything that you've learned while working on the project
* Stop and we will open a new chat for the next task

## Retain Memory

There will be a memory file for every project.

The memory file will contain the state of the project, and any notes or relevant details you'd need to remember between chats.

Keep it up to date based on the project's current state. 

Do not annotate task completion in the memory file. It will be tracked in the to-do list.

## Update development guidelines

If necessary, update the development guidelines to reflect anything you've learned while working on the project.

## Firebase Configuration

For projects using Firebase:

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable the services you need (Authentication, Firestore, etc.)
3. For Authentication, enable the sign-in methods you want to use (Google, Email/Password, etc.)
4. Get your Firebase configuration from Project Settings > General > Your apps > Firebase SDK snippet
5. Replace the placeholder values in the app.js file with your actual Firebase configuration
6. For local development, you can use Firebase Emulator Suite to test your app without connecting to production services
