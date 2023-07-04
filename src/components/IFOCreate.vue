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
                      :value="item.label"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="Banner Image 300px x 100px"
                  prop="bannerImage"
                >
                  <el-upload
                    ref="upload"
                    action=""
                    :auto-upload="false"
                    :on-change="onchange"
                    :on-remove="handleRemove"
                    :before-upload="beforeUpload"
                  >
                    <el-button
                      type="info"
                      plain
                      style="border-radius: 10px; padding: 10px 12px"
                      class="_action-btn"
                    >
                      ADD IMAGE
                    </el-button>
                  </el-upload>
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
                    <el-form-item
                      label="Deposit token"
                      prop="depositTokenAddress"
                      required
                    >
                      <el-autocomplete
                        v-model="form.depositTokenAddress"
                        class="el-input"
                        :fetch-suggestions="queryDepositTokens"
                        :trigger-on-focus="false"
                        placeholder="Search for Token or Address"
                        @select="handleDepositTokenSelect"
                      >
                        <template slot-scope="{ item }">
                          <div style="padding: 6px 0">
                            <el-avatar
                              :src="item.thumbnailUri"
                              fit="cover"
                              shape="circle"
                              :size="40"
                              style="
                                position: relative;
                                border: 4px solid #fff;
                                vertical-align: middle;
                                margin-right: 14px;
                              "
                            ></el-avatar>
                            {{ item.value }}
                          </div>
                        </template>
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="Amount to Deposit"
                      prop="depositTokenAmount"
                      required
                    >
                      <el-input
                        v-model="form.depositTokenAmount"
                        placeholder="10,000"
                      >
                        <span slot="suffix">{{
                          form.depositTokenName
                        }}</span></el-input
                      >
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
                  style="
                    display: flex;
                    flex-direction: space-between;
                    font-size: 14px;
                    margin-bottom: 14px;
                  "
                >
                  <el-col :span="12" style="color: #8c8d8f"
                    >Amount to Raise in XTZ</el-col
                  >
                  <el-col
                    v-if="form.depositTokenAmount && form.priceXtz"
                    :span="12"
                    style="display: flex; justify-content: flex-end"
                    >{{
                      vueNumberFormat(form.depositTokenAmount * form.priceXtz, {
                        prefix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}
                  </el-col>
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="
                    display: flex;
                    flex-direction: space-between;
                    font-size: 14px;
                    margin-bottom: 14px;
                  "
                >
                  <el-col :span="8" style="color: #8c8d8f"
                    >Offering Type</el-col
                  >
                  <el-col
                    v-if="form.offeringType"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >{{ form.offeringType }}</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="color: #8c8d8f"
                    >Deposit Token</el-col
                  >
                  <el-col
                    v-if="form.depositTokenName.length"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                  >
                    <el-avatar
                      :src="form.depositTokenThumbnailUri"
                      fit="cover"
                      shape="circle"
                      :size="40"
                      style="
                        position: relative;
                        border: 4px solid #fff;
                        vertical-align: middle;
                        margin-right: 14px;
                      "
                    ></el-avatar>
                    {{ form.depositTokenName }}
                  </el-col>
                  <el-col
                    v-if="form.depositTokenName.length === 0"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >--</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="12" style="color: #8c8d8f"
                    >Amount to Deposit</el-col
                  >
                  <el-col
                    v-if="form.depositTokenAmount"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >{{ form.depositTokenAmount }}</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="12" style="color: #8c8d8f"
                    >Deposit Token Price in XTZ</el-col
                  >
                  <el-col
                    v-if="form.priceXtz"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >{{ form.priceXtz }}</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="color: #8c8d8f"
                    >IFO Funding Start</el-col
                  >
                  <el-col
                    v-if="form.startEndTimeIFO"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >{{ form.startEndTimeIFO[0] }}</el-col
                  >
                  <el-col
                    v-if="form.startEndTimeIFO === 0"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >--</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="color: #8c8d8f"
                    >IFO Funding End</el-col
                  >
                  <el-col
                    v-if="form.startEndTimeIFO"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >{{ form.startEndTimeIFO[1] }}</el-col
                  >
                  <el-col
                    v-if="form.startEndTimeIFO === 0"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >--</el-col
                  >
                </el-row>

                <el-row
                  type="flex"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="color: #8c8d8f"
                    >Token Farming Start</el-col
                  >
                  <el-col
                    v-if="form.startEndTimeFarming"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >{{ form.startEndTimeFarming[0] }}</el-col
                  >
                  <el-col
                    v-if="form.startEndTimeFarming === 0"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >--</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="color: #8c8d8f"
                    >Token Farming End</el-col
                  >
                  <el-col
                    v-if="form.startEndTimeFarming"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >{{ form.startEndTimeFarming[1] }}</el-col
                  >
                  <el-col
                    v-if="form.startEndTimeFarming === 0"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >--</el-col
                  >
                </el-row>

                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="color: #8c8d8f">Website URL</el-col>
                  <el-col
                    v-if="form.websiteURL"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >{{ form.websiteURL }}</el-col
                  >
                </el-row>

                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="color: #8c8d8f">Twitter URL</el-col>
                  <el-col
                    v-if="form.twitterURL"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >{{ form.twitterURL }}</el-col
                  >
                </el-row>

                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="8" style="color: #8c8d8f">Discord URL</el-col>
                  <el-col
                    v-if="form.discordURL"
                    :span="16"
                    style="display: flex; justify-content: flex-end"
                    >{{ form.discordURL }}</el-col
                  >
                </el-row>

                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="12" style="color: #8c8d8f"
                    >Banner Image Preview</el-col
                  >
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-image
                    v-if="form.fileList.length > 0"
                    style="width: 100px; height: 100px"
                    :src="form.fileList[0]"
                    :preview-src-list="form.fileList"
                  >
                  </el-image>
                </el-row>

                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  <el-col :span="12" style="color: #8c8d8f">Description</el-col>
                </el-row>
                <el-row
                  type="flex"
                  align="middle"
                  style="font-size: 14px; margin-bottom: 14px"
                >
                  {{ form.desc }}
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
import { mapState, mapActions } from "vuex";
import ipfs from "./../utils/ipfs";
import farmUtils from "./../utils/farm";
import { getTokenMetadata } from "./../utils/tezos";
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

    var validateDepositTokenId = (rule, value, callback) => {
      if (this.form.depositTokenType === "fa1") {
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
        depositTokenName: "",
        depositTokenType: "",
        depositTokenAddress: "",
        depositTokenId: "",
        depositTokenAmount: "",
        depositTokenDecimals: 0,
        depositTokenThumbnailUri: "",
        startEndTime: [],
        bonuses: [{ endTime: "", multiplier: "" }],
        serviceFeeId: "",
        bannerImage: "",
        fileList: [],
      },
      pickerOptions: {
        disabledDate(d) {
          return d <= new Date();
        },
      },
      offeringTypes: [
        { value: "0", label: "Initial farm offerings" },
        { value: "1", label: "Farm offerings" },
      ],
      rules: {
        depositTokenType: [{ required: true, message: "Select token type" }],
        depositTokenAddress: [
          { required: true, validator: validateTokenAddress },
        ],
        depositTokenId: [{ validator: validateDepositTokenId }],
        startEndTime: [
          { required: true, message: "Select a start and end date & time" },
        ],
        depositTokenAmount: [
          { required: true, message: "Enter an amount" },
          {
            type: "number",
            required: true,
            message: "Enter a valid amount",
            transform: (v) => Number(v),
          },
        ],
        priceXtz: [
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
    ...mapState(["wallet", "farms", "tokenTracker"]),
  },
  watch: {
    form: {
      async handler(val) {
        if (!val.depositTokenThumbnailUri && val.depositTokenAddress) {
          const validation = validateContractAddress(val.depositToken);
          if (validation === ValidationResult.VALID) {
            let depositTokenMeta = await getTokenMetadata(
              val.depositToken,
              val.depositTokenId || 0
            );
            depositTokenMeta = farmUtils.overrideMetadata(depositTokenMeta);
            this.form.depositTokenName =
              depositTokenMeta.symbol || depositTokenMeta.name;
            this.form.depositTokenDecimals = depositTokenMeta.decimals;
            this.form.depositTokenThumbnailUri = ipfs.transformUri(
              depositTokenMeta.thumbnailUri
            );
          }
        } else {
          const validation = validateContractAddress(val.depositTokenAddress);
          if (validation !== ValidationResult.VALID) {
            this.form.depositTokenThumbnailUri = "";
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

          const params = {
            poolToken: {
              tokenType: vm.form.poolTokenType,
              tokenAddress: vm.form.poolTokenAddress,
              tokenId: vm.form.poolTokenId || 0,
            },
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

    onchange(file) {
      this.form.fileList.push(URL.createObjectURL(file.raw));
    },

    handleRemove(file) {
      this.form.fileList.pop();
    },

    beforeUpload(file) {
      console.log(file)
      // Perform any necessary validation or checks before uploading the file
      // Return false to prevent uploading or return true to proceed with uploading
      // You can also show an error message if the file doesn't meet the requirements
      // For example, checking the file size or type
      // Return false if the file doesn't meet the requirements
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("Only JPEG or PNG images are allowed.");
        return false;
      }

      if (!isLt2M) {
        this.$message.error("Image size must be less than 2MB.");
        return false;
      }

      return true;
    },

    queryDepositTokens(keywords, cb) {
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

    handleDepositTokenSelect(i) {
      this.form.depositTokenName = i.value;
      this.form.depositTokenType = i.type === "fa2" ? "fa2" : "fa1";
      this.form.depositTokenAddress = i.address;
      this.form.depositTokenId = i.type === "fa2" ? i.tokenId : "";
      this.form.depositTokenDecimals = i.decimals;
      this.form.depositTokenThumbnailUri = i.thumbnailUri;
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
