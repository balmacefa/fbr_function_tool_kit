// // jest-mongodb-setup.js
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { FBR_ChatDBSupport } from "../FBR_ChatDBSupport";

// describe('FBR_ChatDBSupport', () => {
//     let chatDBSupport: FBR_ChatDBSupport;
//     let mongo_server: MongoMemoryServer;

//     beforeEach(async () => {
//         mongo_server = new MongoMemoryServer();
//         await mongo_server.start();
//         const uri = await mongo_server.getUri();
//         // await mongo_server.cleanup({ doCleanup: true });
//         process.env.MONGODB_URI = uri;
//         chatDBSupport = new FBR_ChatDBSupport({});
//         await chatDBSupport.init();
//     });

//     afterEach(async () => {
//         // await mongo_server.cleanup({ doCleanup: true });
//         await chatDBSupport.disconnect();
//     });


//     // Test for create_user_session already defined

//     describe('get_user_sessions', () => {
//         it('should retrieve sessions for a given user', async () => {
//             // Arrange: Create a session to retrieve later
//             const newSessionData = { userId: '1', assistantId: '2', manifestId: '3', title: '4' };
//             await chatDBSupport.create_user_session(newSessionData);

//             // Act: Retrieve sessions for the user
//             const sessions = await chatDBSupport.get_user_sessions('1');

//             // Assert: Check if the retrieved sessions match the created session
//             expect(sessions).toHaveLength(1);
//             expect(sessions[0]).toMatchObject(newSessionData);
//         });
//         it('should return undefined if the session does not exist', async () => {
//             // Arrange: Use a non-existent session ID
//             const nonExistentSessionId = 'nonExistentSessionId';

//             // Act: Attempt to retrieve the non-existent session
//             const session = await chatDBSupport.get_session(nonExistentSessionId);

//             // Assert: The session should be undefined
//             expect(session).toBeFalsy();
//         });
//     });

//     describe('get_session', () => {
//         it('should retrieve a specific session by id', async () => {
//             // Arrange: Create a session to retrieve later
//             const newSessionData = { userId: '1', assistantId: '2', manifestId: '3', title: '4' };
//             const createdSession = await chatDBSupport.create_user_session(newSessionData);

//             // Act: Retrieve the specific session
//             const session = await chatDBSupport.get_session(createdSession._id.toString());

//             // Assert: Check if the retrieved session matches the created session
//             expect(session).toMatchObject(newSessionData);
//         });
//     });

//     describe('update_session_threadId', () => {
//         it('should update the threadId of a session', async () => {
//             // Arrange: Create a session and define a new threadId
//             const newSessionData = { userId: '1', assistantId: '2', manifestId: '3', title: '4' };
//             const createdSession = await chatDBSupport.create_user_session(newSessionData);
//             const newThreadId = 'newThreadId';

//             // Act: Update the session's threadId
//             const updatedSession = await chatDBSupport.update_session_threadId(createdSession._id.toString(), newThreadId);

//             // Assert: Check if the updated session has the new threadId
//             expect(updatedSession).toHaveProperty('threadId', newThreadId);
//         });
//     });

//     // ... other tests as needed

//     afterAll(async () => {
//         await mongo_server.stop();
//     });
// });


