import * as Ajv from "ajv";

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: "all"
});


const userProperties = {
  firstName: {
    type: "string"
  },
  lastName: {
    type: "string"
  },
  email: {
    type: "string",
    format: "email"
  },
  password: {
    type: "string"
  },
  phoneNumber: {
    type: "string"
  }
};

export const createValidator = ajv.compile({
  type: "object",
  required: ["firstName", "email"],
  properties: userProperties
});
