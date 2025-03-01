// Random Number Picker - Application Logic

// Firebase configuration
// Note: In a production environment, these values should be stored securely
const firebaseConfig = {
    apiKey: "AIzaSyDE9Okgc7kB5wHk_n4QjYm6e63gxrDsFTI",
    authDomain: "numpick-77a82.firebaseapp.com",
    projectId: "numpick-77a82",
    storageBucket: "numpick-77a82.firebasestorage.app",
    messagingSenderId: "716371207032",
    appId: "1:716371207032:web:a7424af1b7e41479495e8d",
    measurementId: "G-RTG3NLJKH9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();

// Get references to DOM elements
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const loginContainer = document.getElementById('login-container');
const userContainer = document.getElementById('user-container');
const usersListContainer = document.getElementById('users-list-container');
const usersList = document.getElementById('users-list');
const userPic = document.getElementById('user-pic');
const userName = document.getElementById('user-name');
const userNumber = document.getElementById('user-number');

// Global variables
let currentUser = null;
const db = firebase.firestore();
const usersCollection = db.collection('users');

// Authentication functions
function initAuth() {
    // Set up authentication state observer
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            currentUser = user;
            showUserInfo(user);
            checkUserInDatabase(user);
            loadAllUsers();
        } else {
            // User is signed out
            currentUser = null;
            showLoginUI();
        }
    });

    // Set up event listeners
    loginButton.addEventListener('click', signIn);
    logoutButton.addEventListener('click', signOut);
}

function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(error => {
        console.error('Error during sign in:', error);
        alert('Failed to sign in. Please try again.');
    });
}

function signOut() {
    firebase.auth().signOut().catch(error => {
        console.error('Error during sign out:', error);
    });
}

// Database functions
async function checkUserInDatabase(user) {
    try {
        const userDoc = await usersCollection.doc(user.uid).get();
        
        if (!userDoc.exists) {
            // New user, generate random number and save to database
            const randomNum = generateRandomNumber();
            await saveUserToDatabase(user, randomNum);
        } else {
            // Existing user, update UI with stored number
            const userData = userDoc.data();
            updateUserNumberUI(userData.number);
        }
    } catch (error) {
        console.error('Error checking user in database:', error);
    }
}

async function saveUserToDatabase(user, number) {
    try {
        await usersCollection.doc(user.uid).set({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            number: number,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        updateUserNumberUI(number);
    } catch (error) {
        console.error('Error saving user to database:', error);
    }
}

async function loadAllUsers() {
    try {
        const snapshot = await usersCollection.orderBy('number', 'asc').get();
        renderUsersList(snapshot.docs);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Random number generation
function generateRandomNumber() {
    // Generate a random number between 1 and 100
    return Math.floor(Math.random() * 100) + 1;
}

// UI functions
function showLoginUI() {
    loginContainer.classList.remove('hidden');
    userContainer.classList.add('hidden');
    usersListContainer.classList.add('hidden');
}

function showUserInfo(user) {
    // Update user info UI
    userPic.src = user.photoURL || './placeholder.png';
    userName.textContent = user.displayName;
    
    // Show user container, hide login container
    loginContainer.classList.add('hidden');
    userContainer.classList.remove('hidden');
    usersListContainer.classList.remove('hidden');
}

function updateUserNumberUI(number) {
    userNumber.textContent = `Your number: ${number}`;
}

function renderUsersList(userDocs) {
    // Clear existing list
    usersList.innerHTML = '';
    
    // Add each user to the list
    userDocs.forEach(doc => {
        const userData = doc.data();
        const li = document.createElement('li');
        li.className = 'user-item';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'user-item-name';
        
        const img = document.createElement('img');
        img.className = 'user-item-pic';
        img.src = userData.photoURL || './placeholder.png';
        img.alt = 'Profile picture';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = userData.name;
        
        const numberSpan = document.createElement('span');
        numberSpan.className = 'user-item-number';
        numberSpan.textContent = userData.number;
        
        nameDiv.appendChild(img);
        nameDiv.appendChild(nameSpan);
        
        li.appendChild(nameDiv);
        li.appendChild(numberSpan);
        
        usersList.appendChild(li);
    });
}

// Initialize the application
function init() {
    initAuth();
}

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
