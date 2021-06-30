import axios from 'axios'

const makeReqest = async (uri) => {
  return axios.get(`${process.env.VUE_APP_COINCAP_API_URL}${uri}`)
}

export default {

  async getXtzUsdVwap () {
    return makeReqest(`/v2/assets/tezos`).then(res => {
      return parseFloat(res.data.data.vwap24Hr);
    });
  }

}
