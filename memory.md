# Random Number Picker Web App - Project Memory

## Project Structure
- index.html - Main HTML file with user interface
- styles.css - CSS styling for the application
- app.js - Main application logic including authentication and database operations
- tests/ - Test files for application logic
  - auth.test.js - Tests for authentication functionality
  - random.test.js - Tests for random number generation
  - database.test.js - Tests for database operations
  - ui.test.js - Tests for UI rendering

## Application Design
- Authentication: Google Sign-In using Firebase Authentication
- Database: Firebase Firestore for storing user information
- Features:
  - User authentication with Google
  - Random number generation for each authenticated user
  - Display of all users with their assigned numbers
  - Responsive design for different screen sizes

## Implementation Notes
- Using Firebase for authentication and database
- Using vanilla JavaScript for application logic
- Using Jest for testing
- No external UI libraries or frameworks
