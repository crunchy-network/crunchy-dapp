import { ROUTING_FEE_RATIO } from "../components/swapConfig";
import { Quipuswap } from "../lib/SwapRouter/Dexes";
const convertToMuTez = (amount, token) => {
  return Math.floor(amount * Math.pow(10, token.decimals));
};

const getQuipuDex = (swapPairs, token) => {
  console.log(swapPairs[0], token);
  return swapPairs.find(
    (p) => p.dex === "Quipuswap" && p.a.assetSlug === token.assetSlug
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
    tokenSymbol: "tez",
    type: "tez",
    tokenAddress: "tez",
    decimals: 6,
  };

  return {
    a: inputToken,
    b: tez,
    input: fee,
    minOut: fee * slippageTolerance,
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
    process.env.VUE_APP_DEX_AGGREGATE_TOKEN_DESTINATION
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
  const inputToken = route.slippageTrades[0].a;
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
  } else {
    return sendShitcoinToTreasury(inputToken, sender, fee, tezos);
  }
};

export { buildRoutingFeeOperation };
