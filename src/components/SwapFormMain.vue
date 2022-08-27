<template>
  <el-card
    v-loading="isLoading"
    class="swap-form-main-box-card"
    shadow="always"
  >
    <span class="swap-header"> SWAP </span>
    <div class="from-section">
      <span> From</span>
      <span v-if="shouldShowBalance()"
        >Balance:
        {{ vueNumberFormat(getBalanceOfSelectedToken(getSwapForm.inputToken)) }}
      </span>
    </div>

    <div
      v-if="tokenList.length > 0"
      :class="`asset-selection ${buttonDisabled ? 'error' : ''}`"
    >
      <TokenSelectMenu
        :id="'tokenInput'"
        :list="tokenList"
        :on-change="handleInputChange"
        :amount="getSwapForm.inputAmount"
        :selected-token="getSwapForm.inputToken"
      />
      <div v-if="getSwapForm.inputToken" class="token-usd-value">
        ~ ${{ getInputUsdValue() }}
      </div>
    </div>
    <div style="display: flex; width: 100%; height: 30px">
      <div class="percent-input-buttons">
        <div class="error-message-section">{{ errorMessage }}</div>
        <div
          v-if="
            shouldShowBalance() &&
            getBalanceOfSelectedToken(getSwapForm.inputToken) > 0
          "
          class="percent-input-button-section"
        >
          <el-button
            v-for="option in percentOptions"
            :key="option"
            type="text"
            style=""
            class="percent-input-option"
            @click="applyOption(option)"
          >
            {{ option === 100 ? "MAX" : `${option}%` }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="swap-placeholder">
      <div class="swap-image-container">
        <img
          :src="reverseIcon"
          height="20px"
          width="20px"
          style="cursor: pointer"
          @click="reverseSwap"
        />
      </div>
    </div>
    <div class="from-section">
      <span> To(estimate)</span>
      <span v-if="shouldShowBalance()">
        Balance:
        {{
          vueNumberFormat(getBalanceOfSelectedToken(getSwapForm.outputToken))
        }}</span
      >
    </div>
    <div class="asset-selection">
      <TokenSelectMenu
        :id="'tokenOutput'"
        :list="tokenList"
        :on-change="handleOutputChange"
        :amount="handleLargeDecimals(getCurrentTrade.outputAmount)"
        :input-disabled="true"
        :selected-token="getSwapForm.outputToken"
      />
    </div>

    <div v-if="getCurrentTrade.trades" class="from-section">
      <span>Swap Route </span>
    </div>
    <div v-if="getCurrentTrade.trades" class="swap-route-container">
      <div
        v-for="(route, index) in getCurrentTrade.trades"
        :key="`${route.dexAddress}_${index}`"
        style="display: flex"
      >
        <SwapRouteItem
          :route="route"
          :a-token="tokenList.find((t) => route.a.assetSlug === t.assetSlug)"
          :b-token="tokenList.find((t) => route.b.assetSlug === t.assetSlug)"
        />
        <div
          v-if="index < getCurrentTrade.trades.length - 1"
          style="margin: auto 7px"
        >
          <img
            v-if="getCurrentTrade.type === 'weighted'"
            :src="plusSolid"
            alt="plus"
            width="16"
          />
          <img v-else :src="arrowRight" alt="arrow" />
        </div>
      </div>
    </div>
    <div style="width: 100%; margin-top: 16px; text-align: center">
      <div :style="`${!getPkh ? 'display: none;' : ''}`">
        <el-button
          :disabled="buttonDisabled"
          type="primary"
          style="
            border-radius: 20px;
            width: 340px;
            max-width: 100%;
            margin: auto;
            font-weight: 700;
          "
          @click="onSubmit"
        >
          SWAP</el-button
        >
      </div>
      <div :style="`${getPkh ? 'display: none;' : ''}`">
        <el-button
          type="success"
          style="
            border-radius: 20px;
            width: 340px;
            max-width: 100%;
            margin: auto;
            font-weight: 700;
          "
          @click="connectWallet"
          >Connect Wallet</el-button
        >
      </div>
    </div>
    <div
      style="width: 100%; display: flex; height: 20px; justify-content: right"
    >
      <div
        v-if="areApisLoading"
        style="width: 20px"
        data-html="true"
        class="tooltip"
      >
        <i class="el-icon-loading"> </i>
        <div class="tooltiptext" data-html="true">
          <span v-for="api in getToolTipContent" :key="api"> {{ api }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
import {
  buildTokenListFromWalletAndPriceFeed,
  getBestTrade,
} from "../utils/swapRouterHelper";
import reverseIcon from "../assets/svg-icons/swap-icon.svg";

import TokenSelectMenu from "./TokenSelectMenu.vue";
import SwapRouteItem from "./SwapRouteItem.vue";
import { buildRoutingFeeOperation } from "../utils/routing-fee";
import { buildOperationParams } from "../lib/SwapRouter";
import { Tezos } from "../utils/tezos";
import arrowRight from "../assets/svg-icons/arrow-right.svg";
import plusSolid from "../assets/svg-icons/plus-solid.svg";
import * as signalR from "@microsoft/signalr";

export default {
  name: "SwapFormMain",
  components: { TokenSelectMenu, SwapRouteItem },
  data: () => ({
    numFormatOpts: { decimal: ".", thousand: ",", prefix: "" },
    percentOptions: [25, 50, 75, 100],
    reverseIcon,
    arrowRight,
    plusSolid,
    notifyDefaults: {
      duration: 10000,
      showClose: true,
      customClass: "custom-notify-blurb",
      position: "bottom-right",
    },
  }),
  computed: {
    ...mapState(["homeWallet", "farms"]),
    ...mapGetters([
      "getPkh",
      "getSwapForm",
      "getSwapPairs",
      "getCurrentTrade",
      "getApiLoadingStatus",
    ]),
    areApisLoading() {
      return this.getApiLoadingStatus.some((a) => a.loading);
    },
    getToolTipContent() {
      const toRet = ["Loading Data"];
      this.getApiLoadingStatus
        .filter((a) => a.loading)
        .forEach((a) => {
          toRet.push(a.api);
        });
      return toRet;
    },
    isLoading() {
      if (this.getSwapForm.inputToken === {}) {
        return true;
      }
      if (this.getSwapPairs.length < 1) {
        return true;
      }
      return false;
    },
    tokenList() {
      const ownedAssets = this.homeWallet.assets || [];
      const toRet = buildTokenListFromWalletAndPriceFeed(
        ownedAssets,
        this.farms.priceFeed
      );
      return toRet;
    },
    errorMessage() {
      const bal = this.getBalanceOfSelectedToken(this.getSwapForm.inputToken);
      if (!this.getPkh) {
        return "";
      }
      if (this.homeWallet.loading) {
        return "";
      }
      if (bal < this.getSwapForm.inputAmount) {
        return "Insufficient Balance";
      }
      return "";
    },
    buttonDisabled() {
      if (!this.getPkh) {
        return false;
      }
      if (this.homeWallet.assets.length < 1) {
        return false;
      }
      if (this.homeWallet.loading) {
        return false;
      }
      const bal = this.getBalanceOfSelectedToken(this.getSwapForm.inputToken);
      return bal < this.getSwapForm.inputAmount;
    },
  },
  watch: {
    getSwapForm() {
      this.updateBestTrade();
      this.updateUrlParams(
        this.getSwapForm.inputToken,
        this.getSwapForm.outputToken
      );
    },

    getSwapPairs() {
      this.updateBestTrade();
    },
    tokenList() {
      this.updateInitialSelectedTokens(this.tokenList);
      this.handleDefaults();
    },
  },
  created() {
    this.ensureTokensMatchQuery();
    this.updateDexApis();
    this.updateCurrentPrices();
    this.subscribeToTzktForDexUpdateTrigger(this.updateDexApis);
  },

  methods: {
    ...mapActions([
      "updateForm",
      "updateCurrentPrices",
      "updateCurrentTrade",
      "connectWallet",
      "updateDexApis",
      "loadWalletAsssets",
    ]),
    ensureTokensMatchQuery() {
      if (
        this.tokenList.length > 0 &&
        this.getSwapForm.inputToken !== undefined
      ) {
        const { to, from } = this.$route.query;
        if (to !== undefined && from !== undefined) {
          const inputToken = this.tokenList.find((t) => t.assetSlug === from);
          const outputToken = this.tokenList.find((t) => t.assetSlug === to);
          this.updateForm({ inputToken, outputToken });
        }
        this.handleDefaults();
      }
    },
    updateInitialSelectedTokens(tokenList) {
      const { to, from } = this.$route.query;
      const form = {};
      if (this.getSwapForm.inputToken.asset === undefined) {
        var inputToken = this.tokenList.find((t) => t.assetSlug === from);
        if (!inputToken) {
          inputToken = this.tokenList.find((t) => t.assetSlug === "tez");
        }
        form.inputToken = inputToken;
      }
      if (this.getSwapForm.outputToken.asset === undefined) {
        var outputToken = this.tokenList.find((t) => t.assetSlug === to);
        if (!outputToken) {
          outputToken = this.tokenList.find(
            (t) => t.assetSlug === `${process.env.VUE_APP_CONTRACTS_CRDAO}_0`
          );
        }
        form.outputToken = outputToken;
      }
      this.updateForm(form);
    },
    handleDefaults() {
      if (this.getSwapForm.inputToken.asset === undefined) {
        const tez = this.tokenList.find((t) => t.assetSlug === "tez");
        this.updateForm({ inputToken: tez });
      }
      if (this.getSwapForm.outputToken.asset === undefined) {
        const crDao = this.tokenList.find(
          (t) => t.assetSlug === `${process.env.VUE_APP_CONTRACTS_CRDAO}_0`
        );
        this.updateForm({ outputToken: crDao });
      }
    },
    async subscribeToTzktForDexUpdateTrigger(dexCall) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://api.tzkt.io/v1/events")
        .build();

      await connection.start();

      // subscribe
      await connection.invoke("SubscribeToBlocks");
      connection.on("blocks", (msg) => {
        console.log("block", msg);
        window.setTimeout(() => {
          dexCall();
        }, 5000);
      });
    },
    reverseSwap() {
      this.updateForm({
        inputToken: { ...this.getSwapForm.outputToken },
        outputToken: { ...this.getSwapForm.inputToken },
      });
    },
    updateBestTrade() {
      if (this.getSwapPairs.length < 1) {
        console.log("swap pairs haven't loaded yet");
      }
      const bestTrade = getBestTrade(this.getSwapForm, this.getSwapPairs);
      if (bestTrade) {
        this.updateCurrentTrade(bestTrade);
      } else {
        this.updateCurrentTrade([]);
      }
    },
    getBalanceOfSelectedToken(token) {
      if (token === undefined) return 0;
      const found = this.homeWallet.assets.find(
        (t) => t.assetSlug === token.assetSlug
      );
      if (found) {
        return this.roundDown(found.balance, 6);
      }
      return 0;
    },
    roundDown(v, n) {
      return Math.floor(v * Math.pow(10, n)) / Math.pow(10, n);
    },
    handleInputChange(e) {
      if (e.asset !== undefined) {
        this.updateForm({ inputToken: e.asset });
      }
      if (e.amount !== undefined) {
        this.updateForm({ inputAmount: e.amount });
      }
    },
    handleOutputChange(e) {
      this.updateForm({ outputToken: e.asset });
    },
    refresh() {
      this.loadWalletAsssets(this.getPkh);
      this.updateCurrentPrices();
    },
    applyOption(option) {
      const tokenBalance = this.getBalanceOfSelectedToken(
        this.getSwapForm.inputToken
      );
      var percentOf = tokenBalance * (option / 100);
      if (this.isMaxingOutXTZ(this.getSwapForm.inputToken, option)) {
        percentOf = percentOf - 0.1;
      }
      this.updateForm({ inputAmount: this.roundDown(percentOf, 6) });
    },
    isMaxingOutXTZ(token, option) {
      return token.asset === "XTZ" && option === 100;
    },
    shouldShowBalance() {
      if (this.getPkh && this.getSwapForm.inputToken) {
        return true;
      } else {
        return false;
      }
    },
    getInputUsdValue() {
      const price =
        this.getSwapForm.inputAmount * this.getSwapForm.inputToken.priceUsd;
      return this.vueNumberFormat(price, {
        ...this.numFormatOpts,
        precision: 2,
      });
    },
    maxOut(amount) {
      this.updateForm({ inputAmount: amount });
    },
    handleLargeDecimals(num) {
      const numStr = String(num);
      // String Contains Decimal
      if (numStr.includes(".")) {
        if (numStr.split(".")[1].length > 6) {
          return num.toFixed(6);
        }
      }
      return num;
    },
    async onSubmit() {
      const fee = await buildRoutingFeeOperation(
        this.getPkh,
        this.getCurrentTrade,
        this.getSwapForm.inputAmount,
        Tezos,
        this.getSwapPairs
      );
      const op = await buildOperationParams(
        this.getCurrentTrade,
        Tezos,
        this.getPkh
      );
      const toBatch = [...op, ...fee].map((o) => ({
        ...o,
        kind: "transaction",
      }));
      console.log(toBatch);
      try {
        const batchOp = await Tezos.wallet.batch(toBatch).send();
        this.$notify({
          message: this.getMessageVNode(
            "Transaction Pending",
            "The blockchain will process your transaction in 15-30 seconds."
          ),
          ...this.notifyDefaults,
        });
        const confirmation = await batchOp.confirmation();
        if (confirmation.completed) {
          this.$notify({
            message: this.getMessageVNode("Transaction Complete!", [
              "Transaction ",
              this.getTxLink(batchOp.opHash),
              " has been confirmed on the blockchain.",
            ]),
            ...this.notifyDefaults,
            type: "success",
          });
        } else {
          console.log("confirmation", confirmation);
          this.$notify({
            message: this.getMessageVNode("Error", [
              "Something went wrong. check out the transaction here",
              this.getTxLink(batchOp.opHash),
            ]),
            ...this.notifyDefaults,
            type: "error",
          });
        }
        this.refresh();
      } catch (err) {
        const errorString = err.data?.[1]?.with?.string;
        const knownSlippageErrors = [
          "INSUFFICIENT_OUT",
          "Dex/wrong-min-out",
          "FlatSwap_Min_Cash_Error",
        ];
        if (errorString && knownSlippageErrors.includes(errorString)) {
          this.$notify({
            message: this.getMessageVNode("Wrong min out", [
              "Try adjusting your slippage tolerance to a larger percent.",
            ]),
            ...this.notifyDefaults,
            type: "error",
          });
        } else if (err.title !== "Aborted") {
          console.error(err);
          this.$notify({
            message: this.getMessageVNode(err.title, err.message),
            ...this.notifyDefaults,
            type: "error",
          });
        }
      }
    },
    updateUrlParams(from, to) {
      if (from.assetSlug && to.assetSlug) {
        const newQuery = { from: from.assetSlug, to: to.assetSlug };
        if (JSON.stringify(newQuery) !== JSON.stringify(this.$route.query)) {
          this.$router.replace({
            ...this.$route,
            query: newQuery,
          });
        }
      }
    },
    getTxLink(hash) {
      const h = this.$createElement;
      const text = `${hash.slice(0, 5)}...${hash.slice(-8)}`;
      return h(
        "a",
        {
          attrs: {
            href: `https://tzstats.com/${hash}`,
            target: "_blank",
            class: "op-hash-link",
          },
        },
        text
      );
    },
    getMessageVNode(title, text) {
      const h = this.$createElement;
      const msgTitle = h("span", { attrs: { class: "message-title" } }, title);
      const mstText = h("span", { attrs: { class: "message-text" } }, text);
      return h(
        "div",
        {
          attrs: { class: "message-wrapper" },
        },
        [msgTitle, mstText]
      );
    },
  },
};
</script>
<style lang="scss">
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

.swap-form-main-box-card {
  box-shadow: 0 0px 12px 0 rgba(21, 21, 52, 0.05) !important;

  width: 100%;
  max-width: 440px;
}

.swap-header {
  color: black;
  font-size: 16;
  font-weight: 600;
}
.from-section {
  * {
    font-size: 12px;
    font-weight: 500;
  }
  color: #757679;
  margin: 12px 20px 2px 20px;
  display: flex;
  justify-content: space-between;
}

.asset-selection {
  border-radius: 18px;
  flex-wrap: wrap;
  border: 1px solid rgba(25, 27, 31, 0.1);
  padding: 16px 20px;
  box-shadow: 0 0px 12px 0 rgba(21, 21, 52, 0.05) !important;
  &:hover {
    border-color: #c0c4cc;
  }
  &:focus-within {
    border-color: #555cff;
  }
  &.active {
    border-color: #555cff !important;
  }
  .token-usd-value {
    color: #757679;
    font-weight: 500;
    position: absolute;
    font-size: 12px;
    bottom: 5px;
    right: 30px;
  }
  &.error {
    border-color: #ff4d4b !important;
    .asset-swap-amount > input {
      color: #ff4d4b !important;
    }
  }
}
.custom-notify-blurb {
  .el-notification__content {
    margin-top: 0;
  }
  .message-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    max-width: 250px;
    .message-title {
      font-size: 14px;
      font-weight: bold;
    }
    .message-text {
      font-size: 12px;
      text-align: initial;
    }
    span {
      flex-basis: 100%;
    }
  }
}

@media (max-width: 440px) {
  .error-message-section {
    width: 30% !important;
  }
}

.percent-input-buttons {
  width: calc(100% - 30px);
  display: flex;
  justify-content: right;
  margin-right: 30px;
  height: 30px;
  .percent-input-button-section {
    width: 100%;
    text-align: right;
    .percent-input-option {
      font-size: 12px;
      font-weight: 600;
      padding: 0;
    }
  }
}

.error-message-section {
  display: flex;
  width: 100%;
  justify-content: left;
  align-items: center;
  color: #ff4d4b;
  font-size: 12px;
  margin-left: 20px;
}
.swap-placeholder {
  width: 100%;
  position: relative;
  display: inline-block;
  height: 12px;
}

.swap-image-container {
  position: absolute;
  left: calc(50% - 10px);

  top: 6px;
}

.swap-route-container {
  margin-top: 8px;
  display: flex;
  flex-basis: 100%;
  justify-content: center;
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: white;
  color: #757679;
  border: 1px solid rgba(25, 27, 31, 0.1);

  text-align: left;
  border-radius: 6px;
  padding: 5px;
  font-size: 12px;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: -5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  left: 105%;
  span {
    flex-basis: 100%;
  }
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
