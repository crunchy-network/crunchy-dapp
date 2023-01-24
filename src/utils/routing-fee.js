import { ROUTING_FEE_RATIO } from "../components/swapConfig";
import { Quipuswap } from "../lib/SwapRouter/Dexes";
const convertToMuTez = (amount, token) => {
  return Math.floor(amount * Math.pow(10, token.decimals));
};

const getQuipuDex = (swapPairs, token) => {
  console.log(swapPairs[0], token);
  return swapPairs.find(
    (p) =>
      p.dex === "Quipuswap" &&
      p.a.assetSlug === token.assetSlug &&
      p.b.assetSlug === "tez"
  );
};

const sendTezToBuybackAndBurnAddress = (fee, inputToken) => {
  return [
    {
      amount: convertToMuTez(fee, inputToken),
      to: process.env.VUE_APP_DEX_AGGREGATE_TEZ_DESTINATION,
      mutez: true,
    },
  ];
};

const makeTradeObject = (inputToken, fee, quipuDex) => {
  const slippageTolerance = 0.85;
  const tez = {
    tokenSymbol: "XTZ",
    type: "tez",
    tokenAddress: "tez",
    tokenId: 0,
    assetSlug: "tez",
    decimals: 6,
  };
  const output = Quipuswap.getSwapOutput(fee, quipuDex);

  return {
    a: inputToken,
    b: tez,
    input: fee,
    minOut: output * slippageTolerance,
    dexAddress: quipuDex.dexAddress,
  };
};

const swapTokenForTezAndSendToTreasury = async (
  quipuDex,
  inputToken,
  sender,
  fee,
  tezos
) => {
  const contract = await tezos.contract.at(quipuDex.dexAddress);
  const trade = makeTradeObject(inputToken, fee, quipuDex);

  const op = await Quipuswap.buildDexOperation(
    { contract },
    trade,
    sender,
    tezos,
    process.env.VUE_APP_DEX_AGGREGATE_TEZ_DESTINATION
  );
  return op;
};

const sendShitcoinToTreasury = async (inputToken, sender, fee, tezos) => {
  const assetContract = await tezos.contract.at(inputToken.tokenAddress);
  if (!assetContract) {
    throw new Error("no asset contract");
  }
  if (inputToken.contractType === "fa2") {
    return [
      assetContract.methods
        .transfer([
          {
            from_: sender,
            txs: [
              {
                to_: process.env.VUE_APP_DEX_AGGREGATE_TOKEN_DESTINATION,
                token_id: inputToken.tokenId,
                amount: convertToMuTez(fee, inputToken),
              },
            ],
          },
        ])
        .toTransferParams({ mutez: true }),
    ];
  }
  if (inputToken.contractType === "fa1.2") {
    return [
      assetContract.methods
        .transfer(
          sender,
          process.env.VUE_APP_DEX_AGGREGATE_TOKEN_DESTINATION,
          convertToMuTez(fee, inputToken)
        )
        .toTransferParams({ mutez: true }),
    ];
  }
  throw Error(`Unknown token type: ${inputToken.contractType}`);
};

const buildRoutingFeeOperation = async (
  sender,
  route,
  inputAmount,
  tezos,
  swapPairs
) => {
  if (ROUTING_FEE_RATIO === 1) {
    return [];
  }

  let inputToken;
  if (Array.isArray(route.slippageTrades[0])) {
    inputToken = route.slippageTrades[0][0].a;
  } else {
    inputToken = route.slippageTrades[0].a;
  }

  if (inputToken.decimals === 0) {
    return [];
  }
  const fee = route.inputAmount / ROUTING_FEE_RATIO - route.inputAmount;

  if (fee < 0) {
    throw Error(`invalid fee, can't be negative, ${fee}`);
  }

  if (inputToken.assetSlug === "tez") {
    return sendTezToBuybackAndBurnAddress(fee, inputToken);
  }

  const quipuDex = getQuipuDex(swapPairs, inputToken);
  if (quipuDex) {
    return swapTokenForTezAndSendToTreasury(
      quipuDex,
      inputToken,
      sender,
      fee,
      tezos
    );
  }
  return sendShitcoinToTreasury(inputToken, sender, fee, tezos);
};

export { buildRoutingFeeOperation };
