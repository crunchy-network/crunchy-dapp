import {
  addSlippageToleranceToRoute,
  addSlippageToleranceToWeightedRoute,
  findBestRoute,
  findBestWeightedRoute,
  getAllCombinations,
} from "../lib/SwapRouter";
import { ROUTING_FEE_RATIO } from "../components/swapConfig";
import ipfs from "./ipfs";
import farmUtils from "./farm";

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

const getBestTrade = (form, routePairs) => {
  const { inputToken, outputToken, inputAmount, slippageTolerance } = form;
  if (
    !inputToken.assetSlug ||
    !outputToken.assetSlug ||
    !inputAmount ||
    !routePairs.length > 0
  )
    return undefined;
  const combos = getAllCombinations(
    inputToken.assetSlug,
    outputToken.assetSlug,
    routePairs
  );
  if (combos.length < 1) {
    console.log("no combos");
    return undefined;
  }
  const bestRoute = findBestRoute(
    inputAmount * ROUTING_FEE_RATIO,
    combos,
    slippageTolerance
  );
  const weightedCombos = routePairs.filter(
    (p) =>
      p.a.assetSlug === inputToken.assetSlug &&
      p.b.assetSlug === outputToken.assetSlug
  );
  if (weightedCombos.length > 1) {
    const bestWeightedRoute = findBestWeightedRoute(
      inputAmount * ROUTING_FEE_RATIO,
      weightedCombos
    );
    if (bestWeightedRoute.outputAmount > bestRoute.outputAmount) {
      return addSlippageToleranceToWeightedRoute(
        bestWeightedRoute,
        slippageTolerance
      );
    }
  }

  return addSlippageToleranceToRoute(bestRoute, slippageTolerance);
};

export { buildTokenListFromWalletAndPriceFeed, getBestTrade };
