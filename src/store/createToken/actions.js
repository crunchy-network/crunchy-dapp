import { getBatch } from "./../../utils/tezos";
import { MichelsonMap } from "@taquito/taquito";
import { char2Bytes } from "@taquito/utils";
import fa2 from "./fa2.json";
import fa12 from "./fa12.json";

export default {
  async createTokenContract({ state, rootState }, payload) {
    const {
      tokenType,
      tokenName,
      totalSupply,
      tokenSymbol,
      tokenIcon,
      decimals,
      tokenDesc,
    } = payload;

    const tokenInfo = MichelsonMap.fromLiteral({
      symbol: char2Bytes(String(tokenSymbol)),
      name: char2Bytes(String(tokenName)),
      decimals: char2Bytes(String(decimals)),
      thumbnailUri: char2Bytes(String(tokenIcon)),
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
      0: Number(totalSupply),
    });

    let batch = null;

    if (tokenType === "FA2") {
      batch = getBatch()
        .withTransfer({ to: state.buyBackAndBurnAddress, amount: 5 })
        .withOrigination({
          code: fa2,
          storage: {
            admin: {
              admin: rootState.wallet.pkh,
              pending_admin: null,
              paused: false,
            },
            assets: {
              ledger: new MichelsonMap(),
              operators: new MichelsonMap(),
              token_total_supply: tokenTotalSupplyBigMap,
              token_metadata: tokenMetadataBigMap,
            },
            metadata: metadataBigMap,
          },
        });
    } else {
      batch = getBatch()
        .withTransfer({ to: state.buyBackAndBurnAddress, amount: 5 })
        .withOrigination({
          code: fa12,
          storage: {
            admin: {
              admin: rootState.wallet.pkh,
              pending_admin: null,
              paused: false,
            },
            assets: {
              ledger: new MichelsonMap(),
              operators: new MichelsonMap(),
              token_metadata: tokenMetadataBigMap,
              total_supply: Number(totalSupply),
            },
            metadata: metadataBigMap,
          },
        });
    }

    const tx = await batch.send();
    return tx;
  },
};
