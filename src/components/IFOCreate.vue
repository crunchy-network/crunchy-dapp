<template>
  <div id="ifo-create" class="ifo-create">
    <!-- class="hidden-sm-and-down" -->
    <nav-menu></nav-menu>

    <!-- class="hidden-sm-and-down" -->
    <el-main style="margin-top: 90px">
      <el-row :gutter="20" type="flex" align="bottom">
        <el-col :span="24">
          <div class="grid-content">
            <h2 style="margin-top: 0; margin-bottom: 5px">
              Create a Farm Offering
            </h2>
            <span style="font-size: 14px"
              >Create your own initial farm offering. Choose between a initial
              farm offering or a farm offering and provide details below.</span
            >
          </div>
        </el-col>
      </el-row>

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="135px"
        label-position="top"
      >
        <el-row :gutter="20" type="flex" style="margin-top: 25px">
          <el-col :span="16">
            <div class="grid-content" style="height: 100%">
              <el-card
                v-loading="loading"
                shadow="always"
                class="box-card"
                style="height: 100%"
              >
                <el-form-item
                  label="Offering Type"
                  prop="offeringType"
                  required
                >
                  <el-select
                    v-model="form.offeringType"
                    placeholder="Select a Offering Type"
                    style="width: 400px"
                  >
                    <el-option
                      v-for="item in offeringTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="Banner Image 300px x 100px"
                  prop="bannerImage"
                >
                  <el-button
                    type="info"
                    plain
                    style="border-radius: 10px; padding: 10px 12px"
                    class="_action-btn"
                    @click="addImage(index)"
                    >ADD IMAGE</el-button
                  >
                </el-form-item>

                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="Website URL">
                      <el-input
                        v-model="form.websiteURL"
                        placeholder="http://homepage.com"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Twitter URL">
                      <el-input
                        v-model="form.twitterURL"
                        placeholder="http://twitter.com"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Discord URL">
                      <el-input
                        v-model="form.discordURL"
                        placeholder="http://discord.com"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="Description" prop="desc">
                  <el-input
                    style="background-color: #191b1f !important"
                    v-model="form.desc"
                    type="textarea"
                    placeholder="Description text...."
                  />
                </el-form-item>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="Deposit token" required>
                      <el-input
                        v-model="form.depositToken"
                        placeholder="Search for Token or Address"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Amount to Deposit" required>
                      <el-input
                        v-model="form.amount"
                        placeholder="10,000"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item
                  label="Deposit Token Price in XTZ"
                  prop="priceXtz"
                  required
                >
                  <el-input
                    style="width: 40%"
                    v-model="form.priceXtz"
                    placeholder="0.0002"
                  ></el-input>
                </el-form-item>

                <el-form-item
                  label="IFO Funding Time Frame"
                  prop="startEndTimeIFO"
                >
                  <el-date-picker
                    v-model="form.startEndTimeIFO"
                    type="datetimerange"
                    start-placeholder="Start Date & Time"
                    end-placeholder="End Date & Time"
                    :default-time="['12:00:00', '12:00:00']"
                    :picker-options="pickerOptions"
                    range-separator="To"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item
                  label="Token Farming Time Frame (Must be after funding time frame)"
                  prop="startEndTimeFarming"
                >
                  <el-date-picker
                    v-model="form.startEndTimeFarming"
                    type="datetimerange"
                    start-placeholder="Start Date & Time"
                    end-placeholder="End Date & Time"
                    :default-time="['12:00:00', '12:00:00']"
                    :picker-options="pickerOptions"
                    range-separator="To"
                  ></el-date-picker>
                </el-form-item>
              </el-card>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="grid-content" style="height: 100%">
              <el-card class="box-card" shadow="always" style="height: 100%">
                <h3 style="margin-top: 0">Farm Offering Summary</h3>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="font-weight: bold"
                    >Amount to Raise:</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="font-weight: bold"
                    >Offering Type:</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="font-weight: bold"
                    >Deposit Token:</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="12" style="font-weight: bold"
                    >Amount to Deposit:</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="12" style="font-weight: bold"
                    >Deposit Token Price in XTZ:</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="font-weight: bold"
                    >IFO Funding Start:</el-col
                  >
                  <el-col v-if="form.startEndTime.length" :span="16">{{
                    form.startEndTime[0]
                  }}</el-col>
                  <el-col v-if="form.startEndTime.length === 0" :span="16"
                    >--</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="font-weight: bold"
                    >IFO Funding Start:</el-col
                  >
                  <el-col v-if="form.startEndTime.length" :span="16">{{
                    form.startEndTime[1]
                  }}</el-col>
                  <el-col v-if="form.startEndTime.length === 0" :span="16"
                    >--</el-col
                  >
                </el-row>

                <el-row
                  type="flex"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="font-weight: bold"
                    >Token Farming Start:</el-col
                  >
                  <el-col v-if="form.startEndTime.length" :span="16">{{
                    form.startEndTime[0]
                  }}</el-col>
                  <el-col v-if="form.startEndTime.length === 0" :span="16"
                    >--</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="font-weight: bold"
                    >Token Farming End:</el-col
                  >
                  <el-col v-if="form.startEndTime.length" :span="16">{{
                    form.startEndTime[1]
                  }}</el-col>
                  <el-col v-if="form.startEndTime.length === 0" :span="16"
                    >--</el-col
                  >
                </el-row>

                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="font-weight: bold"
                    >Website URL:</el-col
                  >
                </el-row>

                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="font-weight: bold"
                    >Twitter URL:</el-col
                  >
                </el-row>

                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="font-weight: bold"
                    >Discord URL:</el-col
                  >
                </el-row>

                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="12" style="font-weight: bold"
                    >Banner Image Preview:</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  --
                </el-row>

                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="12" style="font-weight: bold"
                    >Description</el-col
                  >
                  
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  --
                </el-row>
              </el-card>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" type="flex" style="margin-top: 25px">
          <el-col :span="8" :offset="16" style="text-align: right">
            <el-button
              v-if="wallet.connected"
              type="primary"
              style="border-radius: 10px; font-weight: bold"
              @click="onSubmit"
              >Create Farm</el-button
            >
            <connect-button v-if="wallet.connected === false" />
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapActions } from "vuex";
import ipfs from "./../utils/ipfs";
import farmUtils from "./../utils/farm";
import { getTokenMetadata } from "./../utils/tezos";
import { BigNumber } from "bignumber.js";
import { ValidationResult, validateContractAddress } from "@taquito/utils";
import NavMenu from "./NavMenu.vue";
import ConnectButton from "./ConnectButton.vue";

