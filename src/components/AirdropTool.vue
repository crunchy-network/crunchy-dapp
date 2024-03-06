<template>
  <div id="airdrop-tool" class="create-token">
    <nav-menu></nav-menu>
    <el-main class="airdrop-tool">
      <el-row class="bottom-margin" :gutter="20" type="flex" align="bottom">
        <el-col :span="24">
          <div class="grid-content">
            <h2 style="font-weight: 700; font-size: 24px; margin-bottom: 4px">
              Airdrop Tool
            </h2>
            <span class="color__subheading fs__16 fw__4"
              >Select a token to airdrop and choose between uploading our
              template full or airdrop information or manually enter your
              airdrop data. <br />
              A 10 $XTZ fee will be charged for this service.</span
            >
          </div>
          <div style="height: 20px"></div>
        </el-col>
      </el-row>
      <el-row style="display: flex">
        <el-col :span="14" style="padding-right: 40px">
          <el-card
            shadow="always"
            class="box-card"
            style="height: 100%; flex: 1"
          >
            <el-form>
              <el-row>
                <el-col :span="10" style="height: 30px">
                  <el-form-item
                    label
                    for="tokenAddress"
                    class="color__subheading"
                  >
                    Token to Airdrop
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="14" style="margin-bottom: 0px">
                  <el-form-item
                    :span="14"
                    prop="tokenAddress"
                    style="margin-bottom: 0px"
                  >
                    <el-autocomplete
                      id="token-input"
                      v-model="form.tokenAddress"
                      class="el-input"
                      :fetch-suggestions="queryTokens"
                      :trigger-on-focus="false"
                      placeholder="Search for Token or Enter Token Address"
                      @select="onTokenSelect"
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
                          >
                          </el-avatar>
                          {{ item.value }}
                        </div>
                      </template>
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="10" style="margin-bottom: 0px">
                  <el-form-item :span="10" prop="tokenType">
                    <el-select
                      id="token-type"
                      v-model="form.tokenType"
                      placeholder="Token Type"
                      style="margin-left: 40px"
                    >
                      <el-option label="FA2" value="fa2"></el-option>
                      <el-option label="FA1.2" value="fa1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row id="template-tool">
                <el-col :span="24">
                  <el-form-item
                    label
                    for="airdrop-file"
                    class="color__subheading"
                    style="margin-bottom: 0px; width: 100%"
                  >
                    Upload Airdrop List from our
                    <a
                      href="/airdrop-template.csv"
                      style="color: #555cff; text-decoration: none; cursor:pointer;"
                    >
                      Template</a
                    >
                    or use our
                    <a
                      style="color: #555cff; text-decoration: none; cursor: pointer;"
                      @click.prevent="toggleAirdropListTool"
                    >
                      Airdrop List Tool</a
                    >. (Optional)
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-button
                    id="airdrop-file"
                    type="file"
                    plain
                    style="
                      border-radius: 10px;
                      padding: 10px 12px;
                      margin-top: 5px;
                      margin-bottom: 20px;
                    "
                    class="_action-btn"
                    @click="triggerFileInput"
                  >
                    UPLOAD AIRDROP FILE
                  </el-button>
                  <input
                    ref="fileInput"
                    type="file"
                    style="display: none"
                    @change="handleFileUpload"
                  />
                </el-col>
              </el-row>
              <el-row
                id="airdrop-entries-headers"
                style="margin-bottom: 0px; width: 100%"
              >
                <el-col :span="14" :xs="12">
                  <el-form-item
                    label
                    for="airdrop-address"
                    class="color__subheading"
                    style="margin-bottom: 0px; line-height: 1.5 !important"
                  >
                    Airdrop Address(s)
                    <el-tooltip
                      :content="'Input the address to receive airdrop'"
                      placement="top"
                      effect="light"
                    >
                      <i class="fa-regular fa-info-circle"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :xs="12">
                  <el-form-item
                    id="airdrop-amount-header"
                    style="margin-left: 40px; margin-bottom: 0px"
                    label
                    for="airdrop-amount"
                    class="color__subheading"
                  >
                    Airdrop Amount
                  </el-form-item>
                </el-col>
              </el-row>
              <div style="max-height: 500px; overflow: auto">
                <el-row>
                  <div
                    v-for="(entry, index) in displayedAirdropEntries"
                    id="airdrop-entries"
                    :key="index"
                  >
                    <el-col :span="14">
                      <el-form-item style="margin-bottom: 10px">
                        <el-input
                          :id="'airdrop-address-' + index"
                          v-model="form.airdropEntries[index].address"
                          class="el-input"
                          type="text"
                          placeholder="Airdrop Address..."
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item
                        id="airdrop-amount"
                        style="margin-left: 40px; margin-bottom: 10px"
                      >
                        <el-input
                          :id="'airdrop-amount-' + index"
                          v-model="form.airdropEntries[index].amount"
                          class="el-input"
                          type="text"
                          placeholder="10,000..."
                        />
                      </el-form-item>
                    </el-col>
                  </div>
                </el-row>
              </div>
              <div
                style="
                  cursor: pointer;
                  margin: 0 auto;
                  color: #555cff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                @click="addRows"
              >
                Add 10 more fields +
              </div>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card
            shadow="always"
            class="box-card"
            style="height: 100%; flex: 1"
          >
            <div class="summary">
              <h3 style="margin-top: 7px">Airdrop Summary</h3>
              <el-row id="summary-headers">
                <el-col :span="12">
                  <span class="color__subheading">Token to Airdrop</span>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <span class="color__subheading">Total Airdrop Amount</span>
                </el-col>
              </el-row>
              <el-row id="summary-token-total" style="margin-bottom: 15px">
                <el-col :span="12">
                  <span>{{ form.tokenSymbol }}</span>
                  <el-avatar
                    v-if="form.tokenThumbnailUri"
                    :src="form.tokenThumbnailUri"
                    fit="cover"
                    shape="circle"
                    :size="15"
                    style="
                      position: relative;
                      border: 4px solid #fff;
                      vertical-align: middle;
                      margin-left: 5px;
                      margin-bottom: 4px;
                    "
                  >
                  </el-avatar>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <span> {{ totalAirdropAmount }}</span>
                </el-col>
              </el-row>
              <el-row id="summary-entries">
                <el-col :span="12">
                  <span class="color__subheading">Airdrop Address</span>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <span class="color__subheading">Airdrop Amount</span>
                </el-col>
              </el-row>
              <div
                style="padding-right: 5px; max-height: 575px; overflow: auto"
              >
                <el-row
                  v-for="(entry, index) in form.airdropEntries"
                  id="summary-entries"
                  :key="'summary-' + index"
                >
                  <el-col :span="12">
                    <span>{{ entry.address }}</span>
                  </el-col>
                  <el-col :span="12" style="text-align: right">
                    <span>{{ entry.amount }}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col
          id="submit-airdrop"
          :span="24"
          :xs="24"
          style="text-align: right; margin-top: 15px"
        >
          <el-button
            v-if="wallet.connected"
            type="primary"
            style="border-radius: 10px; font-weight: bold"
            @click="toggleIsLoading"
            >AIRDROP TOKENS</el-button
          >
          <connect-button v-if="wallet.connected === false" />
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      :visible.sync="showAirdropListTool"
      :before-close="handleClose"
      width="400px"
      class="airdrop-list-dialog"
    >
      <div class="dialog-header">
        <h1 style="margin-bottom: 15px; margin-top: 5px">Airdrop List Tool</h1>
        <p style="font-weight: 200; margin-bottom: 15px">
          Search a specific token and then click generate to create a list of
          token holders.
        </p>
        <span style="margin-bottom: 20px">Enter a Token Name or Address</span>
      </div>
      <el-form :model="form">
        <el-form-item
          prop="listTokenAddress"
          style="margin-bottom: 5px; margin-top: 5px"
        >
          <el-autocomplete
            id="list-token-input"
            v-model="form.listTokenAddress"
            class="el-input"
            :fetch-suggestions="queryTokens"
            :trigger-on-focus="false"
            placeholder="Search for Token or Enter Token Address"
            @select="onListTokenSelect"
          >
            <template slot-scope="{ item }">
              <div class="autocomplete-item">
                <el-avatar
                  :src="item.thumbnailUri"
                  fit="cover"
                  shape="circle"
                  size="40"
                  class="autocomplete-avatar"
                ></el-avatar>
                {{ item.value }}
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <span style="margin-top: 5px">Wallet Addresses: 0</span>
      </el-form>
      <el-button
        type="primary"
        style="margin-top: 20px; width: 100%; justify-content: center"
        @click="generateList"
        >Generate List</el-button
      >
    </el-dialog>
    <el-dialog
      :visible.sync="isPending"
      :before-close="handleClose"
      width="400px"
      class="airdrop-list-dialog"
    >
      <div class="dialog-header">
        <h1 style="margin-bottom: 15px; margin-top: 5px">Airdropping Tokens</h1>
        <p style="font-weight: 200; margin-bottom: 15px">
          Tokens are being airdropped and a link to the transaction will be displayed below once it has been accepted by the blockchain.
        </p>
      </div>
      <div class="loading-container" v-loading="isPending" style="padding: 30px">
  </div>
    </el-dialog>
    <el-dialog
      :visible.sync="isSuccess"
      :before-close="handleClose"
      width="400px"
      class="airdrop-list-dialog"
    >
    <div class="dialog-header">
      <h1 style="margin-bottom: 15px; margin-top: 5px">Airdrop Completed!</h1>
      <p style="font-weight: 200; margin-bottom: 20px">
        Tokens have been airdropped. Check the transaction link below to verify the airdrop was successful.
      </p>
      <span class="color__subheading" style="margin-bottom: 5px">Transaction</span>
      <div style="display: flex; align-items: center;">
        <a
          :href="'https://better-call.dev/' + successTx"
          target="_blank"
          style="color: #555cff; max-width: calc(100% - 30px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight:600;"
        >
          {{ successTx.substr(0, 15) + '...' + successTx.substr(-8) }}
        </a>
          <i class="el-icon-copy-document" style="cursor: pointer; padding-left: 10px; color: #555cff !important;"
          @click="copySuccessTx"></i>
      </div>
    </div>
