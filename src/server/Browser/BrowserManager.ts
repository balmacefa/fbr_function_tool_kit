/**
 * Module for managing browser sessions and executing actions.
 * @module BrowserRouter
 */
import { v4 as uuidv4 } from 'uuid'; // Ensure you have installed the 'uuid' package
import { Browser } from './Browser';

export class BrowserManager {
    private browsers: Record<string, Browser> = {};

    /**
     * Creates a new browser instance and returns its session ID.
     * @returns {string} The session ID.
     */
    createBrowser(): string {
        const sessionId = uuidv4(); // Generates a unique session ID
        this.browsers[sessionId] = new Browser();
        return sessionId;
    }

    /**
     * Retrieves a browser instance by its session ID.
     * @param {string} sessionId - The session ID.
     * @returns {Browser} The browser instance.
     */
    getBrowser(sessionId: string): Browser {
        return this.browsers[sessionId];
    }

    // Other management methods...
}