import { ROUTING_FEE_RATIO } from "../components/swapConfig";

const convertToMuTez = (amount, token) => {
  return Math.floor(amount * Math.pow(10, token.decimals));
};

const buildRoutingFeeOperation = async (sender, route, inputAmount, tezos) => {
  if (ROUTING_FEE_RATIO === 1) {
    return [];
  }
  const inputToken = route.slippageTrades[0].a;
  const fee = route.inputAmount / ROUTING_FEE_RATIO - route.inputAmount;

  if (fee < 0) {
    throw Error(`invalid fee, can't be negative, ${fee}`);
  }
  if (inputToken.assetSlug === "tez") {
    return [
      {
        amount: convertToMuTez(fee, inputToken),
        to: process.env.VUE_APP_DEX_AGGREGATE_TEZ_DESTINATION,
        mutez: true,
      },
    ];
  }
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
};

export { buildRoutingFeeOperation };