</el-dialog>

  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ipfs from "./../utils/ipfs";
import farmUtils from "./../utils/farm";
import NavMenu from "./NavMenu.vue";
import ConnectButton from "./ConnectButton.vue";
import { getTokenMetadata } from "../utils/tezos";
import { ValidationResult, validateContractAddress } from "@taquito/utils";

export default {
  name: "AirdropTool",
  components: {
    NavMenu,
    ConnectButton,
  },
  data() {
    return {
      showAirdropListTool: false,
      isPending: false,
      isSuccess: false,
      successTx: "xt1djaksk83fnnjk!349fnjcxjsdvnskai9ed3ndjjka",
      form: {
        tokenName: "",
        tokenId: "",
        tokenDecimals: "",
        tokenSymbol: "--",
        tokenAddress: "",
        tokenType: "",
        tokenThumbnailUri: "",
        airdropEntries: Array(10)
          .fill()
          .map(() => ({ address: "", amount: "" })),
      },
      numRows: 10,
    };
  },
  computed: {
    ...mapState(["wallet", "farms", "homeWallet"]),
    totalAirdropAmount() {
      return this.form.airdropEntries.reduce(
        (total, entry) => total + parseFloat(entry.amount || 0),
        0
      );
    },
    displayedAirdropEntries() {
      return this.form.airdropEntries.slice(0, this.numRows);
    },
  },
  watch: {
    form: {
      async handler(val) {
        if (
          !val.tokenThumbnailUri ||
          (!val.tokenDecimals &&
            val.tokenType &&
            val.tokenAddress &&
            (val.tokenType === "fa1" || Number.isInteger(val.tokenId)))
        ) {
          const validation = validateContractAddress(val.tokenAddress);
          if (validation === ValidationResult.VALID) {
            let tokenMeta;
            try {
              tokenMeta = await getTokenMetadata(
                val.tokenAddress,
                val.tokenId || 0
              );
            } catch (e) {
              tokenMeta = this.farms.priceFeed.find(
                (el) =>
                  el.tokenAddress === val.tokenAddress &&
                  el.tokenId === val.tokenId
              );
            }
            tokenMeta.tokenAddress = val.tokenAddress;
            tokenMeta = farmUtils.overrideMetadata(tokenMeta);
            this.form.tokenName = tokenMeta.symbol || tokenMeta.name;
            this.form.tokenDecimals = tokenMeta.decimals;
            this.form.tokenThumbnailUri = ipfs.transformUri(
              tokenMeta.thumbnailUri
            );
          }
        } else {
          const validation = validateContractAddress(val.tokenAddress);
          if (validation !== ValidationResult.VALID) {
            this.form.tokenThumbnailUri = "";
          }
        }
      },
      deep: true,
    },
  },
  async created() {
    const vm = this;
    await Promise.all([this.updateCurrentPrices(), this.updateLpTokens()]).then(
      () => {
        vm.loading = false;
      }
    );
  },
  methods: {
    ...mapActions([
      "connectWallet",
      "updateCurrentPrices",
      "updateLpTokens",
      "createFarm",
    ]),
    addRows() {
      for (let i = 0; i < 10; i++) {
        this.form.airdropEntries.push({ address: "", amount: "" });
      }
      this.numRows += 10;
    },
    queryTokens(keywords, cb) {
      const matches = [];
      for (let t of this.farms.priceFeed) {
        if (
          (Object.prototype.hasOwnProperty.call(t, "name") &&
            t?.name?.toLowerCase().includes(keywords.toLowerCase())) ||
          (Object.prototype.hasOwnProperty.call(t, "symbol") &&
            t?.symbol?.toLowerCase().includes(keywords.toLowerCase())) ||
          (Object.prototype.hasOwnProperty.call(t, "tokenAddress") &&
            t.tokenAddress.toLowerCase().includes(keywords.toLowerCase()))
        ) {
          t = farmUtils.overrideMetadata(t);
          if (
            !Object.prototype.hasOwnProperty.call(t, "thumbnailUri") ||
            t.thumbnailUri === null ||
            !t.thumbnailUri
          ) {
            t.thumbnailUri =
              "https://static.thenounproject.com/png/796573-200.png";
          }
          t.thumbnailUri = ipfs.transformUri(t.thumbnailUri);
          matches.push({
            value: t.symbol || t.name,
            type: t.tokenType,
            address: t.tokenAddress,
            tokenId: t.tokenId || 0,
            isLp: false,
            thumbnailUri: t.thumbnailUri,
          });
        }
      }
      cb(matches);
    },
    onTokenSelect(item) {
      this.form.tokenSymbol = item.value;
      this.form.tokenType = item.type === "fa2" ? "fa2" : "fa1";
      this.form.tokenAddress = item.address;
      this.form.tokenId = item.tokenId;
      this.form.tokenDecimals = item.decimals;
      this.form.tokenThumbnailUri = item.thumbnailUri;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csvContent = e.target.result;
          this.parseCsvContent(csvContent);
        };
        reader.readAsText(file);
      }
    },
    parseCsvContent(csvContent) {
      const rows = csvContent.split("\n").filter(Boolean);
      const newEntries = rows.map((row) => {
        const [address, amountString] = row.split(",");
        const amount = parseFloat(amountString.trim());
        return { address: address.trim(), amount: amount };
      });
      this.form.airdropEntries = [...this.form.airdropEntries, ...newEntries];
      this.numRows = this.form.airdropEntries.length;
    },
    convertAirdropEntriesToObject(entriesArray) {
      const entriesObject = {};
      entriesArray.forEach((entry) => {
        if (entry.address && !isNaN(parseFloat(entry.amount))) {
          entriesObject[entry.address.trim()] = parseFloat(entry.amount);
        }
      });
      return entriesObject;
    },
    onSubmit() {
      console.log("FORM DATA::::", this.form);
      const entriesObject = this.convertAirdropEntriesToObject(
        this.form.airdropEntries
      );
      console.log("Prepared Entries for Submission:", entriesObject);
    },
    toggleAirdropListTool() {
      this.showAirdropListTool = !this.showAirdropListTool;
    },
    toggleIsLoading() {
      this.isPending = !this.isPending;
      setTimeout(() => {
        this.isSuccess = true;
        this.isPending = false;
      }, 5000);
    },
    copySuccessTx() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.successTx)
          .then(() => {
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
          });
      } else {
        console.error('Clipboard API not available.');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";
.airdrop-tool {
  position: relative;
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
  text-transform: none !important;
}
#template-tool {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
}

