import axios from "axios";
import BigNumber from "bignumber.js";
import ipfs from "./ipfs";
// import teztools from "./teztools";
import knownContracts from "../knownContracts.json";
import tzkt from "./tzkt";
import tokenTracker from "./token-tracker";

const SKIP_CONTRACTS = [
  "KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo_0",
  "KT1Rpviewjg82JgjGfAKFneSupjAR1kUhbza_0",
];

// const getTokenId = (priceObj, token) => {
//   if (priceObj) {
//     if (priceObj.tokenId !== undefined) {
//       return priceObj.tokenId;
//     }
//     if (priceObj.type !== undefined) {
//       return 0;
//     }
//   }
//   if (token) {
//     if (token.tokenId !== undefined) {
//       return token.tokenId;
//     }
//   }
//   return undefined;
// };

const getPrice = (address, tokenId, priceFeed) => {
  return priceFeed[`${address}_${tokenId || 0}`];
};

const generateObjktQuery = (contractList) => {
  return `
    query contracts {
      fa(where: {contract: {_in: ${contractList}}}) {
        collection_id
        contract
        description
        editions
        logo
        metadata
        name
        collection_type
      }
    }
  `;
};

const getOBJKTCollections = async (contractList) => {
  const query = generateObjktQuery(JSON.stringify(contractList));
  const response = await axios.post("https://data.objkt.com/v3/graphql", {
    query,
  });

  return response.data.data.fa;
};

function getImgUri(uri, collection) {
  if (!uri) {
    return "https://res.cloudinary.com/melvin-manni/image/upload/v1660322565/fgpwgssbhq2bfmsjerur.png";
  }
  if (uri.startsWith("ipfs")) {
    return uri.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
  } else {
    return uri;
  }
}

function getObjktLink(token) {
  return `https://objkt.com/asset/${token.contract.address}/${token.tokenId}`;
}

