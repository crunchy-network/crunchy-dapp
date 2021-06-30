export default {

  updateBurnRecordsLoading (state, isLoading) {
    state.loading = isLoading;
  },

  updateBurnRecords (state, records) {
    state.records = records;
  }

}