::v-deep .el-form-item__content {
  line-height: 1.5 !important;
}

@media (max-width: 991px) {
  #airdrop-entries-headers {
    flex-direction: row;
  }
  #airdrop-entries {
    display: flex;
    flex-direction: row;
  }
  #airdrop-amount-header {
    margin-left: 20px !important;
    padding: 0 !important;
    width: 80% !important;
  }
  #airdrop-amount {
    margin-left: 20px !important;
    padding: 0 !important;
    width: 80% !important;
  }
  #summary-headers {
    flex-direction: row;
  }
  #summary-token-total {
    flex-direction: row;
  }
  #summary-entries {
    flex-direction: row;
  }
  #template-tool {
    height: auto;
  }
  #submit-airdrop {
    margin-top: 0px !important;
    padding-right: 10px !important;
  }
  .el-form-item {
    width: 100%;
  }
  .el-select {
    margin-left: 0 !important;
    width: 100%;
  }

  ::v-deep #token-input {
    margin-bottom: 10px;
    width: 100%;
  }
  .el-row {
    display: flex;
    flex-direction: column;
  }

  .el-col {
    padding-right: 0 !important;
    width: 100%;
    max-width: 100%;
  }

  .box-card {
    margin-bottom: 20px;
    width: 100%;
  }
}
</style>
