import { getPool } from "./postgres";
import { StatusCode } from "./constants";
import type { Film, Customer, NewCustomer } from "./types";

const NEW_CUSTOMER_ADDRESS_KEYS: (keyof NewCustomer)[] = [
  "address",
  "address2",
  "district",
  "city_id",
  "postal_code",
  "phone",
];
const NEW_CUSTOMER_CUSTOMER_KEYS: (keyof NewCustomer)[] = [
  "store_id",
  "first_name",
  "last_name",
  "email",
];

export const getFilmsByCategory = async (categoryName: string) => {
  // NOTE: case insensitive
  const { rows } = await getPool().query<Omit<Film, "length">>(`
    SELECT film.film_id, film.title, film.description, film.rental_rate
    FROM film
      INNER JOIN film_category ON film.film_id = film_category.film_id
      INNER JOIN category ON category.category_id = film_category.category_id
    WHERE UPPER(category."name") = '${categoryName.toUpperCase()}'
  `);

  return { status: StatusCode.OK, data: rows };
};

export const deleteCustomer = async (customerId: number) => {
  const { rows } = await getPool().query<Pick<Customer, "address_id">>(`
    DELETE FROM customer
      WHERE customer_id = ${customerId}
      RETURNING address_id
  `);
  const addressId = rows[0]?.address_id;

  if (typeof addressId === "undefined") {
    return {
      status: StatusCode.NOT_FOUND,
      data: `No customer found with customer_id ${customerId}.`,
    };
  }

  await getPool()
    .query(`DELETE FROM address WHERE address_id = ${addressId}`)
    .catch((err) => {
      // Address is likely used by another customer/staff/store.
      console.warn(`Failed to delete address ${addressId}: ${err}`);
    });

  return { status: StatusCode.OK, data: "OK" };
};

export const getFilms = async (opts: { title?: string; length?: string }) => {
  let query = `
    SELECT film.film_id, film.title, film.length, category."name" AS category, "language"."name" AS "language"
    FROM film
      INNER JOIN film_category ON film.film_id=film_category.film_id
      INNER JOIN category ON category.category_id=film_category.category_id
      INNER JOIN "language" ON film.language_id="language".language_id
  `;

  if (opts.title) {
    // NOTE: case sensitive
    query += ` WHERE film.title LIKE '%${opts.title}%'`;
  }
  if (opts.length) {
    query += ` ${opts.title ? "AND" : "WHERE"} film.length < ${opts.length}`;
  }

  const { rows } = await getPool().query<
    Pick<Film, "film_id" | "title" | "length"> & {
      category: string;
      language: string;
    }
  >(query);

  return { status: StatusCode.OK, data: rows };
};

export const addCustomer = async (customer: NewCustomer) => {
  // Check for existing address.
  const existingAddressResult = await getPool().query<
    Pick<Customer, "address_id">
  >(`
    SELECT address_id FROM address
    WHERE ${NEW_CUSTOMER_ADDRESS_KEYS.map(
      (key) => `${key} = '${customer[key]}'`,
    ).join(" AND ")}
  `);

  let addressId = existingAddressResult.rows[0]?.address_id;

  if (typeof addressId === "undefined") {
    // Add new address.
    const addressResult = await getPool().query<Pick<Customer, "address_id">>(`
      INSERT INTO address(${NEW_CUSTOMER_ADDRESS_KEYS.join(", ")})
      VALUES (${NEW_CUSTOMER_ADDRESS_KEYS.map(
        (key) => `'${customer[key]}'`,
      ).join(", ")})
      RETURNING address_id
    `);
    addressId = addressResult.rows[0].address_id;
  }

  // Add new customer.
  const entries = {
    ...Object.fromEntries(
      NEW_CUSTOMER_CUSTOMER_KEYS.map((key) => [key, `'${customer[key]}'`]),
    ),
    address_id: addressId,
    active: 1,
  };
  const customerResult = await getPool().query(`
    INSERT into customer(${Object.keys(entries).join(", ")})
    VALUES (${Object.values(entries).join(", ")})
    RETURNING *
  `);

  return { status: StatusCode.OK, data: customerResult.rows[0] };
};
