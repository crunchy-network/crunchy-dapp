import axios from "axios";
import tzdomains from "./../../utils/tezos-domains";

export default {
  async fetchBurnRecords({ commit, state }) {
    if (!state.loading) {
      commit("updateBurnRecordsLoading", true);
      axios
        .get(
          `https://staging.api.tzkt.io/v1/tokens/transfers?token.contract=${state.contract}`
        )
        .then((resp) => {
          console.log(resp);
          for (const [i, transfer] of resp.data.transfers.entries()) {
            resp.data.transfers[i].fromDomain = tzdomains.resolveAddressToName(
              transfer.from
            );
          }

          console.log("\n\n------ begin:  ------");
          console.log(resp.data.transfers);
          console.log("------ end:  ------\n\n");
          commit("updateBurnRecords", resp.data.transfers);
          commit("updateBurnRecordsLoading", false);
        });
    }
  },
};
