import axios from "axios";
import BigNumber from "bignumber.js";
import coingecko from "./coingecko";
import ipfs from "./ipfs";


export default {
  async fetchAssetsBal(pkh) {
    // return array for token balances and filtered data

    const assets = [];
    try {
      // Fetch all token balance linked to an address
      let { data: balances } = await axios.get(
        `https://staging.api.tzkt.io/v1/tokens/balances?account=${pkh}&balance.gt=0&limit=10000&select=token,balance`
      );

      // Fetch the currrent price of xtz in USD to multiply the price of tokens
      const usdMul = await coingecko.getXtzUsdPrice();

      // Check if address has CRUNCH token , if the address doesnot, i will append the token data
      if (
        balances.filter(
          (val) =>
            val.token?.contract?.address ===
            process.env.VUE_APP_CONTRACTS_CRUNCH
        ).length < 1
      ) {
        balances.push({
          token: {
            token_id: 0,
            contract: { address: process.env.VUE_APP_CONTRACTS_CRUNCH },
            metadata: {
              thumbnail_uri:
                "https://ipfs.fleek.co/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq",
              symbol: "CRUNCH",
              decimals: 8,
            },
          },
          balance: new BigNumber(0),
        });
      }

      // Check if address has crDAO token , if the address doesnot, i will append the token data
      if (
        balances.filter(
          (val) =>
            val.token?.contract?.address === process.env.VUE_APP_CONTRACTS_CRDAO
        ).length < 1
      ) {
        balances.push({
          token: {
            contract: { address: process.env.VUE_APP_CONTRACTS_CRDAO },
            token_id: 0,
            metadata: {
              thumbnail_uri:
                "https://ipfs.fleek.co/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u",
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
      balances = balances.filter(
        (val) =>
          !val.token?.metadata?.artifactUri &&
          (val?.token?.metadata?.symbol || val?.token?.contract?.alias) &&
          !val.toke?.metadata?.formats
      );

      // map through all the balances to sort data
      for (let i = 0; i < balances.length; i++) {
        // get current price of token
        const currentPrice =
          prices.filter(
            (val) => val.tokenAddress === balances[i]?.token?.contract?.address
          ).length === 1
            ? prices.filter(
                (val) =>
                  val.tokenAddress === balances[i]?.token?.contract?.address
              )[0]?.currentPrice
            : prices
                .filter(
                  (val) =>
                    val.tokenAddress === balances[i]?.token?.contract?.address
                )
                .filter(
                  (val) => val.symbol === balances[i]?.token?.metadata?.symbol
                ).length > 0
            ? prices
                .filter(
                  (val) =>
                    val.tokenAddress === balances[i]?.token?.contract?.address
                )
                .filter(
                  (val) => val.symbol === balances[i]?.token?.metadata?.symbol
                )[0]?.currentPrice
            : false;

        const tokenid =
          prices.filter(
            (val) => val.tokenAddress === balances[i]?.token?.contract?.address
          ).length === 1
            ? prices.filter(
                (val) =>
                  val.tokenAddress === balances[i]?.token?.contract?.address
              )[0]?.tokenId
            : prices
                .filter(
                  (val) =>
                    val.tokenAddress === balances[i]?.token?.contract?.address
                )
                .filter(
                  (val) => val.symbol === balances[i]?.token?.metadata?.symbol
                ).length > 0
            ? prices
                .filter(
                  (val) =>
                    val.tokenAddress === balances[i]?.token?.contract?.address
                )
                .filter(
                  (val) => val.symbol === balances[i]?.token?.metadata?.symbol
                )[0]?.tokenId
            : false;
        // get token uri from prices :: This is because  balance does not return  some tokens thumbnail
        const thumbnailUri =
          prices.filter(
            (val) => val.tokenAddress === balances[i]?.token?.contract?.address
          ).length === 1
            ? prices.filter(
                (val) =>
                  val.tokenAddress === balances[i]?.token?.contract?.address
              )[0]?.thumbnailUri
            : prices
                .filter(
                  (val) =>
                    val.tokenAddress === balances[i]?.token?.contract?.address
                )
                .filter(
                  (val) => val.symbol === balances[i]?.token?.metadata?.symbol
                ).length > 0
            ? prices
                .filter(
                  (val) =>
                    val.tokenAddress === balances[i]?.token?.contract?.address
                )
                .filter(
                  (val) => val.symbol === balances[i]?.token?.metadata?.symbol
                )[0]?.thumbnailUri
            : false;

        const decimals =
          prices.filter(
            (val) => val.tokenAddress === balances[i]?.token?.contract?.address
          ).length === 1
            ? prices.filter(
                (val) =>
                  val.tokenAddress === balances[i]?.token?.contract?.address
              )[0]?.decimals
            : prices
                .filter(
                  (val) =>
                    val.tokenAddress === balances[i]?.token?.contract?.address
                )
                .filter(
                  (val) => val.symbol === balances[i]?.token?.metadata?.symbol
                ).length > 0
            ? prices
                .filter(
                  (val) =>
                    val.tokenAddress === balances[i]?.token?.contract?.address
                )
                .filter(
                  (val) => val.symbol === balances[i]?.token?.metadata?.symbol
                )[0]?.decimals
            : false;

        // Data filter and calculations
        const bal = new BigNumber(balances[i]?.balance);
        const balance = bal.div(
          new BigNumber(10).pow(
            balances[i]?.token?.metadata?.decimals ||
              decimals ||
              (balances[i]?.token?.standard !== "fa1.2" ? 6 : 3)
          )
        );

        const price = new BigNumber(currentPrice);
        const priceUsd = new BigNumber(currentPrice).multipliedBy(
          new BigNumber(usdMul)
        );
        const value = balance.multipliedBy(price);
        const valueUsd = balance.multipliedBy(priceUsd);
        const icon = ipfs.transformUri(
          balances[i]?.token?.metadata?.thumbnailUri || thumbnailUri || ""
        );

        const valObj = {
          asset:
            balances[i]?.token?.metadata?.symbol ||
            balances[i]?.token?.contract?.alias,
          icon,
          balance: balance.toNumber(),
          price: price.toNumber(),
          priceUsd: priceUsd.toNumber(),
          valueUsd: valueUsd.toNumber(),
          value: value.toNumber(),
          contract: balances[i]?.token?.contract?.address,
          tokenid,
        };
        if (currentPrice) {
          assets.push(valObj);
        }
      }
      const { data: xtzBal } = await axios.get(
        `https://staging.api.tzkt.io/v1/accounts/${pkh}/balance`
      );

      const balance = new BigNumber(xtzBal).div(new BigNumber(10).pow(6));
      const value = balance.multipliedBy(usdMul);
      // const value = balance.multipliedBy(usdMul);

      assets
        .sort((a, b) => b.value - a.value)
        .unshift({
          asset: "XTZ",
          priceUsd: new BigNumber(usdMul).toNumber(),
          price: balance.toNumber(),
          icon: "data:image/png;base64,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",
          balance: balance.toNumber(),
          contract: "tez",
          value: balance.toNumber(),
          valueUsd: value.toNumber(),
        });
    } catch (e) {
      console.log("/utils/home-wallet", e);
    }
    return assets;
  },

  handleChrunchBal(arr) {
    return arr.filter(
      (val) => val.contract === process.env.VUE_APP_CONTRACTS_CRUNCH
    ).length > 0
      ? arr.filter(
          (val) => val.contract === process.env.VUE_APP_CONTRACTS_CRUNCH
        )[0].balance
      : 0;
  },

  handleCrDAOBal(arr) {
    return arr.filter(
      (val) => val.contract === process.env.VUE_APP_CONTRACTS_CRDAO
    ).length > 0
      ? arr.filter(
          (val) => val.contract === process.env.VUE_APP_CONTRACTS_CRDAO
        )[0].balance
      : 0;
  },

  calcNetworth(arr = []) {
    var sum = 0;

    for (let i = 0; i < arr.length; i++) {
      sum = sum + arr[i].value;
    }
    return sum;
  },

  calcUsdNetworth(arr = []) {
    var sum = 0;

    for (let i = 0; i < arr.length; i++) {
      sum = sum + arr[i].valueUsd;
    }
    return sum;
  },
};
