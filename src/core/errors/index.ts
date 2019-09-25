export class ValidationError extends Error {
    private static convertAjvErrors(errors): string {
        return errors.map(e => `${e.dataPath} - ${e.message}`).join(', ')
    }

    constructor(errors: any) {
        super(ValidationError.convertAjvErrors(errors));
    }
}