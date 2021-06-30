import axios from 'axios'

const makeReqest = async (uri) => {
  return axios.get(`${process.env.VUE_APP_TZSTATS_API_URL}${uri}`)
}

export default {

  async getXtzUsdVwap () {
    return makeReqest(`/markets/tickers`).then(res => {
      let quotes = [];
      for (const quote of res.data) {
        if (quote.pair === 'XTZ_USD') {
          quotes.push(quote.vwap);
        }
      }
      return quotes.reduce((acc, next) => acc + next) / quotes.length;
    });
  }

}
