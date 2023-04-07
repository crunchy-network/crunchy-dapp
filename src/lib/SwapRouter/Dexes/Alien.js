const { default: BigNumber } = require("bignumber.js");
const { isTez, convertToMuTez } = require("../utils.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const FEE_DENOMINATOR = new BigNumber(1000000000000000000n);

function getFees(fees) {
  const { buyback, stake, dev, lp, helper } = fees;
  const interfaceFee = fees.interface;

  return buyback.plus(stake).plus(interfaceFee).plus(dev).plus(lp).plus(helper);
}

function calcFees(pair) {
  return getFees(pair.fee).div(FEE_DENOMINATOR);
}

const roundOutput = (output, pair) => {
  const decimalMover = Math.pow(10, pair.b.decimals);
  const bigNumber = parseFloat(Math.floor(output * decimalMover));
  return bigNumber / decimalMover;
};

function getSwapOutput(input, pair) {
  const inputAfterFee = input * (1 - calcFees(pair));
  const output = getAmmSwapOutput(inputAfterFee, pair);
  const toRet = roundOutput(output, pair);

  return toRet;
}

const directTransaction = (dex, trade, walletAddres, input, output) => {
  const tokenAId = trade.a.contractType === "fa2" ? trade.a.tokenId : 0;
  const tokenAType = trade.a.contractType === "fa2" ? "fa2" : "fa12";
  const tokenBId = trade.b.contractType === "fa2" ? trade.b.tokenId : 0;
  const tokenBType = trade.b.contractType === "fa2" ? "fa2" : "fa12";

  return [
    dex.contract.methods
      .swap(
        [
          {
            operation: {
              buy: [["unit"]],
            },
            pair: {
              token_a_address: trade.a.tokenAddress,
              token_a_id: tokenAId,
              token_a_type: {
                [`${tokenAType}`]: [["unit"]],
              },
              token_b_address: trade.b.tokenAddress,
              token_b_id: tokenBId,
              token_b_type: {
                [`${tokenBType}`]: [["unit"]],
              },
            },
          },
        ],
        input,
        output,
        walletAddres,
        "tz1SB6rA5pJmRJCeRQZPDykR8RFAzgcjF5bZ",
      )
      .toTransferParams({
        mutez: true,
      }),
  ];
};

const invertTransaction = (dex, trade, walletAddres, input, output) => {
  const tokenAId = trade.a.contractType === "fa2" ? trade.a.tokenId : 0;
  const tokenAType = trade.a.contractType === "fa2" ? "fa2" : "fa12";
  const tokenBId = trade.b.contractType === "fa2" ? trade.b.tokenId : 0;
  const tokenBType = trade.b.contractType === "fa2" ? "fa2" : "fa12";

  return [
    dex.contract.methods
      .swap(
        [
          {
            operation: {
              sell: [["unit"]],
            },
            pair: {
              token_a_address: trade.b.tokenAddress,
              token_a_id: tokenBId,
              token_a_type: {
                [`${tokenBType}`]: [["unit"]],
              },
              token_b_address: trade.a.tokenAddress,
              token_b_id: tokenAId,
              token_b_type: {
                [`${tokenAType}`]: [["unit"]],
              },
            },
          },
        ],
        input,
        output,
        walletAddres,
        "tz1SB6rA5pJmRJCeRQZPDykR8RFAzgcjF5bZ",
      )
      .toTransferParams({
        mutez: true,
      }),
  ];
};

const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  console.log(trade, input, output)
  const transfers =
    trade.direction === "Direct"
      ? directTransaction(dex, trade, walletAddres, input, output)
      : invertTransaction(dex, trade, walletAddres, input, output);

  if (!isTez(trade.a)) {
    return addTokenApprovalOperators(
      trade,
      walletAddres,
      input,
      transfers,
      tezos
    );
  }
  return transfers;
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
