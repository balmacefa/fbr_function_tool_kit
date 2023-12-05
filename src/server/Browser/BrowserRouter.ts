/**
 * Module for managing browser sessions and executing actions.
 * @module BrowserRouter
 */
import { z } from 'zod';
import { publicProcedure, router } from '../router/trpc';
import { BrowserManager } from './BrowserManager';

const browserManager = new BrowserManager();

export const BrowserRouter = router({
    generateBrowserSession: publicProcedure.query(() => {
        // OpenAPI schema could be included depending on how your framework integrates with OpenAPI.
        // This is a placeholder; specific implementation will depend on your setup.
        return browserManager.createBrowser();
    }),

    executeActions: publicProcedure
        .input(z.object({
            title: z.string(),
            sessionId: z.string(),
            actions: z.array(z.string())
        })).output(z.string())
        .mutation(({ input }) => {
            const { sessionId, actions } = input;
            const browser = browserManager.getBrowser(sessionId);

            actions.forEach(action => {
                // Implementation depends on how actions are defined and executed
                // Example: browser.enqueueAction(action.key, action.func);
            });

            browser.executeActions();
            return `
            Template response in markdown format.
            # Title.
            # video and image of the browser actions.
            ## Subtitle.
            ### Subsubtitle.
            `;
        }),
});
