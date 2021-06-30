export default {

  updateWallet (state, updatedState) {
    state.connected = updatedState.connected;
    state.pkh = updatedState.pkh;
    state.pkhDomain = updatedState.pkhDomain;
    state.updateBalanceInt = updatedState.updateBalanceInt;
  },

  updateWalletBalance (state, balance) {
    state.balance = balance;
  }

}
