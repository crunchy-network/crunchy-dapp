const FA1_2 = require("./fa1.2");
const FA2 = require("./fa2");

const isFA2 = (token) => {
  return token.contractType === "fa2";
};

const isFA1 = (token) => {
  return token.contractType === "fa1.2";
};
const addTokenApprovalOperators = async (
  trade,
  wallet,
  input,
  transfers,
  tezos
) => {
  if (isFA2(trade.a)) {
    return await FA2.addApprovalOperators(
      tezos,
      trade.a,
      wallet,
      trade.dexAddress,
      transfers
    );
  } else if (isFA1(trade.a)) {
    return await FA1_2.addApprovalOperators(
      tezos,
      trade.a,
      wallet,
      trade.dexAddress,
      input,
      transfers
    );
  } else {
    throw new Error(`Unsupported Token Type ${trade.a.contractType}`);
  }
};

module.exports = { addTokenApprovalOperators };
