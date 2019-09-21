import * as Ajv from "ajv";

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: "all"
});


const userProperties = {
  firstName: {
    type: "string"
  },
  email: {
    type: "string",
    format: "email"
  },
  phoneNumber: {
    type: "string"
  }
};

export const createValidator = ajv.compile({
  type: "object",
  required: ["firstName", "phoneNumber"],
  properties: userProperties
});

export const feedbackValidator = ajv.compile({
  type: "object",
  required: ["firstName", "phoneNumber", "question"],
  properties: {
    ...userProperties,
    question: {
      type: "string"
    }
  }
});
