# Random Number Picker Web App

A web application that assigns random numbers to authenticated users and displays a list of all users with their assigned numbers.

## Features

- Google authentication using Firebase
- Random number generation for each user (1-100)
- Persistent storage of user information in Firebase Firestore
- Display of all users with their assigned numbers
- Responsive design for different screen sizes

## Project Structure

- `index.html` - Main HTML file with user interface
- `styles.css` - CSS styling for the application
- `app.js` - Main application logic including authentication and database operations
- `tests/` - Test files for application logic
  - `auth.test.js` - Tests for authentication functionality
  - `random.test.js` - Tests for random number generation
  - `database.test.js` - Tests for database operations
  - `ui.test.js` - Tests for UI rendering

## Setup Instructions

1. Clone this repository
2. Create a Firebase project at https://console.firebase.google.com/
3. Enable Authentication with Google sign-in method
4. Create a Firestore database
5. Get your Firebase configuration from Project Settings > General > Your apps > Firebase SDK snippet
6. Replace the placeholder values in the `app.js` file with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

7. Open `index.html` in your browser to run the application

## Running Tests

This project uses Jest for testing. To run the tests:

1. Install dependencies:
```
npm install
```

2. Run all tests:
```
npm test
```

3. Run a specific test file:
```
npm test -- --testPathPattern=tests/auth.test.js
```

## Implementation Notes

- Using Firebase for authentication and database
- Using vanilla JavaScript for application logic
- Using Jest for testing
- No external UI libraries or frameworks
