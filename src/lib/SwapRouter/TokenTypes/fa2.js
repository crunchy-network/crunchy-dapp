const { fromOpOpts } = require("../utils");

const updateOperators = (fa2, updates) => {
  return fa2.methods
    .update_operators(
      updates.map(({ type, tokenId, from, to }) => ({
        [type]: {
          token_id: tokenId,
          owner: from,
          operator: to,
        },
      }))
    )
    .toTransferParams(fromOpOpts(undefined));
};
const addApprovalOperators = async (tezos, token, from, to, transfers) => {
  const fa2 = await tezos.contract.at(token.tokenAddress);

  return [
    updateOperators(fa2, [
      { type: "add_operator", from, to, tokenId: token.tokenId },
    ]),
    ...transfers,
    updateOperators(fa2, [
      {
        type: "remove_operator",
        from,
        to,
        tokenId: token.tokenId,
      },
    ]),
  ];
};

module.exports = { addApprovalOperators };
