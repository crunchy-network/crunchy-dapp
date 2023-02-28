<template>
  <div>
    <div style="text-align: right; padding-right: 18px">
      <p
        style="
          font-weight: 500;
          font-size: 12px;
          color: var(--color-subheading-text);
          display: inline;
        "
      >
        Balamce: <span>21</span>
      </p>
      <el-button
        style="padding: 0; color: #555cff; font-weight: 500; font-size: 12px"
        type="text"
        >Max</el-button
      >
    </div>
    <el-card body-style="padding: 18px ">
      <TokenSelectMenu
        :id="'tokenInput'"
        :list="tokenList"
        :on-change="(e) => handleInputChange(e)"
        :amount="inputAmount"
        :selected-token="inputToken"
      />
    </el-card>

    <div style="text-align: right; padding-right: 18px">
      <price-format
        :value="3.25"
        prefix="~$"
        :precision="2"
        :custom-setting="true"
        :font-size="12"
        color="var(--color-subheading-text)"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { buildTokenListFromWalletAndPriceFeed } from "../utils/swapRouterHelper";
import PriceFormat from "./PriceFormat.vue";
import TokenSelectMenu from "./TokenSelectMenu.vue";

export default {
  name: "CrnchyStakeDropdown",
  components: { TokenSelectMenu, PriceFormat },
  data() {
    return {
      inputToken: {},
      inputAmount: 0,
    };
  },
  computed: {
    ...mapState(["homeWallet", "farms"]),
    tokenList() {
      const ownedAssets = this.homeWallet.assets || [];
      const toRet = buildTokenListFromWalletAndPriceFeed(
        ownedAssets,
        this.farms.priceFeed
      );
      return toRet;
    },
  },
  watch: {
    tokenList(val) {
      console.log("tokenList", val);
      if (val.length > 0) {
        this.updateInitialSelectedTokens(this.tokenList);
        this.handleDefaults();
      }
    },
  },

  methods: {
    handleInputChange(e) {
      if (e.asset !== undefined) {
        this.inputToken = e.asset;
      }
      if (e.amount !== undefined) {
        this.inputAmount = e.amount;
      }
    },

    updateInitialSelectedTokens() {
      if (this.inputToken?.asset === undefined) {
        var inputToken = this.tokenList.find(
          (t) => t?.assetSlug === this.inputToken?.assetSlug
        );
        if (!inputToken) {
          inputToken = this.tokenList.find(
            (t) => t?.assetSlug === "KT1914CUZ7EegAFPbfgQMRkw8Uz5mYkEz2ui_0"
          );
        }
        this.inputToken = inputToken;
      }
    },

    handleDefaults() {
      if (this.inputToken.asset === undefined) {
        const tez = this.tokenList.find(
          (t) => t?.assetSlug === "KT1914CUZ7EegAFPbfgQMRkw8Uz5mYkEz2ui_0"
        );
        this.inputToken = tez;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
