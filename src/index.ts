import express from "express";
import {
  getFilms,
  getFilmsByCategory,
  deleteCustomer,
  addCustomer,
} from "./interface";
import { StatusCode } from "./constants";
import { validateNewCustomer } from "./validation";

const PORT = 3000;

const app = express();

app.get("/filmsByCategory", async (req, res, next) => {
  const categoryName = req.query["category_name"];

  if (typeof categoryName !== "string") {
    res
      .status(400)
      .send(`Invalid category_name query param; must be a string.`);
  } else {
    getFilmsByCategory(categoryName)
      .then(({ status, data }) => res.status(status).send(data))
      .catch(next);
  }
});

app.post("/customers", (req, res, next) => {
  const customer = req.query;
  const customerValid = validateNewCustomer(customer);
  if (!customerValid) {
    res.status(400).send(`Invalid query params.`);
  } else {
    addCustomer(customer)
      .then(({ status, data }) => res.status(status).send(data))
      .catch(next);
  }
});

app.delete("/customers/:customerId(\\d+)", (req, res, next) => {
  deleteCustomer(parseInt(req.params.customerId))
    .then(({ status, data }) => res.status(status).send(data))
    .catch(next);
});

app.get("/films", (req, res, next) => {
  const { title, length } = req.query;

  if (
    (title && typeof title !== "string") ||
    (length && typeof length !== "string")
  ) {
    res.status(StatusCode.BAD_REQUEST).send("Invalid query params.");
  } else {
    getFilms({ title, length })
      .then(({ status, data }) => res.status(status).send(data))
      .catch(next);
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
