import axios from 'axios';
import lodash from 'lodash';
import { initChart } from './func.js';
// axios.put('/api/v1/auth/login/pass', {
//   password: 'suxi15253545',
//   username: '13269556118'
// }).then(()=>{
  axios.post('/api/v1/data/simu/product/netvalue', {
    product_id: 'P047914'
  }).then((res) => {
    const items = lodash.get(res, 'data.result.items', []);
    if(items.length === 0){
      console.log('no data');
      return;
    }
    initChart(items.reverse())
  })
// });

