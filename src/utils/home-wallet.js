import axios from "axios";
import BigNumber from "bignumber.js";
import coingecko from "./coingecko";
import ipfs from "./ipfs";

const makeReqest = async ({ contract, id }) => {
  return axios.get(`${process.env.VUE_APP_TEZTOOLS_API_URL}/token/${contract}_${id}/price`);
};

// const sortArrObjDesc = (array = [], param = "") => {
//   for (let i = 0; i < array.length; i++) {
//     if (i !== 0) {
//       const t = array[i];
//       if (array[i - 1][param] > array[i][param]) {
//         array[i] = array[i - 1];
//         array[i - 1] = t;
//       }
//     }
//   }
//   return array;
// };

export default {
  async fetchAssetsBal(pkh) {
    const assets = [];
    try {
      const {
        data: { balances },
      } = await axios.get(`https://api.better-call.dev/v1/account/mainnet/${pkh}/token_balances`);
      const usdMul = await coingecko.getXtzUsdPrice();
      if (balances.filter((val) => val.contract === process.env.VUE_APP_CONTRACTS_CRUNCH) < 1) {
        balances.push({
          contract: process.env.VUE_APP_CONTRACTS_CRUNCH,
          balance: new BigNumber(0),
          thumbnail_uri: "https://ipfs.fleek.co/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq",
          token_id: 0,
          symbol: "CRUNCH",
          decimals: 8,
        });
      }

      if (balances.filter((val) => val.contract === process.env.VUE_APP_CONTRACTS_CRDAO) < 1) {
        balances.push({
          contract: process.env.VUE_APP_CONTRACTS_CRDAO,
          balance: new BigNumber(0),
          thumbnail_uri: "https://ipfs.fleek.co/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u",
          token_id: 0,
          symbol: "crDAO",
          decimals: 8,
        });
      }

      for (let i = 0; i < balances.length; i++) {
        const bal = new BigNumber(balances[i]?.balance);
        const balance = bal.div(new BigNumber(10).pow(balances[i]?.decimals));

        const {
          data: { currentPrice },
        } = await makeReqest({
          contract: balances[i]?.contract,
          id: balances[i]?.token_id,
        });

        const price = new BigNumber(currentPrice).multipliedBy(new BigNumber(usdMul));
        const value = balance.multipliedBy(price);
        const icon = ipfs.transformUri(balances[i]?.thumbnail_uri);

        const valObj = {
          asset: balances[i]?.symbol,
          icon,
          balance: balance.toNumber(),
          price: price.toNumber(),
          value: value.toNumber(),
          contract: balances[i].contract,
        };
        assets.push(valObj);
      }
    } catch (e) {
      console.log("/utils/home-wallet", e);
    }

    return assets.sort((a, b) => b.value - a.value);
  },

  handleChrunchBal(arr) {
    return arr.filter((val) => val.contract === process.env.VUE_APP_CONTRACTS_CRUNCH) > 0
      ? arr.filter((val) => val.contract === process.env.VUE_APP_CONTRACTS_CRUNCH)[0].balance
      : 0;
  },

  handleCrDAOBal(arr) {
    return arr.filter((val) => val.contract === process.env.VUE_APP_CONTRACTS_CRDAO) > 0
      ? arr.filter((val) => val.contract === process.env.VUE_APP_CONTRACTS_CRDAO)[0].balance
      : 0;
  },

  calcNetworth(arr = []) {
    var sum = 0;

    for (let i = 0; i < arr.length; i++) {
      sum = sum + arr[i].value;
    }
    return sum;
  },
};
