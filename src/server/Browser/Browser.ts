type ActionFunction = () => void;

interface Action {
    key: string;
    func: ActionFunction;
}


//TODO: pop the first element of the queue and execute it, them ask if return true or false, if true, execute the next one,
// if false, stop the execution and return the excuted actions and the error message.
// Add gpot vision to the project and make the tests with it to see if it works.
// todo create a func and giveen a mouse x and y poisition, it will return suraounding elements. 
//  and visual representation of the selectors / xpath of the elements.
export class Browser {
    private actionQueue: Action[] = [];

    enqueueAction(key: string, func: ActionFunction) {
        this.actionQueue.push({ key, func });
    }

    executeActions() {
        for (const action of this.actionQueue) {
            action.func();
        }
        // TODO: save the excuted actions, create method to get them.
        // clear the queue
        this.actionQueue = [];
        // save the result state of the browser.
    }

    // Browser actions returns: with description of the action, the result of the action, and the error if any.
    // get screenshot
    // get html
    // get cookies
    // get current url
    // record video
    // stop recording video
    // get video session 

    // Other methods as needed...
}
