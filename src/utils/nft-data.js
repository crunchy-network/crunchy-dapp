import { getTokenMetadata } from "./tezos";

const fetchTokenMetadata = async (token) => {
  return await getTokenMetadata(token.contract.address, token.tokenId);
};

export const loadNftData = async (nfts) => {
  const toRet = [];
  for (var i = 0; i < nfts.length; i++) {
    try {
      const metadata = await fetchTokenMetadata(nfts[i].token);
      toRet.push(metadata);
    } catch {
      console.log("no metadata found");
    }
  }
  return toRet;
};