export default {
  async fetchNFts(pkh) {
    const { data: balances } = await axios.get(
      `https://api.tzkt.io/v1/tokens/balances?account=${pkh}&balance.gt=0&limit=10000&select=token,balance`
    );
    const isToken = (val) => {
      return (
        !val.token?.metadata?.artifactUri &&
        (val?.token?.metadata?.symbol || val?.token?.contract?.alias) &&
        !val.toke?.metadata?.formats
      );
    };
    const groupedNFTs = {};

    balances.forEach((val) => {
      if (!isToken(val)) {
        const contractAddress = val.token.contract.address;
        if (groupedNFTs[contractAddress] !== undefined) {
          groupedNFTs[contractAddress].push(val);
        } else {
          groupedNFTs[contractAddress] = [val];
        }
      }
    });

    const populateKnownCollectionFields = (collection, found) => {
      const toRet = { ...collection };
      toRet.thumbnailUri = found.thumbnailUrl;
      toRet.art = found.thumbnailUrl || found.discoverUrl;
      toRet.name = found.name;
      return toRet;
    };

    const populateObjktData = (collection, data) => {
      collection.name = data.name;
      collection.art = getImgUri(data.logo, true);
    };

    const buildNFTData = (nfts) => {
      const toRet = [];

      nfts.forEach((nft) => {
        const metadata = nft.token.metadata;
        if (metadata) {
          const imgURI = metadata.displayUri || metadata.thumbnailUri || "";
          const contractDetails = nft.token.contract;
          toRet.push({
            collectionName:
              contractDetails?.alias || contractDetails?.address || "",
            name: metadata.name,
            art: getImgUri(imgURI),
            objkLink: getObjktLink(nft.token),
            links: [
              {
                name: "OBJKT",
                icon: "https://tezos.art/objkt.png",
                url: getObjktLink(nft.token),
              },
            ],
          });
        }
      });
      return toRet;
    };
    const unknownCollections = [];
    const collections = Object.keys(groupedNFTs).map((k) => {
      try {
        let collection = {
          address: k,
          thumbnailUri:
            "https://res.cloudinary.com/melvin-manni/image/upload/v1660322565/fgpwgssbhq2bfmsjerur.png",
          art: "https://res.cloudinary.com/melvin-manni/image/upload/v1660322565/fgpwgssbhq2bfmsjerur.png",
          items: [],
          name: "",
        };
        const found = knownContracts.find((kc) => kc.address.includes(k));

        if (found) {
          collection = populateKnownCollectionFields(collection, found);
        } else {
          unknownCollections.push(k);
        }
        collection.items = buildNFTData(groupedNFTs[k]);
        return collection;
      } catch (e) {
        console.log("error building group", groupedNFTs[k]);
        console.log(e);
      }
    });
    if (unknownCollections.length > 0) {
      const objktData = await getOBJKTCollections(unknownCollections);
      objktData.forEach((d) => {
        const collection = collections.find((c) => c.address === d.contract);
        populateObjktData(collection, d);
      });
    }
    const stillMissingArt = collections.filter((c) => c.art === undefined);
    stillMissingArt.forEach((col) => {
      col.name = col.items[0]?.collectionName;
      col.art = col.items[0]?.art;
    });
    return {
      collections: collections
        .filter((c) => c.items.length > 0)
        .sort((a, b) => b.items.length - a.items.length),
    };
  },
  async getNftCollectionData(nfts, address) {
    return nfts.find((nft) => nft.address === address);
  },

  async fetchAssetsBal(pkh) {
    // return array for token balances and filtered data

    const assets = [];
    try {
      // Fetch all token balance linked to an address
      let { data: balances } = await axios.get(
        `https://api.tzkt.io/v1/tokens/balances?account=${pkh}&balance.gt=0&limit=10000&select=token,balance`
      );
      
      // Fetch the currrent price of xtz in USD to multiply the price of tokens
      const usdMul = await tzkt.getXtzUsdPrice();

      // Check if address has CRUNCH token , if the address doesnot, i will append the token data

      balances.forEach((val, index) => {
        if (
          val.token?.contract?.address ===
            process.env.VUE_APP_CONTRACTS_CRUNCH ||
          val.token?.contract?.address === process.env.VUE_APP_CONTRACTS_CRDAO
        ) {
          delete balances[index];
        }
      });
      // Check if address has crDAO token , if the address doesnot, i will append the token data

      // Get all wallet prices
      // const { contracts: prices } = await teztools.getPricefeed();

      // Get token metadata and prices
      const tokenData = await tokenTracker.getTokenFeed();

      // filter out NFTs by checking for artifactURI and token symbol or alias
      const tokens = [];

      const isToken = (val) => {
        return (
          !val.token?.metadata?.artifactUri &&
          (val?.token?.metadata?.symbol || val?.token?.contract?.alias) &&
          !val.toke?.metadata?.formats
        );
      };

      balances.forEach((val) => {
        if (isToken(val)) {
          tokens.push(val);
        }
      });

      balances = tokens;

      // map through all the balances to sort data
      for (let i = 0; i < balances.length; i++) {
        const tokenId = `${balances[i]?.token?.contract?.address}_${
          balances[i]?.token?.tokenId || 0
        }`;
        const priceObj = tokenData[tokenId];

        // const tokenClose = queryDipdup.filterTokenClose(tokenId, tokensClose);
        const currentPrice = priceObj?.currentPrice || false;
        const tokenid = priceObj?.tokenId;
        // get token uri from prices :: This is because  balance does not return  some tokens thumbnail
        const thumbnailUri = priceObj?.thumbnailUri || false;

        const decimals = priceObj?.decimals || false;

        // Data filter and calculations
        const bal = new BigNumber(balances[i]?.balance);
        const balance = bal.div(
          new BigNumber(10).pow(
            decimals ||
              balances[i]?.token?.metadata?.decimals ||
              (balances[i]?.token?.standard !== "fa1.2" ? 6 : 3)
          )
        );

        const price = new BigNumber(currentPrice);
        const priceUsd = new BigNumber(currentPrice).times(usdMul);
        const value = balance.multipliedBy(price);
        const valueUsd = balance.multipliedBy(priceUsd);
        const icon = ipfs.transformUri(
          balances[i]?.token?.metadata?.thumbnailUri || thumbnailUri || ""
        );
        // const pricePair = priceObj?.pairs?.find(
        //   (el) => el.dex === "Quipuswap" && el.sides[1].symbol === "XTZ"
        // );
        var assetSlug;
        if (tokenid !== undefined) {
          assetSlug = `${balances[i]?.token?.contract?.address}_${tokenid}`;
        } else {
          assetSlug = balances[i]?.token?.contract?.address;
        }
        const valObj = {
          asset:
            priceObj?.symbol ||
            balances[i]?.token?.metadata?.symbol ||
            balances[i]?.token?.contract?.alias,
          icon,
          balance: balance.toNumber(),
          price: price.toNumber(),
          name: priceObj?.name,
          priceChange1Day: price
            .minus(priceObj?.dayClose)
            .div(priceObj?.dayClose)
            .times(100)
            .toNumber(),
          priceChange7Day: price
            .minus(priceObj?.weekClose)
            .div(priceObj?.weekClose)
            .times(100)
            .toNumber(),
          priceChange30Day: price
            .minus(priceObj?.monthClose)
            .div(priceObj?.monthClose)
            .times(100)
            .toNumber(),
          /**
           *Calculating % changes in Usd
           */

          priceChange1DayUsd: priceUsd
            .minus(priceObj?.dayCloseUsd)
            .div(priceObj?.dayCloseUsd)
            .times(100)
            .toNumber(),
          priceChange7DayUsd: priceUsd
            .minus(priceObj?.weekCloseUsd)
            .div(priceObj?.weekCloseUsd)
            .times(100)
            .toNumber(),
          priceChange30DayUsd: priceUsd
            .minus(priceObj?.monthCloseUsd)
            .div(priceObj?.monthCloseUsd)
            .times(100)
            .toNumber(),
          priceUsd: priceUsd.toNumber(),
          valueUsd: valueUsd.toNumber(),
          value: value.toNumber(),
          contract: balances[i]?.token?.contract?.address,
          tokenid,
          assetSlug,
          decimals: balances[i]?.token?.metadata?.decimals,
        };

        if (priceObj) {
          if (!SKIP_CONTRACTS.includes(tokenId)) {
            assets.push(valObj);
          }
        }
      }
      const {
        data: { balance, frozenDeposit },
      } = await axios.get(`https://api.tzkt.io/v1/accounts/${pkh}`);

      const bal = new BigNumber(balance).div(new BigNumber(10).pow(6));
      const value = bal.multipliedBy(usdMul);
      const frozen = new BigNumber(frozenDeposit || 0).div(
        new BigNumber(10).pow(6)
      );
      // const value = balance.multipliedBy(usdMul);

      assets
        .sort((a, b) => b?.value - a?.value)
        .unshift({
          asset: "XTZ",
          priceUsd: new BigNumber(usdMul).toNumber(),
          price: 1,
          icon: "data:image/png;base64,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",
          balance: bal.toNumber(),
          frozenDeposits: frozen.toNumber(),
          availableBalance: bal.minus(frozen).toNumber(),
          contract: "tez",
          name: "tez",
          value: bal.toNumber(),
          valueUsd: value.toNumber(),
          assetSlug: "tez",
          decimals: 6,
        });
    } catch (e) {
      console.log("/utils/home-wallet", e);
    }
    return { assets };
  },

  async getQuipuLp(balances, xtzUsd, priceFeed) {
    const quipu = {
      totalValue: 0,
      totalValueUsd: 0,
      positionsCount: 0,
      positions: [],
    };
    const lp = [];
    try {
      // Fetch all token balance linked to an address
      const [
        { data: fa1Factory },
        { data: fa1FactoryOld },
        { data: fa2Factory },
        { data: fa2FactoryOld },
        { data: fa2FactoryOld3 },
      ] = await Promise.all([
        axios.get(
          "https://api.tzkt.io/v1/accounts/KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw/contracts?limit=10000"
        ),
        axios.get(
          "https://api.tzkt.io/v1/accounts/KT1Lw8hCoaBrHeTeMXbqHPG4sS4K1xn7yKcD/contracts?limit=10000"
        ),
        axios.get(
          "https://api.tzkt.io/v1/accounts/KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ/contracts?limit=10000"
        ),
        axios.get(
          "https://api.tzkt.io/v1/accounts/KT1GDtv3sqhWeSsXLWgcGsmoH5nRRGJd8xVc/contracts?limit=10000"
        ),
        axios.get(
          "https://api.tzkt.io/v1/accounts/KT1SwH9P1Tx8a58Mm6qBExQFTcy2rwZyZiXS/contracts?limit=10000"
        ),
      ]);

      const lpBal = balances.filter(
        (val) =>
          fa2Factory.find(
            (contract) => contract.address === val.token?.contract?.address
          ) ||
          fa2FactoryOld.find(
            (contract) => contract.address === val.token?.contract?.address
          ) ||
          fa2FactoryOld3.find(
            (contract) => contract.address === val.token?.contract?.address
          ) ||
          fa1Factory.find(
            (contract) => contract.address === val.token?.contract?.address
          ) ||
          fa1FactoryOld.find(
            (contract) => contract.address === val.token?.contract?.address
          )
      );

      for (let i = 0; i < lpBal.length; i++) {
        const address = lpBal[i].token.contract.address;

        const {
          data: { storage: tokenStorage },
        } = await tzkt.getContractStorage(address);
        // console.log(address, "Address", lpBal[i]);

        const tokenObjkt = {
          address,
          balance: lpBal[i].balance,
          lpBalance: new BigNumber(lpBal[i].balance).div(1e6).toNumber(),
          tokenAddress: tokenStorage.token_address,
          tokenId: tokenStorage.token_id,
          tezPool: tokenStorage.tez_pool,
          tokenPool: tokenStorage.token_pool,
          totalReward: tokenStorage.total_reward,
          totalSupply: tokenStorage.total_supply,
        };

        const tokenMetaData = getPrice(
          tokenObjkt.tokenAddress,
          tokenObjkt.tokenId,
          priceFeed
        );

        if (tokenMetaData) {
          if (tokenMetaData.thumbnailUri)
            tokenMetaData.thumbnailUri = ipfs.transformUri(
              tokenMetaData.thumbnailUri
            );

          const xtzSide = new BigNumber(tokenObjkt.balance)
            .times(tokenObjkt.tezPool)
            .div(tokenObjkt.totalSupply);

          const tokenSide = new BigNumber(tokenObjkt.balance)
            .times(tokenObjkt.tokenPool)
            .div(tokenObjkt.totalSupply);

          tokenObjkt.xtzSide = xtzSide.div(1e6).toNumber();

          tokenObjkt.xtzSideUsd = tokenObjkt.xtzSide * xtzUsd;

          tokenObjkt.tokenSide = tokenSide
            .div(10 ** tokenMetaData.decimals)
            .toNumber();

          tokenObjkt.totalValue = tokenObjkt.xtzSide * 2;

          tokenObjkt.totalValueUsd = tokenObjkt.totalValue * xtzUsd;

          lp.push({ ...tokenMetaData, ...tokenObjkt });

          quipu.totalValue += tokenObjkt.totalValue;
          quipu.totalValueUsd += tokenObjkt.totalValueUsd;
        }
      }

      quipu.positions = lp;
      quipu.positionsCount = lp.length;

      return quipu;
    } catch (error) {
      console.log(error);
    }
  },

  async getVortexyLp(balances = [], xtzUsd, pkh, priceFeed) {
    const vortex = {
      totalValue: 0,
      totalValueUsd: 0,
      positionsCount: 0,
      positions: [],
    };
    const lp = [];
    try {
      const [{ data: youXtz }, { data: hdaoXtz }, { data: gifXtz }] =
        await Promise.all([
          axios.get(
            `https://api.tzkt.io/v1/tokens/balances?token.contract=KT1W6FrLW9d8Y6NVQzx487KCXrTGK1RWtJNh&account=${pkh}&balance.ne=0`
          ),
          axios.get(
            `https://api.tzkt.io/v1/tokens/balances?token.contract=KT1RMfFJphfVwdbaJx7DhFrZ9du5pREVSEyN&account=${pkh}&balance.ne=0`
          ),
          axios.get(
            `https://api.tzkt.io/v1/contracts/KT1SjZYVjdBCBurUUA6W5Qymri2pWJGyu7Tt/bigmaps/tokens/keys?key=${pkh}&active=true`
          ),
        ]);

      // Fetch all token balance linked to an address

      const [{ data: manager1 }, { data: fa1Factory }, { data: fa2Factory }] =
        await Promise.all([
          axios.get(
            "https://api.tzkt.io/v1/accounts/KT1PwnTa2f1Uac958RFTk6i6EecPNgJrtHKv/contracts?limit=10000"
          ),
          axios.get(
            "https://api.tzkt.io/v1/accounts/KT1UnRsTyHVGADQWDgvENL3e9i6RMnTVfmia/contracts?limit=10000"
          ),
          axios.get(
            "https://api.tzkt.io/v1/accounts/KT1JW8AeCbvshGkyrsyu1cWa5Vt7GSpNKrUz/contracts?limit=10000"
          ),
        ]);

      const lpBal = balances.filter((val) => {
        return (
          manager1.find(
            (contract) => contract.address === val.token?.contract?.address
          ) ||
          fa2Factory.find(
            (contract) => contract.address === val.token?.contract?.address
          ) ||
          fa1Factory.find(
            (contract) => contract.address === val.token?.contract?.address
          )
        );
      });

      if (youXtz.length === 1) {
        lpBal.push(...youXtz);
      }

      if (hdaoXtz.length === 1) {
        lpBal.push(...hdaoXtz);
      }

      if (gifXtz.length === 1) {
        const [{ value: gifXtzBal }] = gifXtz;
        lpBal.push({
          balance: gifXtzBal,
          token: {
            contract: {
              address: "KT1SjZYVjdBCBurUUA6W5Qymri2pWJGyu7Tt",
            },
          },
        });
      }

      for (let i = 0; i < lpBal.length; i++) {
        const { data: tkContract } = await tzkt.getContractStorage(
          lpBal[i].token.contract.address
        );

        const address = tkContract.admin;

        const { data: tokenStorage } = await tzkt.getContractStorage(address);

        const tokenObjkt = {
          address: address,
          balance: lpBal[i].balance,
          lpBalance: new BigNumber(lpBal[i].balance).div(1e6).toNumber(),
          tokenAddress: tokenStorage.tokenAddress,
          tokenId: tokenStorage.tokenId,
          tezPool: tokenStorage.xtzPool,
          tokenPool: tokenStorage.tokenPool,
          totalSupply: tokenStorage.lqtTotal,
        };

        const tokenMetaData = getPrice(
          tokenObjkt.tokenAddress,
          tokenObjkt.tokenId,
          priceFeed
        );

        if (tokenMetaData) {
          console.log(tokenMetaData);
          // if (tokenMetaData.thumbnailUri) {
          tokenMetaData.thumbnailUri = ipfs.transformUri(
            tokenMetaData.thumbnailUri
          );
          // }

          const xtzSide = new BigNumber(tokenObjkt.balance)
            .times(tokenObjkt.tezPool)
            .div(tokenObjkt.totalSupply);

          const tokenSide = new BigNumber(tokenObjkt.balance)
            .times(tokenObjkt.tokenPool)
            .div(tokenObjkt.totalSupply);

          tokenObjkt.xtzSide = xtzSide.div(1e6).toNumber();

          tokenObjkt.xtzSideUsd = tokenObjkt.xtzSide * xtzUsd;

          tokenObjkt.tokenSide = tokenSide
            .div(10 ** tokenMetaData.decimals)
            .toNumber();

          tokenObjkt.totalValue = tokenObjkt.xtzSide * 2;

          tokenObjkt.totalValueUsd = tokenObjkt.totalValue * xtzUsd;

          lp.push({ ...tokenMetaData, ...tokenObjkt });

          vortex.totalValue += tokenObjkt.totalValue;
          vortex.totalValueUsd += tokenObjkt.totalValueUsd;
        }
      }

      vortex.positions = lp;
      vortex.positionsCount = lp.length;

      return vortex;
    } catch (error) {
      console.log(error);
    }
  },

  async getSpicySwapLp(balances = [], xtzUsd, priceFeed) {
    const decimals = 18;
    const spicy = {
      totalValue: 0,
      totalValueUsd: 0,
      positionsCount: 0,
      positions: [],
    };

    const lp = [];

    try {
      const { data: spicyRouter } = await axios.get(
        "https://api.tzkt.io/v1/accounts/KT1PwoZxyv4XkPEGnTqWYvjA1UYiPTgAGyqL/contracts?limit=10000"
      );

      const lpBal = balances.filter(
        (val) =>
          spicyRouter.find(
            (contract) => contract.address === val.token?.contract?.address
          ) && val.token?.metadata?.symbol === "SSLP"
      );

      for (let i = 0; i < lpBal.length; i++) {
        const address = lpBal[i].token.contract.address;

        const { data: tokenStorage } = await tzkt.getContractStorage(address);

        const {
          data: [lpTotalSupply],
        } = await tzkt.getContractBigMapKeys(
          address,
          "assets.token_total_supply",
          { select: "value" }
        );

        // console.log(`Contract: ${address}`);
        // console.log(`LP Total: ${lpTotalSupply}`);

        const tokenObjkt = {
          address: address,
          balance: lpBal[i].balance,
          lpBalance: new BigNumber(lpBal[i].balance)
            .div(10 ** decimals)
            .toFixed(),
          token0: tokenStorage.token0,
          token1: tokenStorage.token1,
          token0Pool: tokenStorage.reserve0,
          token1Pool: tokenStorage.reserve1,
          totalSupply: lpTotalSupply,
        };

        const token0MetaData = getPrice(
          tokenObjkt.token0.fa2_address,
          tokenObjkt.token0.token_id,
          priceFeed
        );
        const token1MetaData = getPrice(
          tokenObjkt.token1.fa2_address,
          tokenObjkt.token1.token_id,
          priceFeed
        );

        if (token0MetaData && token1MetaData) {
          token0MetaData.thumbnailUri = ipfs.transformUri(
            token0MetaData.thumbnailUri
          );

          token1MetaData.thumbnailUri = ipfs.transformUri(
            token1MetaData.thumbnailUri
          );

          const token0 = new BigNumber(tokenObjkt.balance)
            .times(tokenObjkt.token0Pool)
            .div(tokenObjkt.totalSupply);

          const token1 = new BigNumber(tokenObjkt.balance)
            .times(tokenObjkt.token1Pool)
            .div(tokenObjkt.totalSupply);

          tokenObjkt.token0Side = token0
            .div(10 ** token0MetaData.decimals)
            .toNumber();
          tokenObjkt.token1Side = token1
            .div(10 ** token1MetaData.decimals)
            .toNumber();

          tokenObjkt.totalValue =
            tokenObjkt.token0Side * token0MetaData.currentPrice +
            tokenObjkt.token1Side * token1MetaData.currentPrice;

          tokenObjkt.totalValueUsd = tokenObjkt.totalValue * xtzUsd;

          lp.push({
            ...tokenObjkt,
            ...{ token0: token0MetaData, token1: token1MetaData },
          });

          spicy.totalValue += tokenObjkt.totalValue;
          spicy.totalValueUsd += tokenObjkt.totalValueUsd;
        }
      }

      spicy.positions = lp;
      spicy.positionsCount = lp.length;

      return spicy;
    } catch (error) {
      console.log(error);
    }
  },

  async getPlentyLp(balances = [], xtzUsd, priceFeed) {
    const plenty = {
      totalValue: 0,
      totalValueUsd: 0,
      positionsCount: 0,
      positions: [],
    };

    const lp = [];

    try {
      const { data: plentyCreator } = await axios.get(
        "https://api.tzkt.io/v1/accounts/tz1NbDzUQCcV2kp3wxdVHVSZEDeq2h97mweW/contracts?limit=10000"
      );

      const lpBal = balances.filter(
        (val) =>
          plentyCreator.find(
            (contract) => contract.address === val.token?.contract?.address
          ) && val.token?.metadata?.symbol === "PLP"
      );

      for (let i = 0; i < lpBal.length; i++) {
        const address = lpBal[i].token.contract.address;
        const { data: lpStorage } = await tzkt.getContractStorage(address);
        const { data: tokenStorage } = await tzkt.getContractStorage(
          lpStorage.exchangeAddress
        );

        const decimals = lpBal[i].token?.metadata?.decimals || 6;

        const tokenObjkt = {
          address: address,
          balance: lpBal[i].balance,
          lpBalance: new BigNumber(lpBal[i].balance)
            .div(10 ** decimals)
            .toFixed(),
          token0: {
            address: tokenStorage.token1Address,
            tokenId: tokenStorage.token1Id,
          },
          token1: {
            address: tokenStorage.token2Address,
            tokenId: tokenStorage.token2Id,
          },
          token0Pool: tokenStorage.token1_pool,
          token1Pool: tokenStorage.token2_pool,
          totalSupply: tokenStorage.totalSupply,
        };

        const token0MetaData = getPrice(
          tokenObjkt.token0.address,
          tokenObjkt.token0.tokenId,
          priceFeed
        );
        const token1MetaData = getPrice(
          tokenObjkt.token1.address,
          tokenObjkt.token1.tokenId,
          priceFeed
        );

        if (token0MetaData && token1MetaData) {
          token0MetaData.thumbnailUri = ipfs.transformUri(
            token0MetaData.thumbnailUri
          );

          token1MetaData.thumbnailUri = ipfs.transformUri(
            token1MetaData.thumbnailUri
          );

          const token0 = new BigNumber(tokenObjkt.balance)
            .times(tokenObjkt.token0Pool)
            .div(tokenObjkt.totalSupply);

          const token1 = new BigNumber(tokenObjkt.balance)
            .times(tokenObjkt.token1Pool)
            .div(tokenObjkt.totalSupply);

          tokenObjkt.token0Side = token0
            .div(10 ** token0MetaData.decimals)
            .toNumber();
          tokenObjkt.token1Side = token1
            .div(10 ** token1MetaData.decimals)
            .toNumber();

          tokenObjkt.totalValue =
            tokenObjkt.token0Side * token0MetaData.currentPrice +
            tokenObjkt.token1Side * token1MetaData.currentPrice;

          tokenObjkt.totalValueUsd = tokenObjkt.totalValue * xtzUsd;

          lp.push({
            ...tokenObjkt,
            ...{ token0: token0MetaData, token1: token1MetaData },
          });

          plenty.totalValue += tokenObjkt.totalValue;
          plenty.totalValueUsd += tokenObjkt.totalValueUsd;
        }
      }

      plenty.positions = lp;
      plenty.positionsCount = lp.length;

      return plenty;
    } catch (error) {
      console.log(error);
    }
  },

  async getBakersLp(balances = [], xtzUsd, priceFeed) {
    const sirius = {
      totalValue: 0,
      totalValueUsd: 0,
      positionsCount: 0,
      positions: [],
    };

    const lp = [];

    try {
      const lpBal = balances.filter(
        (val) =>
          val.token?.contract?.address ===
          "KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo"
      );

      const { data: tokenStorage } = await tzkt.getContractStorage(
        "KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5"
      );

      for (let i = 0; i < lpBal.length; i++) {
        const address = lpBal[i].token.contract.address;

        const tokenObjkt = {
          address: address,
          balance: lpBal[i].balance,
          lpBalance: new BigNumber(lpBal[i].balance).toNumber(),
          tokenAddress: tokenStorage.tokenAddress,
          tezPool: tokenStorage.xtzPool,
          tokenPool: tokenStorage.tokenPool,
          totalSupply: tokenStorage.lqtTotal,
        };

        const tokenMetaData = getPrice(
          tokenObjkt.tokenAddress,
          undefined,
          priceFeed
        );

        if (tokenMetaData) {
          tokenMetaData.thumbnailUri = ipfs.transformUri(
            tokenMetaData.thumbnailUri
          );

          const xtzSide = new BigNumber(tokenObjkt.balance)
            .times(tokenObjkt.tezPool)
            .div(tokenObjkt.totalSupply);

          const tokenSide = new BigNumber(tokenObjkt.balance)
            .times(tokenObjkt.tokenPool)
            .div(tokenObjkt.totalSupply);

          tokenObjkt.xtzSide = xtzSide.div(1e6).toNumber();

          tokenObjkt.xtzSideUsd = tokenObjkt.xtzSide * xtzUsd;

          tokenObjkt.tokenSide = tokenSide
            .div(10 ** tokenMetaData.decimals)
            .toNumber();

          tokenObjkt.totalValue = tokenObjkt.xtzSide * 2;

          tokenObjkt.totalValueUsd = tokenObjkt.totalValue * xtzUsd;

          lp.push({ ...tokenMetaData, ...tokenObjkt });

          sirius.totalValue += tokenObjkt.totalValue;
          sirius.totalValueUsd += tokenObjkt.totalValueUsd;
        }
      }

      sirius.positions = lp;
      sirius.positionsCount = lp.length;
      return sirius;
    } catch (error) {
      console.log(error);
    }
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
      if (arr[i]?.value && !Number.isNaN(arr[i]?.value)) {
        sum = sum + arr[i]?.value;
      }
    }
    return sum;
  },

  calcUsdNetworth(arr = []) {
    var sum = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.value && !Number.isNaN(arr[i]?.valueUsd)) {
        sum = sum + arr[i]?.valueUsd;
      }
    }
    return sum;
  },
};
