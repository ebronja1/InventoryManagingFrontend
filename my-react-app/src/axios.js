// src/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5181', // Replace with your API base URL
  withCredentials: true, // This is important to send cookies along with requests
});

export default axiosInstance;

