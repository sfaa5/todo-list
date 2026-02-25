import axios from 'axios';

// baseURL is taken from env so it can point at a remote service (e.g. MockAPI.io)
// When running locally you can still use a json-server at http://localhost:4000
const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL,
});