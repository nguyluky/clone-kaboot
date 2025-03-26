// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'clone_kaboot_test';

// Increase test timeout for database operations
jest.setTimeout(15000);

// Mock the database connection - Updated path to reflect new structure
jest.mock('../src/config/db', () => {
    // Create mock functions
    const mockQuery = jest.fn();

    // Create a mock connection object with all required methods
    const mockConnection = {
        query: jest.fn(),
        beginTransaction: jest.fn().mockResolvedValue(true),
        commit: jest.fn().mockResolvedValue(true),
        rollback: jest.fn().mockResolvedValue(true),
        release: jest.fn().mockResolvedValue(true)
    };

    // Create the mock pool with a getConnection function that returns the mockConnection
    const mockPool = {
        query: mockQuery,
        getConnection: jest.fn().mockResolvedValue(mockConnection)
    };

    // Make the connection object available synchronously for tests
    mockPool.getConnection.mockReturnValue(mockConnection);

    return mockPool;
});

// Global beforeAll hook
beforeAll(() => {
    console.log('Starting tests...');
});

// Global afterAll hook
afterAll(() => {
    console.log('All tests completed');
});
