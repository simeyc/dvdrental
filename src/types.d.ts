export type Film = {
  film_id: number;
  title: string;
  description: string;
  length: number;
  rental_rate: number;
};

export type Customer = {
  customer_id: number;
  address_id: number;
};

export type NewCustomer = {
  store_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  district: string;
  city_id: number;
  postal_code: string;
};
