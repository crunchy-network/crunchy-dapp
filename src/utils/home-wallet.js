import axios from "axios";
import BigNumber from "bignumber.js";
import coingecko from "./coingecko";
import ipfs from "./ipfs";

// const makeReqest = async ({ contract, id }) => {
//   return axios.get(`${process.env.VUE_APP_TEZTOOLS_API_URL}/token/${contract}${id ? "_" + id : ""}/price`);
// };

export default {
  async fetchAssetsBal(pkh) {
    // return array for token balances and filtered data

    const assets = [];
    try {
      // Fetch all token balance linked to an address
      let { data: balances } = await axios.get(`https://staging.api.tzkt.io/v1/tokens/balances?account=${pkh}&balance.gt=0&limit=10000&select=token,balance`);

      // Fetch the currrent price of xtz in USD to multiply the price of tokens
      const usdMul = await coingecko.getXtzUsdPrice();

      // Check if address has CRUNCH token , if the address doesnot, i will append the token data
      if (balances.filter((val) => val.token?.contract?.address === process.env.VUE_APP_CONTRACTS_CRUNCH).length < 1) {
        balances.push({
          token: {
            token_id: 0,
            contract: { address: process.env.VUE_APP_CONTRACTS_CRUNCH },
            metadata: {
              thumbnail_uri: "https://ipfs.fleek.co/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq",
              symbol: "CRUNCH",
              decimals: 8,
            },
          },
          balance: new BigNumber(0),
        });
      }

      // Check if address has crDAO token , if the address doesnot, i will append the token data
      if (balances.filter((val) => val.token?.contract?.address === process.env.VUE_APP_CONTRACTS_CRDAO).length < 1) {
        balances.push({
          token: {
            contract: { address: process.env.VUE_APP_CONTRACTS_CRDAO },
            token_id: 0,
            metadata: {
              thumbnail_uri: "https://ipfs.fleek.co/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u",
              symbol: "crDAO",
              decimals: 8,
            },
          },
          balance: new BigNumber(0),
        });
      }

      // Get all wallet prices
      const {
        data: { contracts: prices },
      } = await axios.get("https://api.teztools.io/v1/prices");

      // filter out NFTs by checking for artifactURI and token symbol or alias
      balances = balances.filter((val) => !val.token?.metadata?.artifactUri && (val?.token?.metadata?.symbol || val?.token?.contract?.alias));

      // map through all the balances to sort data
      for (let i = 0; i < balances.length; i++) {
        // get current price of token
        const currentPrice =
          prices.filter((val) => val.tokenAddress === balances[i]?.token?.contract?.address).length > 0
            ? prices.filter((val) => val.tokenAddress === balances[i]?.token?.contract?.address)[0]?.currentPrice
            : new BigNumber(0);

        // get token uri from prices :: This is because  balance does not return  some tokens thumbnail
        const thumbnailUri =
          prices.filter((val) => val.tokenAddress === balances[i].token?.contract.address).length > 0 &&
          prices.filter((val) => val.tokenAddress === balances[i].token?.contract.address)[0]?.thumbnailUri;

        // Data filter and calculations
        const bal = new BigNumber(balances[i]?.balance);
        const balance = bal.div(new BigNumber(10).pow(balances[i]?.token?.metadata?.decimals || (balances[i]?.token?.standard !== "fa1.2" ? 6 : 3)));

        const price = new BigNumber(currentPrice).multipliedBy(new BigNumber(usdMul));
        const value = balance.multipliedBy(price);
        const icon = ipfs.transformUri(balances[i]?.token?.metadata?.thumbnailUri || thumbnailUri || "");

        const valObj = {
          asset: balances[i]?.token?.metadata?.symbol || balances[i]?.token?.contract?.alias,
          icon,
          balance: balance.toNumber(),
          price: price.toNumber(),
          value: value.toNumber(),
          contract: balances[i]?.token?.contract?.address,
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
