const percentToDecimal = (percent) => {
  return (100 - percent) / 100;
};

const secondsFromNow = (s) => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + s);
  return Math.floor(now.getTime() / 1000);
};

const getContractAndStorage = async (address, tezos) => {
  const contract = await tezos.contract.at(address);
  const storage = await contract.storage();
  return { contract, storage };
};

const convertToMuTez = (amount, token) => {
  return Math.floor(amount * Math.pow(10, token.decimals));
};
const fromOpOpts = (tezValue, opts = {}) => {
  return {
    mutez: true,
    amount: tezValue,
    ...opts,
  };
};

const isTez = (token) => {
  return token.assetSlug === "tez";
};
const isToken = (token) => {
  return !isTez(token);
};
const mockTezosNow = () => {
  return Math.floor(Date.now() / 1000);
};

const dateToSeconds = (date) => {
  return Math.floor(date.getTime() / 1000);
};

const isValidDexFee = (feeAmount, pair) => {
  const decimalMover = Math.pow(10, pair.a.decimals);
  const bigNumber = parseFloat(Math.floor(feeAmount * decimalMover));
  const finalFee = bigNumber / decimalMover;
  if (finalFee <= 0) return false;
  return true;
};

module.exports = {
  percentToDecimal,
  secondsFromNow,
  getContractAndStorage,
  convertToMuTez,
  fromOpOpts,
  isToken,
  isTez,
  mockTezosNow,
  dateToSeconds,
  isValidDexFee,
};
