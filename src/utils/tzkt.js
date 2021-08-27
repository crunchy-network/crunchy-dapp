import axios from 'axios'

const makeReqest = async (uri, params = {}) => {
  return axios.get(`${process.env.VUE_APP_TZKT_API_URL}${uri}`, { params: { limit: 1000, ...params } })
}

export default {

  async getBigMapKeys (id) {
    return makeReqest(`/v1/bigmaps/${id}/keys`)
  },

  async getContractBigMap (address, name, params = {}) {
    return makeReqest(`/v1/contracts/${address}/bigmaps/${name}`, params)
  },

  async getContractBigMapKeys (address, name, params = {}) {
    return makeReqest(`/v1/contracts/${address}/bigmaps/${name}/keys`, params)
  },

  async getContractStorage (address) {
    return makeReqest(`/v1/contracts/${address}/storage`)
  }

}
