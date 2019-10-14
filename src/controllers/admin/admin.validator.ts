import * as Ajv from "ajv";

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: "all"
});


const loginProperties = {
  email: {
    type: "string",
    format: "email"
  },
  password: {
    type: "string"
  }
};

export const loginValidator = ajv.compile({
  type: "object",
  required: ["email", "password"],
  properties: loginProperties
});
