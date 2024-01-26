import { getBatch } from "./../../utils/tezos";
import { MichelsonMap } from "@taquito/taquito";
import { char2Bytes } from "@taquito/utils";
import { BigNumber } from "bignumber.js";
import fa2DefiFixedSupply from "./fa2-defi-fixed-supply.json";
import fa2DefiMintable from "./fa2-defi-mintable.json";
import axios from "axios";

const uploadFileToNFTStorage = async (file) => {
  const form = new FormData();
  form.append("asset", file);

  const res = await axios.post("https://upload.crunchy.network/single", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.cid;
};

export default {
  async createTokenContract({ state, rootState }, payload) {
    let {
      tokenName,
      totalSupply,
      tokenSymbol,
      tokenIcon,
      decimals,
      tokenDesc,
      tokenMintableSupply,
      uploadedFile,
    } = payload;

    if (uploadedFile) {
      try {
        const ipfsLink = await uploadFileToNFTStorage(uploadedFile);
        tokenIcon = "ipfs://" + ipfsLink;
        console.log("IPFS Link:", tokenIcon);
        // Handle the IPFS link as needed (e.g., store it in a database)
      } catch (error) {
        console.error("Error uploading to IPFS:", error);
        return { tx: null, error: error };
      }
    }

    const tokenInfo = MichelsonMap.fromLiteral({
      symbol: char2Bytes(String(tokenSymbol)),
      name: char2Bytes(String(tokenName)),
      decimals: char2Bytes(String(decimals)),
      thumbnailUri: char2Bytes(String(tokenIcon)),
      description: char2Bytes(String(tokenDesc)),
    });

    const tokenMetadataBigMap = MichelsonMap.fromLiteral({
      0: {
        token_id: 0,
        token_info: tokenInfo,
      },
    });

    const metadataBigMap = MichelsonMap.fromLiteral({
      "": char2Bytes("tezos-storage:content"),
      // eslint-disable-next-line prettier/prettier
      "content": char2Bytes(`{"name": "${tokenName}","description":"${tokenDesc}"}`),
    });

    const tokenTotalSupplyBigMap = MichelsonMap.fromLiteral({
      0: BigNumber(totalSupply).times(BigNumber(10).pow(decimals)).toNumber(),
    });

    const ledgerBigMap = MichelsonMap.fromLiteral({});
    ledgerBigMap.set(
      [rootState.wallet.pkh, 0],
      BigNumber(totalSupply).times(BigNumber(10).pow(decimals)).toNumber()
    );

    let batch = null;

    if (tokenMintableSupply) {
      batch = getBatch()
        .withTransfer({ to: state.buyBackAndBurnAddress, amount: 10 })
        .withOrigination({
          code: fa2DefiFixedSupply,
          storage: {
            ledger: ledgerBigMap,
            operators: new MichelsonMap(),
            token_total_supply: tokenTotalSupplyBigMap,
            token_metadata: tokenMetadataBigMap,
            metadata: metadataBigMap,
          },
        });
    } else {
      batch = getBatch()
        .withTransfer({ to: state.buyBackAndBurnAddress, amount: 10 })
        .withOrigination({
          code: fa2DefiMintable,
          storage: {
            operators: new MichelsonMap(),
            token_metadata: tokenMetadataBigMap,
            ledger: ledgerBigMap,
            token_total_supply: tokenTotalSupplyBigMap,
            roles: {
              owner: rootState.wallet.pkh,
              pending_owner: null,
            },
            metadata: metadataBigMap,
          },
        });
    }

    const tx = await batch.send();
    return { tx: tx, error: null };
  },
};
