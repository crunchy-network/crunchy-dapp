const axios = require("axios");

const getPlentyStableDexes = async () => {
  const resp = await axios.get("https://crunchyapi.plentydefi.com/stableswap");
  const dexAddresses = [];
  const toRet = [];
  for (var i = 0; i < resp.data.length; i++) {
    const dex = resp.data[i];
    if (!dexAddresses.includes(dex.address)) {
      dexAddresses.push(dex.address);
      toRet.push(dex);
    }
  }

  return toRet;
};

module.exports = {
  getPlentyStableDexes,
};
