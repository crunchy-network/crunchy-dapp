const { fromOpOpts } = require("../utils");

const isUACErrorMessage = (errMessage) => {
  return Boolean(errMessage?.includes("UnsafeAllowanceChange"));
};

const isUnsafeAllowanceChangeError = (err) => {
  try {
    return (
      isUACErrorMessage(err?.message) ||
      err?.errors?.some(
        (e) =>
          e?.with?.int === "23" ||
          isUACErrorMessage(e?.with?.string) ||
          isUACErrorMessage(e?.with?.args?.[0]?.string)
      )
    );
  } catch {
    return false;
  }
};

const fa12Approve = (contract, spender, value) => {
  return contract.methods
    .approve(spender, value)
    .toTransferParams(fromOpOpts(undefined));
};

const estimateTransfers = (tezos, transfers) => {
  return tezos.estimate.batch(
    transfers.map((tParams) => ({ kind: "transaction", ...tParams }))
  );
};

const addApprovalOperators = async (
  tezos,
  token,
  from,
  to,
  value,
  transfers
) => {
  const tokenContract = await tezos.contract.at(token.tokenAddress);
  const approveParams = fa12Approve(tokenContract, to, value);

  let resetApprove = false;
  try {
    await estimateTransfers(tezos, [approveParams]);
  } catch (err) {
    if (isUnsafeAllowanceChangeError(err)) {
      resetApprove = true;
    }
  }

  return resetApprove
    ? [fa12Approve(tokenContract, to, 0), approveParams, ...transfers]
    : [approveParams, ...transfers];
};

module.exports = { addApprovalOperators };
