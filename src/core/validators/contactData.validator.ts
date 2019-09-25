import * as Ajv from "ajv";

const ajv = new Ajv({
    allErrors: true,
    removeAdditional: "all"
});

const phoneValidator = ajv.compile({
    type: "object",
    required: ["phoneNumber"],
    properties: {
        phoneNumber: {
            type: "string"
        }
    }
});

const emailValidator = ajv.compile({
    type: "object",
    required: ["email"],
    properties: {
        email: {
            type: "string",
            format: "email"
        }
    }
});

validator.errors = null;
export function validator(data: any, contactType: string) {
    if(contactType === "phoneNumber") {
        if(!phoneValidator(data)) {
            validator.errors = phoneValidator.errors;
            return false;
        }
    } else {
        if(!emailValidator(data)) {
            validator.errors = emailValidator.errors;
            return false;
        }
    }

    return true;
}
