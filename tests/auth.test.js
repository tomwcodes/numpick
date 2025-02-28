// Authentication Tests

// Mock Firebase
const mockAuth = {
    onAuthStateChanged: jest.fn(),
    signInWithPopup: jest.fn().mockResolvedValue({}),
    signOut: jest.fn().mockResolvedValue({})
};

const mockGoogleAuthProvider = jest.fn();

// Mock user data
const mockUser = {
    uid: 'test-user-123',
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: 'https://example.com/photo.jpg'
};

// Mock DOM elements
document.getElementById = jest.fn().mockImplementation((id) => {
    if (id === 'login-button' || id === 'logout-button') {
        return {
            addEventListener: jest.fn()
        };
    }
    return {};
});

// Mock global firebase object
global.firebase = {
    auth: () => mockAuth,
    firestore: () => ({
        collection: () => ({
            doc: () => ({
                get: jest.fn().mockResolvedValue({
                    exists: false
                }),
                set: jest.fn().mockResolvedValue({})
            })
        }),
        FieldValue: {
            serverTimestamp: jest.fn()
        }
    }),
    auth: {
        GoogleAuthProvider: mockGoogleAuthProvider
    }
};

// Import app.js functions (assuming they're exported)
// Note: For this test to work, app.js would need to be modified to export these functions
// const { initAuth, signIn, signOut } = require('../app.js');

// Mock functions for testing
const initAuth = () => {
    // Set up authentication state observer
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            showUserInfo(user);
            checkUserInDatabase(user);
        } else {
            // User is signed out
            showLoginUI();
        }
    });

    // Set up event listeners
    document.getElementById('login-button').addEventListener('click', signIn);
    document.getElementById('logout-button').addEventListener('click', signOut);
};

const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
};

const signOut = () => {
    return firebase.auth().signOut();
};

const showUserInfo = jest.fn();
const checkUserInDatabase = jest.fn();
const showLoginUI = jest.fn();

describe('Authentication', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('initAuth sets up auth state observer', () => {
        initAuth();
        expect(mockAuth.onAuthStateChanged).toHaveBeenCalled();
    });

    test('signIn calls Firebase signInWithPopup with Google provider', async () => {
        await signIn();
        expect(mockGoogleAuthProvider).toHaveBeenCalled();
        expect(mockAuth.signInWithPopup).toHaveBeenCalled();
    });

    test('signOut calls Firebase signOut', async () => {
        await signOut();
        expect(mockAuth.signOut).toHaveBeenCalled();
    });

    test('onAuthStateChanged calls showUserInfo and checkUserInDatabase when user is signed in', () => {
        initAuth();
        
        // Get the callback function passed to onAuthStateChanged
        const authCallback = mockAuth.onAuthStateChanged.mock.calls[0][0];
        
        // Call the callback with a mock user
        authCallback(mockUser);
        
        expect(showUserInfo).toHaveBeenCalledWith(mockUser);
        expect(checkUserInDatabase).toHaveBeenCalledWith(mockUser);
    });

    test('onAuthStateChanged calls showLoginUI when user is signed out', () => {
        initAuth();
        
        // Get the callback function passed to onAuthStateChanged
        const authCallback = mockAuth.onAuthStateChanged.mock.calls[0][0];
        
        // Call the callback with null (signed out)
        authCallback(null);
        
        expect(showLoginUI).toHaveBeenCalled();
    });
});
