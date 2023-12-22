import { NewCustomer } from "./types";

export function validateNewCustomer(
  customer: unknown,
): customer is NewCustomer {
  // TODO: validate e.g. with JSON schema (ajv)
  return true;
}
