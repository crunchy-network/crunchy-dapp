import axios from "axios";
import tzdomains from "./../../utils/tezos-domains";

export default {
  async fetchBurnRecords({ commit, state }) {
    if (!state.loading) {
      commit("updateBurnRecordsLoading", true);
      axios
        .get(
          `https://api.tzkt.io/v1/tokens/transfers?to=${state.contract}&sort.desc=id&limit=100`
        )
        .then(async (resp) => {
          const transactionIds = [];

          for (const [i, transfer] of resp.data.entries()) {
            resp.data[i].from.domain = tzdomains.resolveAddressToName(
              transfer.from.address,
              transfer.from.alias || ""
            );

            transactionIds.push(transfer.transactionId);
          }

          const txRes = (
            await axios.get(
              `https://api.tzkt.io/v1/operations/transactions?id.in=${transactionIds.join(
                ","
              )}&select=id,hash,status`
            )
          ).data;
          for (const [i, transfer] of resp.data.entries()) {
            const tx = txRes.find((el) => el.id === transfer.transactionId);
            if (tx) {
              resp.data[i].status = tx.status;
              resp.data[i].hash = tx.hash;
            }
          }

          commit("updateBurnRecords", resp.data);
          commit("updateBurnRecordsLoading", false);
        });
    }
  },
};
