
import axios from "axios";

const guestApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_Backend_Url,
  withCredentials: false,
});

export default guestApi;
