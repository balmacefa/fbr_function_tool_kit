// Mock API functions
const mockCreateSession = () => {
    // Simulate API call to create a session
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ sessionId: '123' }); // Mock session ID
        }, 1000); // Simulate network delay
    });
};

const mockSendMessage = (context: any, event: { message: any; }) => {
    // Simulate sending a message
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ message: event.message, timestamp: new Date() });
        }, 500);
    });
};

const mockFetchMessages = (context: { messageHistory: any; }) => {
    // Simulate fetching messages
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([...context.messageHistory, { message: 'New message', timestamp: new Date() }]);
        }, 500);
    });
};

const mockSessionStatus = (context: any) => {
    // Simulate session status check
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ status: 'active' }); // or 'completed'
        }, 500);
    });
};
