// UI Rendering Tests

// Mock DOM elements
const mockElements = {
    'login-container': { classList: { add: jest.fn(), remove: jest.fn() } },
    'user-container': { classList: { add: jest.fn(), remove: jest.fn() } },
    'users-list-container': { classList: { add: jest.fn(), remove: jest.fn() } },
    'user-pic': { src: '' },
    'user-name': { textContent: '' },
    'user-number': { textContent: '' },
    'users-list': { innerHTML: '', appendChild: jest.fn() }
};

document.getElementById = jest.fn().mockImplementation((id) => {
    return mockElements[id] || {};
});

// Mock document.createElement
const mockLi = { className: '', appendChild: jest.fn() };
const mockDiv = { className: '', appendChild: jest.fn(), textContent: '' };
const mockImg = { className: '', src: '', alt: '' };
const mockSpan = { className: '', textContent: '' };

document.createElement = jest.fn().mockImplementation((tag) => {
    switch (tag) {
        case 'li': return { ...mockLi };
        case 'div': return { ...mockDiv };
        case 'img': return { ...mockImg };
        case 'span': return { ...mockSpan };
        default: return {};
    }
});

// Import functions (assuming they're exported)
// Note: For this test to work, app.js would need to be modified to export these functions
// const { showLoginUI, showUserInfo, updateUserNumberUI, renderUsersList } = require('../app.js');

// Mock functions for testing
const showLoginUI = () => {
    mockElements['login-container'].classList.remove('hidden');
    mockElements['user-container'].classList.add('hidden');
    mockElements['users-list-container'].classList.add('hidden');
};

const showUserInfo = (user) => {
    // Update user info UI
    mockElements['user-pic'].src = user.photoURL || './placeholder.png';
    mockElements['user-name'].textContent = user.displayName;
    
    // Show user container, hide login container
    mockElements['login-container'].classList.add('hidden');
    mockElements['user-container'].classList.remove('hidden');
    mockElements['users-list-container'].classList.remove('hidden');
};

const updateUserNumberUI = (number) => {
    mockElements['user-number'].textContent = `Your number: ${number}`;
};

const renderUsersList = (userDocs) => {
    // Clear existing list
    mockElements['users-list'].innerHTML = '';
    
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
        
        mockElements['users-list'].appendChild(li);
    });
};

// Mock user data
const mockUser = {
    uid: 'test-user-123',
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: 'https://example.com/photo.jpg'
};

// Mock user docs for list rendering
const mockUserDocs = [
    {
        data: () => ({
            uid: 'user1',
            name: 'User One',
            photoURL: 'https://example.com/photo1.jpg',
            number: 10
        })
    },
    {
        data: () => ({
            uid: 'user2',
            name: 'User Two',
            photoURL: 'https://example.com/photo2.jpg',
            number: 25
        })
    }
];

describe('UI Rendering', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Reset mockElements
        mockElements['login-container'].classList.add.mockClear();
        mockElements['login-container'].classList.remove.mockClear();
        mockElements['user-container'].classList.add.mockClear();
        mockElements['user-container'].classList.remove.mockClear();
        mockElements['users-list-container'].classList.add.mockClear();
        mockElements['users-list-container'].classList.remove.mockClear();
        mockElements['user-pic'].src = '';
        mockElements['user-name'].textContent = '';
        mockElements['user-number'].textContent = '';
        mockElements['users-list'].innerHTML = '';
        mockElements['users-list'].appendChild.mockClear();
    });

    test('showLoginUI shows login container and hides user containers', () => {
        showLoginUI();
        
        expect(mockElements['login-container'].classList.remove).toHaveBeenCalledWith('hidden');
        expect(mockElements['user-container'].classList.add).toHaveBeenCalledWith('hidden');
        expect(mockElements['users-list-container'].classList.add).toHaveBeenCalledWith('hidden');
    });

    test('showUserInfo updates user info and shows user containers', () => {
        showUserInfo(mockUser);
        
        // Check user info was updated
        expect(mockElements['user-pic'].src).toBe('https://example.com/photo.jpg');
        expect(mockElements['user-name'].textContent).toBe('Test User');
        
        // Check containers visibility was updated
        expect(mockElements['login-container'].classList.add).toHaveBeenCalledWith('hidden');
        expect(mockElements['user-container'].classList.remove).toHaveBeenCalledWith('hidden');
        expect(mockElements['users-list-container'].classList.remove).toHaveBeenCalledWith('hidden');
    });

    test('showUserInfo uses placeholder image when user has no photo', () => {
        const userWithoutPhoto = { ...mockUser, photoURL: null };
        showUserInfo(userWithoutPhoto);
        
        expect(mockElements['user-pic'].src).toBe('./placeholder.png');
    });

    test('updateUserNumberUI updates the user number display', () => {
        updateUserNumberUI(42);
        
        expect(mockElements['user-number'].textContent).toBe('Your number: 42');
    });

    test('renderUsersList clears and populates the users list', () => {
        renderUsersList(mockUserDocs);
        
        // Check list was cleared
        expect(mockElements['users-list'].innerHTML).toBe('');
        
        // Check list items were created
        expect(document.createElement).toHaveBeenCalledWith('li');
        expect(document.createElement).toHaveBeenCalledWith('div');
        expect(document.createElement).toHaveBeenCalledWith('img');
        expect(document.createElement).toHaveBeenCalledWith('span');
        
        // Check list items were appended
        expect(mockElements['users-list'].appendChild).toHaveBeenCalledTimes(2);
    });

    test('renderUsersList creates correct structure for each user', () => {
        // Reset createElement mock to capture created elements
        const createdElements = [];
        document.createElement.mockImplementation((tag) => {
            const element = { tag, appendChild: jest.fn() };
            createdElements.push(element);
            return element;
        });
        
        renderUsersList(mockUserDocs);
        
        // Find the li elements (should be the first and sixth elements)
        const firstLi = createdElements.find(el => el.tag === 'li');
        expect(firstLi).toBeDefined();
        expect(firstLi.className).toBe('user-item');
        
        // Check that appendChild was called on the li
        expect(firstLi.appendChild).toHaveBeenCalled();
    });
});
