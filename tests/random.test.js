// Random Number Generation Tests

// Mock Math.random to return predictable values
const originalMathRandom = Math.random;

// Import the function (assuming it's exported)
// Note: For this test to work, app.js would need to be modified to export this function
// const { generateRandomNumber } = require('../app.js');

// Mock function for testing
const generateRandomNumber = () => {
    // Generate a random number between 1 and 100
    return Math.floor(Math.random() * 100) + 1;
};

describe('Random Number Generation', () => {
    beforeEach(() => {
        // Reset Math.random to its original implementation before each test
        Math.random = originalMathRandom;
    });

    afterAll(() => {
        // Ensure Math.random is restored after all tests
        Math.random = originalMathRandom;
    });

    test('generateRandomNumber returns a number between 1 and 100', () => {
        // Run the function multiple times to check range
        for (let i = 0; i < 100; i++) {
            const result = generateRandomNumber();
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(100);
            expect(Number.isInteger(result)).toBe(true);
        }
    });

    test('generateRandomNumber returns expected value when Math.random is mocked', () => {
        // Mock Math.random to return a specific value
        Math.random = jest.fn().mockReturnValue(0.5);
        
        // With Math.random() = 0.5, we expect: Math.floor(0.5 * 100) + 1 = 51
        expect(generateRandomNumber()).toBe(51);
        
        // Change the mock return value
        Math.random = jest.fn().mockReturnValue(0);
        expect(generateRandomNumber()).toBe(1);
        
        Math.random = jest.fn().mockReturnValue(0.99);
        expect(generateRandomNumber()).toBe(100);
    });

    test('generateRandomNumber produces different values over multiple calls', () => {
        // Restore the original Math.random
        Math.random = originalMathRandom;
        
        // Generate a large set of random numbers
        const results = new Set();
        for (let i = 0; i < 50; i++) {
            results.add(generateRandomNumber());
        }
        
        // We expect to get multiple different values
        // Note: There's a tiny probability this could fail by random chance
        expect(results.size).toBeGreaterThan(1);
    });

    test('generateRandomNumber returns only integers', () => {
        for (let i = 0; i < 100; i++) {
            const result = generateRandomNumber();
            expect(Number.isInteger(result)).toBe(true);
        }
    });
});
