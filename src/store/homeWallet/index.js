import mutations from "./mutations";
import actions from "./actions";

export default {
  state: {
    loading: false,
    loadingStake: false,
    assets: [],
    crunchyStake: {
      protocol: "Crunchy",
      url: "https://app.crunchy.network/#/farms",
      icon: "https://res.cloudinary.com/melvin-manni/image/upload/v1652890962/ibevqo8rwvs0fcopalqp.svg",
      lp: false,
      staked: 0,
      claimable: 0,
      totalValue: 0,
      stakedUsdd: 0,
      claimableUsdd: 0,
      totalValueUsdd: 0,
      data: [],
    },
    quipusStake: {
      protocol: "Quipuswap",
      url: "https://quipuswap.com/",
      icon: "https://res.cloudinary.com/melvin-manni/image/upload/v1654109475/aa6hmwgxec401jikysta.svg",
      lp: true,
      staked: 0,
      claimable: 0,
      totalValue: 0,
      stakedUsdd: 0,
      claimableUsdd: 0,
      totalValueUsdd: 0,
      data: [],
    },
    dogamiStake: {
      protocol: "Dogami",
      url: "https://marketplace.dogami.com/stake",
      icon: "https://res.cloudinary.com/melvin-manni/image/upload/v1655167707/bia2jmizlq1upb2gd5to.svg",
      staked: 0,
      claimable: 0,
      totalValue: 0,
      stakedUsdd: 0,
      claimableUsdd: 0,
      totalValueUsdd: 0,
      data: [],
    },
    gifStake: {
      protocol: "GIF",
      url: "https://tezotopia.com/app/starbase/staking",
      icon: "https://res.cloudinary.com/melvin-manni/image/upload/v1655318339/ibrhctmf97vlo8cgdla6.svg",
      staked: 0,
      claimable: 0,
      totalValue: 0,
      stakedUsdd: 0,
      claimableUsdd: 0,
      totalValueUsdd: 0,
      data: [],
    },
    priceFeed: [],
    netWorth: 0,
    netWorthUsd: 0,
    crunchBal: 0,
    crDaoBal: 0,
  },
  actions,
  mutations,
  getters: {
    getAssets(state) {
      return state.assets;
    },
    getCrunchyStake(state) {
      return state.crunchyStake;
    },
    getStakes(state) {
      const orderedStake = [state.gifStake, state.dogamiStake].sort(
        (a, b) => b.staked - a.staked
      );
      return [state.crunchyStake, ...orderedStake];
    },
  },
};
