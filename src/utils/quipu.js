import tzkt from './tzkt';
import { BigNumber } from 'bignumber.js';

export default {

  async estimateTezInCrdao(tez) {
    return tzkt.getContractStorage(process.env.VUE_APP_CONTRACTS_QUIPU_CRDAO)
      .then(res => {
        const storage = res.data.storage;
        const tezValueBN = new BigNumber(tez * 1000000);
        return new BigNumber(1).div(
          tezValueBN
            .times(storage.token_pool)
            .idiv(storage.tez_pool)
            .div(100000000)
          ).toNumber();
      })
  }

}
