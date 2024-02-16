<template>
  <div id="airdrop-tool" class="create-token">
    <nav-menu></nav-menu>
    <el-main>
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
                <el-col :span="10" style="height: 40px">
                  <el-form-item
                    label
                    for="token-to-airdrop"
                    class="color__subheading"
                  >
                    Token to Airdrop
                  </el-form-item>
                </el-col>
              </el-row>
              <el-col :span="14" style="margin-bottom: 0px">
                <el-form-item prop="tokenAddress" style="margin-bottom: 0px">
                  <el-autocomplete

                    class="el-input"
                    :trigger-on-focus="false"
                    placeholder="Search for Token or Enter Token Address"
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
              <el-form-item prop="poolTokenType">
                <el-select
                  v-model="form.tokenType"
                  placeholder="Token Type"
                  style="margin-left: 40px"
                >
                  <el-option label="FA2" value="fa2"></el-option>
                  <el-option label="FA1.2" value="fa1"></el-option>
                </el-select>
              </el-form-item>
              <el-row>
                <el-form-item
                  label
                  for="airdrop-file"
                  class="color__subheading"
                  style="height: 35px; margin-bottom: 0px"
                >
                  Upload Airdrop List From Our
                  <a href="/airdrop-template.csv" style="color: #555cff">
                    Template</a
                  >. (Optional)
                </el-form-item>
              </el-row>
              <el-button
                id="airdrop-file"
                type="file"
                style="
                  font-size: 12px;
                  border: 1px, solid, #555cff;
                  border-color: #555cff;
                  border-radius: 20px;
                  background-color: transparent;
                  color: white;
                  padding: 5px 10px;
                  margin-bottom: 10px;
                "
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
              <el-row style="margin-bottom: 0px">
                <el-col :span="14">
                  <el-form-item
                    label
                    for="airdrop-address"
                    class="color__subheading"
                    style="margin-bottom: 0px"
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
                <el-col :span="10">
                  <el-form-item
                    style="margin-left: 40px; margin-bottom: 0px"
                    label
                    for="airdrop-amount"
                    class="color__subheading"
                  >
                    Airdrop Amount
                  </el-form-item>
                </el-col>
              </el-row>
              <div style="max-height: 600px; overflow: auto">
                <el-row>
                  <div
                    v-for="(entry, index) in displayedAirdropEntries"
                    :key="index"
                  >
                    <el-col :span="14">
                      <el-form-item style="margin-bottom: 10px">
                        <el-input
                          :id="'airdrop-address-' + index"
                          v-model="form.airdropEntries[index].address"
                          class="el-input"
                          type="text"
                          placeholder="Address to receive airdrop"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item
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
              <h3 style="margin-top: 0px">Airdrop Summary</h3>
              <el-row>
                <el-col :span="12">
                  <span class="color__subheading">Token to Airdrop</span>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <span class="color__subheading">Total Airdrop Amount</span>
                </el-col>
              </el-row>
              <el-row style="margin-bottom: 15px">
                <el-col :span="12">
                  <span> {{ form.tokenSymbol }}</span>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <span> {{ totalAirdropAmount }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <span class="color__subheading">Airdrop Address</span>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <span class="color__subheading">Airdrop Amount</span>
                </el-col>
              </el-row>
              <div
                style="padding-right: 5px; max-height: 675px; overflow: auto"
              >
                <el-row
                  v-for="(entry, index) in form.airdropEntries"
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
      <el-row :gutter="20" type="flex" style="margin-top: 25px">
        <el-col :span="8" :offset="16" style="text-align: right">
          <el-button
            v-if="wallet.connected"
            type="primary"
            style="border-radius: 10px; font-weight: bold"
            @click="onSubmit"
            >AIRDROP TOKENS</el-button
          >
          <connect-button v-if="wallet.connected === false" />
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ipfs from "./../utils/ipfs";
import farmUtils from "./../utils/farm";
import NavMenu from "./NavMenu.vue";
import ConnectButton from "./ConnectButton.vue";

export default {
  name: "AirdropTool",
  components: {
    NavMenu,
    ConnectButton,
  },
  data() {
    return {
      form: {
        tokenSymbol: "--",
        tokenAddress: "",
        tokenType: "",
        airdropEntries: Array(10)
          .fill()
          .map(() => ({ address: "", amount: "" })),
      },
      numRows: 10,
    };
  },
  computed: {
    ...mapState(["wallet", "homeWallet"]),
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
  methods: {
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
      this.form.tokenAddress = item.address;
      this.form.tokenSymbol = item.value;
      this.form.tokenType = item.type === "fa2" ? "fa2" : "fa1";
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
      this.form.airdropEntries = newEntries;
      this.numRows = newEntries.length;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";
.airdrop-tool {
  display: flex;
  flex-direction: row;
}
.info-icon {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
</style>
