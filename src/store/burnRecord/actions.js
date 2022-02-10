import axios from "axios";
import tzdomains from "./../../utils/tezos-domains";

export default {
  async fetchBurnRecords({ commit, state }) {
    if (!state.loading) {
      commit("updateBurnRecordsLoading", true);
      axios
        .get(
          `https://api.better-call.dev/v1/tokens/mainnet/transfers/${state.contract}`
        )
        .then((resp) => {
          for (const [i, transfer] of resp.data.transfers.entries()) {
            resp.data.transfers[i].fromDomain = tzdomains.resolveAddressToName(
              transfer.from
            );
          }

          commit("updateBurnRecords", resp.data.transfers);
          commit("updateBurnRecordsLoading", false);
        });
    }
  },
};
