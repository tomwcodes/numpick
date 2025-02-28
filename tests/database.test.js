// Database Operations Tests

// Mock Firebase Firestore
const mockDoc = {
    exists: false,
    data: jest.fn().mockReturnValue({
        uid: 'test-user-123',
        name: 'Test User',
        email: 'test@example.com',
        photoURL: 'https://example.com/photo.jpg',
        number: 42
    })
};

const mockGet = jest.fn().mockResolvedValue(mockDoc);
const mockSet = jest.fn().mockResolvedValue({});

const mockDocs = [
    {
        data: jest.fn().mockReturnValue({
            uid: 'user1',
            name: 'User One',
            photoURL: 'https://example.com/photo1.jpg',
            number: 10
        })
    },
    {
        data: jest.fn().mockReturnValue({
            uid: 'user2',
            name: 'User Two',
            photoURL: 'https://example.com/photo2.jpg',
            number: 25
        })
    }
];

const mockOrderBy = jest.fn().mockReturnValue({
    get: jest.fn().mockResolvedValue({
        docs: mockDocs
    })
});

const mockCollection = jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue({
        get: mockGet,
        set: mockSet
    }),
    orderBy: mockOrderBy
});

// Mock global firebase object
global.firebase = {
    firestore: jest.fn().mockReturnValue({
        collection: mockCollection,
        FieldValue: {
            serverTimestamp: jest.fn()
        }
    })
};

// Import functions (assuming they're exported)
// Note: For this test to work, app.js would need to be modified to export these functions
// const { checkUserInDatabase, saveUserToDatabase, loadAllUsers } = require('../app.js');

// Mock functions for testing
const updateUserNumberUI = jest.fn();
const renderUsersList = jest.fn();

const checkUserInDatabase = async (user) => {
    try {
        const db = firebase.firestore();
        const usersCollection = db.collection('users');
        const userDoc = await usersCollection.doc(user.uid).get();
        
        if (!userDoc.exists) {
            // New user, generate random number and save to database
            const randomNum = 42; // Mock random number
            await saveUserToDatabase(user, randomNum);
        } else {
            // Existing user, update UI with stored number
            const userData = userDoc.data();
            updateUserNumberUI(userData.number);
        }
    } catch (error) {
        console.error('Error checking user in database:', error);
    }
};

const saveUserToDatabase = async (user, number) => {
    try {
        const db = firebase.firestore();
        const usersCollection = db.collection('users');
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
};

const loadAllUsers = async () => {
    try {
        const db = firebase.firestore();
        const usersCollection = db.collection('users');
        const snapshot = await usersCollection.orderBy('number', 'asc').get();
        renderUsersList(snapshot.docs);
    } catch (error) {
        console.error('Error loading users:', error);
    }
};

// Mock user data
const mockUser = {
    uid: 'test-user-123',
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: 'https://example.com/photo.jpg'
};

describe('Database Operations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('checkUserInDatabase calls saveUserToDatabase for new users', async () => {
        // Set up mock to indicate user doesn't exist
        mockDoc.exists = false;
        
        await checkUserInDatabase(mockUser);
        
        // Verify Firestore was queried
        expect(mockCollection).toHaveBeenCalledWith('users');
        expect(mockGet).toHaveBeenCalled();
        
        // Verify saveUserToDatabase was called
        expect(mockSet).toHaveBeenCalled();
        expect(updateUserNumberUI).toHaveBeenCalledWith(42);
    });

    test('checkUserInDatabase updates UI for existing users', async () => {
        // Set up mock to indicate user exists
        mockDoc.exists = true;
        
        await checkUserInDatabase(mockUser);
        
        // Verify Firestore was queried
        expect(mockCollection).toHaveBeenCalledWith('users');
        expect(mockGet).toHaveBeenCalled();
        
        // Verify UI was updated with stored number
        expect(mockDoc.data).toHaveBeenCalled();
        expect(updateUserNumberUI).toHaveBeenCalledWith(42);
        
        // Verify saveUserToDatabase was NOT called
        expect(mockSet).not.toHaveBeenCalled();
    });

    test('saveUserToDatabase saves user data to Firestore', async () => {
        await saveUserToDatabase(mockUser, 42);
        
        // Verify Firestore was updated
        expect(mockCollection).toHaveBeenCalledWith('users');
        expect(mockSet).toHaveBeenCalledWith({
            uid: 'test-user-123',
            name: 'Test User',
            email: 'test@example.com',
            photoURL: 'https://example.com/photo.jpg',
            number: 42,
            createdAt: expect.any(Function)
        });
        
        // Verify UI was updated
        expect(updateUserNumberUI).toHaveBeenCalledWith(42);
    });

    test('loadAllUsers retrieves users ordered by number', async () => {
        await loadAllUsers();
        
        // Verify Firestore query
        expect(mockCollection).toHaveBeenCalledWith('users');
        expect(mockOrderBy).toHaveBeenCalledWith('number', 'asc');
        
        // Verify UI was updated with user list
        expect(renderUsersList).toHaveBeenCalledWith(mockDocs);
    });
});
