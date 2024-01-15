/* eslint-disable prettier/prettier */
import ipfs from "./ipfs";
import farmUtils from "./farm";
import axios from "axios";

const DEX_AGG_API = "https://crunchy-swap-api.metal01.cclabs.tech";

const getAssetSlug = (token) => {
  if (token.assetSlug) return token.assetSlug;
  if (token.symbol === "XTZ") return "tez";
  if (token.type === "fa1.2") {
    return `${token.tokenAddress}_0`;
  }
  if (token.tokenId !== undefined) {
    return `${token.tokenAddress}_${token.tokenId}`;
  }
  return token.tokenAddress;
};

const toTokenListItem = (token) => {
  token = farmUtils.overrideMetadata(token);
  if (token.asset === "XTZ") {
    return token;
  }
  return {
    asset: token.symbol,
    name: token.name,
    icon: ipfs.transformUri(
      token.thumbnailUri ||
        "https://static.thenounproject.com/png/796573-200.png"
    ),
    balance: 0,
    decimals: token.decimals,
    assetSlug: getAssetSlug(token),
    priceUsd: token.usdValue,
  };
};

const addPriceFeedToWalletTokens = (walletTokens, pricefeedTokens) => {
  const existingSlugs = walletTokens.map((t) => t.assetSlug);
  const toAdd = pricefeedTokens
    .filter((p) => !existingSlugs.includes(getAssetSlug(p)))
    .map(toTokenListItem);
  return [...walletTokens, ...toAdd];
};

const buildTokenListWithoutWallet = (pricefeedTokens) => {
  if (pricefeedTokens.length === 0) return [];
  return [...pricefeedTokens.map(toTokenListItem)];
};

const buildTokenListFromWalletAndPriceFeed = (
  walletTokens,
  pricefeedTokens
) => {
  if (walletTokens.length > 0) {
    return addPriceFeedToWalletTokens(walletTokens, pricefeedTokens);
  }
  return buildTokenListWithoutWallet(pricefeedTokens);
};


const getBestTrade = async (form, routePairs, pkh) => {
  // Modify the form to retain only "assetSlug" and "decimals" for both inputToken and outputToken
  const modifiedForm = {
      inputToken: form.inputToken.assetSlug,
      inputAmount: form.inputAmount,
      outputToken: form.outputToken.assetSlug,
      slippageTolerance: form.slippageTolerance,
      pkh: pkh,
    };
  if (
    !modifiedForm.inputToken ||
    !modifiedForm.outputToken ||
    !modifiedForm.inputAmount ||
    !routePairs.length > 0
  )
    return undefined;
  try {
    const response = await axios.post(`${DEX_AGG_API}/findBestRoute`, modifiedForm);

    const { success, currentTrade, transactionParams, error } = response.data;
    if (!success) {
      throw new Error(`Error: ${error}`);
    }

    return { currentTrade, transactionParams };
  } catch (error) {
    throw new Error(`Failed to find the best route: ${error.message}`);
  }
};

export { buildTokenListFromWalletAndPriceFeed, getBestTrade };
