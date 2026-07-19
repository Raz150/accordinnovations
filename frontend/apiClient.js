import axios from 'axios';

const apiClient = axios.create({
  // We use a relative URL to leverage the Vite proxy
  baseURL: '/api', 
});

export default apiClient;