export default {
  fmtAddress(address = "") {
    return (
      address.substring(0, 9) + "..." + address.substring(address.length - 3)
    );
  },
  fmtTxId(txId = "") {
    return txId.substring(0, 7) + "..." + txId.substring(txId.length - 8);
  },
};
