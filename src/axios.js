import axios from 'axios';

const instance = axios.create({
  withCredentials: true, // ensures cookies are sent with every request
});

export default instance;