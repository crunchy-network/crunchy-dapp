import _ from "lodash";
import { getContract, getBatch } from "./../../utils/tezos";

export default {
  async createToken({ state, rootState }, params) {
    const buyBackAndBurnContract = await getContract(
      state.buyBackAndBurnAddress
    );

    const batch = await getBatch()
      .withTransfer({ to: buyBackAndBurnContract, amount: 5 })
      .withContractCall(
        farmContract.methods.create(
          // poolToken
          params.poolToken.tokenAddress,
          params.poolToken.tokenId,
          params.poolToken.tokenType,
          "unit",

          // rewardToken
          params.rewardToken.tokenAddress,
          params.rewardToken.tokenId,
          params.rewardToken.tokenType,
          "unit",

          // rewardSupply
          params.rewardSupply,

          // rewardPerSec
          params.rewardPerSec,

          // startTime, endTime
          params.startTime.toISOString(),
          params.endTime.toISOString(),

          // lockDuration
          params.lockDuration,

          // bonuses
          _.orderBy(bonuses, "endTime", "asc"),

          // serviceFeeId
          params.serviceFeeId
        )
      )
      .withContractCall(
        params.rewardToken.tokenType === "fa2"
          ? rewardToken.methods.update_operators([
              {
                remove_operator: {
                  owner: rootState.wallet.pkh,
                  operator: state.contract,
                  token_id: params.rewardToken.tokenId,
                },
              },
            ])
          : rewardToken.methods.approve(state.contract, 0)
      )
      .withContractCall(
        crnchy.methods.update_operators([
          {
            remove_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: 0,
            },
          },
        ])
      );

    const tx = await batch.send();
    return tx.confirmation();
  },
};
