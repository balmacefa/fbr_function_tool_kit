import { Err, Ok, Result } from 'ts-results';

export class BaseProjectError extends Error {
    constructor(message: string, public data?: any) {
        super(message);
        this.name = BaseProjectError.name;
        this.data = data;
    }
}

// SMS This is not a Sinpe Notification error
export class FBR_ErrorManager extends BaseProjectError {
    constructor(message: string, public data: any = {}) {
        super(message);
        this.name = FBR_ErrorManager.name;
        this.data = data;
    }
}

/**
 * Checks whether the SMS body includes 'SINPE'. Returns an `Ok` value if it does, or an `Err` containing a `NotSinpeNotificationBodyError` if it does not.
 *
 * @param sms The SMS to check.
 * @returns An `Ok` value if the SMS body includes 'SINPE', or an `Err` containing a `NotSinpeNotificationBodyError` if it does not.
 */
export const execute_with_project_error = async (fnc: () => Promise<boolean>, errorMessage = ''): Promise<Result<void, BaseProjectError>> => {
    try {
        const r = await fnc();
        if (r) {
            return Ok(undefined);
        } else {
            return Err(new FBR_ErrorManager(errorMessage, {}));
        }
    } catch (error) {
        const errorMessage = `${error}`;
        return Err(new FBR_ErrorManager(errorMessage, {}));
    }

};