import Axios from 'axios';
import {configs} from '../config/config';

class RequestModule {
  axios = Axios;
  constructor() {
    this.axios = Axios.create({baseURL: configs.baseAPI});
  }
}

export default new RequestModule();