export default {
  name: "FarmCreate",
  components: {
    NavMenu,
    ConnectButton,
  },
  data() {
    var validateTokenAddress = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Enter token address"));
      } else {
        const validation = validateContractAddress(value);
        if (validation !== ValidationResult.VALID) {
          callback(new Error("Enter valid token address"));
        } else {
          callback();
        }
      }
    };

    var validatePoolTokenId = (rule, value, callback) => {
      if (this.form.poolTokenType === "fa1") {
        callback();
      } else {
        if (value === "") {
          callback(new Error("Enter token id"));
        } else {
          callback();
        }
      }
    };

    var validateRewardTokenId = (rule, value, callback) => {
      if (this.form.rewardTokenType === "fa1") {
        callback();
      } else {
        if (value === "") {
          callback(new Error("Enter token id"));
        } else {
          callback();
        }
      }
    };

    return {
      loading: true,
      form: {
        poolTokenIsQuipuLp: true,
        poolTokenName: "",
        poolTokenType: "",
        poolTokenAddress: "",
        poolTokenId: "",
        poolTokenThumbnailUri: "",
        rewardTokenName: "",
        rewardTokenType: "",
        rewardTokenAddress: "",
        rewardTokenId: "",
        rewardTokenAmount: "",
        rewardTokenDecimals: 0,
        rewardTokenThumbnailUri: "",
        startEndTime: [],
        bonuses: [{ endTime: "", multiplier: "" }],
        serviceFeeId: "",
      },
      pickerOptions: {
        disabledDate(d) {
          return d <= new Date();
        },
      },
      offeringTypes: [
        { value: "0", label: "10,000 CRNCHY + 1.5% of tokens" },
        { value: "1", label: "50,000 CRNCHY + 1.0% of tokens" },
        { value: "2", label: "100,000 CRNCHY + 0.5% of tokens" },
        { value: "3", label: "500,000 CRNCHY + 0% of tokens" },
      ],
      rules: {
        poolTokenType: [{ required: true, message: "Select token type" }],
        poolTokenAddress: [{ required: true, validator: validateTokenAddress }],
        poolTokenId: [{ validator: validatePoolTokenId }],
        rewardTokenType: [{ required: true, message: "Select token type" }],
        rewardTokenAddress: [
          { required: true, validator: validateTokenAddress },
        ],
        rewardTokenId: [{ validator: validateRewardTokenId }],
        startEndTime: [
          { required: true, message: "Select a start and end date & time" },
        ],
        rewardTokenAmount: [
          { required: true, message: "Enter an amount" },
          {
            type: "number",
            required: true,
            message: "Enter a valid amount",
            transform: (v) => Number(v),
          },
        ],
        serviceFeeId: [{ required: true, message: "Select a service fee" }],
      },
    };
  },
  computed: {
    ...mapState(["wallet", "farms"]),

    rewardAmountPerSecond: function () {
      if (!this.form.rewardTokenAmount || !this.form.rewardTokenName) {
        return 0;
      }

      if (this.form.startEndTime.length === 0) {
        return 0;
      }

      let start = this.form.startEndTime[0];
      const end = this.form.startEndTime[1];
      let effectiveSec = 0;

      if (
        this.form.bonuses.length &&
        this.form.bonuses[0].endTime &&
        this.form.bonuses[0].multiplier
      ) {
        const bonuses = _.orderBy(this.form.bonuses, "endTime", "asc");
        for (const bonus of bonuses) {
          effectiveSec +=
            ((bonus.endTime - start) / 1000) * parseInt(bonus.multiplier);
          start = bonus.endTime;
        }
      }

      effectiveSec += (end - start) / 1000;

      return BigNumber(this.form.rewardTokenAmount)
        .times(BigNumber(10).pow(this.form.rewardTokenDecimals))
        .div(effectiveSec)
        .integerValue(BigNumber.ROUND_CEIL)
        .toNumber();
    },
  },
  watch: {
    form: {
      async handler(val) {
        if (
          !val.rewardTokenThumbnailUri &&
          val.rewardTokenType &&
          val.rewardTokenAddress &&
          (val.rewardTokenType === "fa1" || val.rewardTokenId)
        ) {
          const validation = validateContractAddress(val.rewardTokenAddress);
          if (validation === ValidationResult.VALID) {
            let rewardTokenMeta = await getTokenMetadata(
              val.rewardTokenAddress,
              val.rewardTokenId || 0
            );
            rewardTokenMeta = farmUtils.overrideMetadata(rewardTokenMeta);
            this.form.rewardTokenName =
              rewardTokenMeta.symbol || rewardTokenMeta.name;
            this.form.rewardTokenDecimals = rewardTokenMeta.decimals;
            this.form.rewardTokenThumbnailUri = ipfs.transformUri(
              rewardTokenMeta.thumbnailUri
            );
          }
        } else {
          const validation = validateContractAddress(val.rewardTokenAddress);
          if (validation !== ValidationResult.VALID) {
            this.form.rewardTokenThumbnailUri = "";
          }
        }
      },
      deep: true,
    },
  },
  created() {
    const vm = this;
    this.updateCurrentPrices().then(() => {
      vm.loading = false;
    });
  },
  methods: {
    ...mapActions(["connectWallet", "updateCurrentPrices", "createFarm"]),

    onSubmit() {
      const vm = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          const bonuses = [];
          for (const b of vm.form.bonuses) {
            if (b.endTime && b.multiplier) {
              bonuses.push(b);
            }
          }

          let serviceFeeMultiplier = 1.015;
          if (vm.form.serviceFeeId === "1") {
            serviceFeeMultiplier = 1.01;
          } else if (vm.form.serviceFeeId === "2") {
            serviceFeeMultiplier = 1.005;
          } else if (vm.form.serviceFeeId === "3") {
            serviceFeeMultiplier = 1;
          }

          const params = {
            poolToken: {
              tokenType: vm.form.poolTokenType,
              tokenAddress: vm.form.poolTokenAddress,
              tokenId: vm.form.poolTokenId || 0,
            },
            rewardToken: {
              tokenType: vm.form.rewardTokenType,
              tokenAddress: vm.form.rewardTokenAddress,
              tokenId: vm.form.rewardTokenId || 0,
            },
            rewardSupply: BigNumber(vm.form.rewardTokenAmount)
              .times(BigNumber(10).pow(vm.form.rewardTokenDecimals))
              .idiv(1)
              .toNumber(),
            rewardSupplyApprove: BigNumber(vm.form.rewardTokenAmount)
              .times(BigNumber(serviceFeeMultiplier))
              .times(BigNumber(10).pow(vm.form.rewardTokenDecimals))
              .idiv(1)
              .toNumber(),
            rewardPerSec: vm.rewardAmountPerSecond,
            startTime: vm.form.startEndTime[0],
            endTime: vm.form.startEndTime[1],
            lockDuration: 0,
            bonuses: bonuses,
            serviceFeeId: vm.form.serviceFeeId,
          };
          vm.loading = true;
          vm.createFarm(params)
            .then(() => {
              vm.loading = false;
              vm.$router.push({ name: "farm-listing" });
            })
            .catch((e) => {
              console.log(e);
              vm.loading = false;
            });
        } else {
          return false;
        }
      });
    },

    addBonus(index) {
      this.form.bonuses.splice(index + 1, 0, { endTime: "", multiplier: "" });
    },

    removeBonus(index) {
      this.form.bonuses.splice(index, 1);
    },

    queryPoolTokens(keywords, cb) {
      const matches = [];
      for (let t of this.farms.priceFeed) {
        if (
          (Object.prototype.hasOwnProperty.call(t, "name") &&
            t.name.toLowerCase().includes(keywords.toLowerCase())) ||
          (Object.prototype.hasOwnProperty.call(t, "symbol") &&
            t.symbol.toLowerCase().includes(keywords.toLowerCase()))
        ) {
          t = farmUtils.overrideMetadata(t);
          if (!Object.prototype.hasOwnProperty.call(t, "thumbnailUri")) {
            t.thumbnailUri =
              "https://static.thenounproject.com/png/796573-200.png";
          }
          t.thumbnailUri = ipfs.transformUri(t.thumbnailUri);
          matches.push({
            value: t.symbol || t.name,
            type: t.type,
            address: t.tokenAddress,
            tokenId: t.tokenId || 0,
            isQuipuLp: false,
            thumbnailUri: t.thumbnailUri,
          });
          matches.push({
            value: "XTZ/" + (t.symbol || t.name) + " LP",
            type: t.type,
            address: t.address,
            tokenId: 0,
            isQuipuLp: true,
            thumbnailUri: t.thumbnailUri,
          });
        }
      }

      // liquidity baking
      if (
        "liquidity baking".includes(keywords.toLowerCase()) ||
        "tzbtc".includes(keywords.toLowerCase())
      ) {
        matches.push({
          value: "XTZ/tzBTC LP (Liquidity Baking)",
          type: "fa1",
          address: "KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo",
          tokenId: 0,
          isQuipuLp: true,
          thumbnailUri:
            "https://tzbtc.io/wp-content/uploads/2020/03/tzbtc_logo_single.svg",
        });
      }

      cb(matches);
    },

    handlePoolTokenSelect(i) {
      this.form.poolTokenIsQuipuLp = i.isQuipuLp;
      this.form.poolTokenName = i.value;
      this.form.poolTokenType = i.type === "fa2" ? "fa2" : "fa1";
      this.form.poolTokenAddress = i.address;
      this.form.poolTokenId = i.type === "fa2" ? i.tokenId : "";
      this.form.poolTokenThumbnailUri = i.thumbnailUri;
    },

    queryRewardTokens(keywords, cb) {
      const matches = [];
      for (let t of this.farms.priceFeed) {
        if (
          (Object.prototype.hasOwnProperty.call(t, "name") &&
            t.name.toLowerCase().includes(keywords.toLowerCase())) ||
          (Object.prototype.hasOwnProperty.call(t, "symbol") &&
            t.symbol.toLowerCase().includes(keywords.toLowerCase()))
        ) {
          t = farmUtils.overrideMetadata(t);
          if (!Object.prototype.hasOwnProperty.call(t, "thumbnailUri")) {
            t.thumbnailUri =
              "https://static.thenounproject.com/png/796573-200.png";
          }
          t.thumbnailUri = ipfs.transformUri(t.thumbnailUri);
          matches.push({
            value: t.symbol || t.name,
            type: t.type,
            address: t.tokenAddress,
            tokenId: t.tokenId || 0,
            thumbnailUri: t.thumbnailUri,
            decimals: t.decimals || 0,
          });
        }
      }
      cb(matches);
    },

    handleRewardTokenSelect(i) {
      this.form.rewardTokenName = i.value;
      this.form.rewardTokenType = i.type === "fa2" ? "fa2" : "fa1";
      this.form.rewardTokenAddress = i.address;
      this.form.rewardTokenId = i.type === "fa2" ? i.tokenId : "";
      this.form.rewardTokenDecimals = i.decimals;
      this.form.rewardTokenThumbnailUri = i.thumbnailUri;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#ifo-create {
  position: relative;
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
  text-transform: none !important;
}
</style>
