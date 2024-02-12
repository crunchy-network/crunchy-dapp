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
            v-loading="loading"
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
                <el-form-item prop="poolTokenAddress">
                  <el-autocomplete
                    v-model="tokenAddress"
                    class="el-input"
                    :fetch-suggestions="queryPoolTokens"
                    :trigger-on-focus="false"
                    placeholder="Search for Token or Enter Token Address"
                  >
                    <template slot-scope="{ item }">
                      <div style="padding: 6px 0">
                        <el-avatar
                          v-if="
                            item.isLp &&
                            Array.isArray(item.thumbnailUri) &&
                            item.thumbnailUri?.length > 0
                          "
                          :src="item.thumbnailUri[0]"
                          fit="cover"
                          shape="circle"
                          :size="40"
                          style="
                            position: relative;
                            border: 4px solid #fff;
                            vertical-align: middle;
                            margin-left: -18px;
                            margin-right: 14px;
                          "
                        ></el-avatar>
                        <el-avatar
                          v-if="
                            item.isLp &&
                            Array.isArray(item.thumbnailUri) &&
                            item.thumbnailUri?.length > 0
                          "
                          :src="item.thumbnailUri[1]"
                          fit="cover"
                          shape="circle"
                          :size="40"
                          style="
                            position: relative;
                            border: 4px solid #fff;
                            vertical-align: middle;
                            margin-left: -18px;
                            margin-right: 14px;
                          "
                        ></el-avatar>
                        <el-avatar
                          v-if="!item.isLp"
                          :src="item.thumbnailUri"
                          fit="cover"
                          shape="circle"
                          :size="40"
                          style="
                            position: relative;
                            border: 4px solid #fff;
                            vertical-align: middle;
                            margin-left: 22px;
                            margin-right: 14px;
                          "
                        ></el-avatar>
                        {{ item.value }}
                      </div>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-form-item prop="poolTokenType">
                <el-select placeholder="Token Type" style="margin-left: 40px">
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
                  <a href="Template" style="color: #555cff"> Template</a>.
                  (Optional)
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
              >
                UPLOAD AIRDROP FILE
              </el-button>
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
                    <div
                      v-for="(address, index) in displayedAirdropAddresses"
                      :key="index"
                    >
                      <el-input
                        :id="'airdrop-address-' + index"
                        v-model="airdropAddresses[index]"
                        class="el-input"
                        type="text"
                        placeholder="Address to receive airdrop"
                        style="margin-right: 30px; margin-bottom: 10px"
                      />
                    </div>
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
                    <div v-for="i in 10" :key="i">
                      <el-input
                        :id="'airdrop-amount-' + i"
                        v-model="airdropAmounts[i]"
                        class="el-input"
                        style="margin-bottom: 10px"
                        type="text"
                        placeholder="10,000..."
                      />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
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
            v-loading="loading"
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
                  <span> {{ tokenToAirdrop }}</span>
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
              <el-row v-for="(address, index) in airdropAddresses" :key="index">
                <el-col :span="12">
                  <span>{{ address }}</span>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <span>{{ airdropAmounts[index] }}</span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
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
      showPopup: false,
      numRows: 10,
      tokenToAirdrop: "XTZ",
      tokenAddress: "",
      airdropAddresses: [1233, 1234, 1235, 1236, 1237, 1238, 1239, 1240, 1241, 1242],
      airdropAmounts: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
    };
  },
  computed: {
    totalAirdropAmount() {
      return this.airdropAmounts.reduce((a, b) => a + b, 0);
    },
    displayedAirdropAddresses() {
      return this.airdropAddresses.slice(0, this.numRows);
    },
  },
  methods: {
    addRows() {
      this.numRows += 10;
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
