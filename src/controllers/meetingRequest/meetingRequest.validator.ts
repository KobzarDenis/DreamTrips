import * as Ajv from "ajv";

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: "all"
});


const createProperties = {
  link: {
    type: "string"
  },
  date: {
    type: "string"
  }
};

export const createValidator = ajv.compile({
  type: "object",
  required: ["link", "date"],
  properties: createProperties
});
