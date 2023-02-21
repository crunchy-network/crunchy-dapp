<template>
  <div id="rckt-swap">
    <el-row :gutter="20" type="flex" align="bottom">
      <el-col :span="24">
        <div class="grid-content">
          <h2 style="margin-top: 0; margin-bottom: 5px">
            Swap RCKT and rkDAO for CRUNCH
          </h2>
          <span style="font-size: 14px"
            >Check out the
            <a
              href="https://crunchytez.medium.com/crunchy-and-rocket-the-merge-d0b59a831c8"
              target="_blank"
              >latest Medium article</a
            >
            detailing the RCKT swap.</span
          >
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" type="flex" align="top" style="margin-top: 25px">
      <el-col :span="16">
        <div class="grid-content">
          <el-card class="box-card" shadow="always">
            <el-form
              ref="form1"
              v-loading.lock="rckt.loading"
              :model="form1"
              label-position="top"
              hide-required-asterisk
            >
              <el-row :gutter="20" type="flex" align="middle">
                <el-col :span="10" style="position: relative">
                  <h3 style="margin: 0; margin-bottom: 8px">Swap RCKT</h3>
                  <el-avatar
                    src="https://gblobscdn.gitbook.com/assets%2F-MayY_wA8g4oLd9eVN9A%2F-MbbCn2yMCnBWfDTMUTb%2F-MbbDTyyuxM6uBAYA6ms%2FToken.png"
                    shape="circle"
                    :size="38"
                    style="position: absolute; top: 0; right: 10px"
                  ></el-avatar>
                  <el-form-item
                    key="input-rckt"
                    label="1 RCKT = 0.24791340 CRUNCH"
                    prop="inputRckt"
                    :rules="[
                      {
                        type: 'number',
                        required: true,
                        message: 'Enter an amount',
                        transform: (v) => Number(v),
                      },
                      {
                        type: 'number',
                        min: 0.000001,
                        message: 'Enter a valid amount (at least 0.000001)',
                        transform: (v) => Number(v),
                      },
                    ]"
                    style="margin-bottom: 24px"
                  >
                    <el-input
                      v-model="form1.inputRckt"
                      label="RCKT Input"
                      @input="
                        form1.outputCrunch = calcRcktSwap(form1.inputRckt)
                      "
                    >
                      <span slot="suffix">
                        <el-button
                          type="text"
                          size="small"
                          style="color: #1ec37f; font-weight: bold"
                          @click="
                            form1.inputRckt = rckt.balanceRckt;
                            form1.outputCrunch = calcRcktSwap(form1.inputRckt);
                          "
                          >USE MAX</el-button
                        >
                      </span>
                    </el-input>
                  </el-form-item>
                  <div
                    class="current-balance"
                    style="
                      border-radius: 22px;
                      background: #ffeecc;
                      padding: 12px 20px;
                    "
                  >
                    <el-row type="flex" align="middle" justify="space-between">
                      <el-col :span="8" style="color: #8c8477; font-size: 12px"
                        >BALANCE</el-col
                      >
                      <el-col
                        :span="16"
                        style="
                          font-size: 12px;
                          color: #303133;
                          font-weight: 600;
                          text-align: right;
                        "
                        >{{ vueNumberFormat(rckt.balanceRckt) }} RCKT</el-col
                      >
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="4" style="text-align: center">
                  <i class="far fa-equals"></i>
                </el-col>
                <el-col :span="10" style="position: relative">
                  <h3 style="margin: 0; margin-bottom: 8px">Get CRUNCH</h3>
                  <el-avatar
                    src="https://nftstorage.link/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq"
                    shape="circle"
                    :size="38"
                    style="position: absolute; top: 0; right: 10px"
                  ></el-avatar>
                  <el-form-item
                    label="1 CRUNCH = 4.033666 RCKT"
                    style="margin-bottom: 24px"
                  >
                    <el-input
                      v-model="form1.outputCrunch"
                      label="CRUNCH"
                      :disabled="true"
                    >
                      <span slot="suffix">CRUNCH</span>
                    </el-input>
                  </el-form-item>
                  <el-button
                    v-if="wallet.connected === false"
                    type="success"
                    style="
                      border-radius: 12px;
                      font-weight: bold;
                      width: 100%;
                      padding: 12px 20px;
                      margin-left: 0;
                    "
                    @click="connectWallet"
                    >Connect Wallet</el-button
                  >
                  <el-button
                    v-else
                    type="primary"
                    style="
                      border-radius: 12px;
                      font-weight: bold;
                      width: 100%;
                      padding: 12px 20px;
                      margin-left: 0;
                    "
                    @click="swapRckt(form1.inputRckt)"
                    >SWAP AND BURN</el-button
                  >
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex" align="top" style="margin-top: 35px">
      <el-col :span="16">
        <div class="grid-content">
          <el-card class="box-card" shadow="always">
            <el-form
              ref="form2"
              v-loading.lock="rckt.loading"
              :model="form2"
              label-position="top"
              hide-required-asterisk
            >
              <el-row :gutter="20" type="flex" align="middle">
                <el-col :span="10" style="position: relative">
                  <h3 style="margin: 0; margin-bottom: 8px">Swap rkDAO</h3>
                  <el-avatar
                    src="https://i.ibb.co/3m7xx5C/Rocket-9.png"
                    shape="circle"
                    :size="38"
                    style="position: absolute; top: 0; right: 10px"
                  ></el-avatar>
                  <el-form-item
                    key="input-rkdao"
                    label="1 rkDAO = 198.21589897 CRUNCH"
                    prop="inputRkdao"
                    :rules="[
                      {
                        type: 'number',
                        required: true,
                        message: 'Enter an amount',
                        transform: (v) => Number(v),
                      },
                      {
                        type: 'number',
                        min: 0.000001,
                        message: 'Enter a valid amount (at least 0.000001)',
                        transform: (v) => Number(v),
                      },
                    ]"
                    style="margin-bottom: 24px"
                  >
                    <el-input
                      v-model="form2.inputRkdao"
                      label="rkDAO Input"
                      @input="
                        form2.outputCrunch = calcRkdaoSwap(form2.inputRkdao)
                      "
                    >
                      <span slot="suffix">
                        <el-button
                          type="text"
                          size="small"
                          style="color: #1ec37f; font-weight: bold"
                          @click="
                            form2.inputRkdao = rckt.balanceRkdao;
                            form2.outputCrunch = calcRkdaoSwap(
                              form2.inputRkdao
                            );
                          "
                          >USE MAX</el-button
                        >
                      </span>
                    </el-input>
                  </el-form-item>
                  <div
                    class="current-balance"
                    style="
                      border-radius: 22px;
                      background: #ffeecc;
                      padding: 12px 20px;
                    "
                  >
                    <el-row type="flex" align="middle" justify="space-between">
                      <el-col :span="8" style="color: #8c8477; font-size: 12px"
                        >BALANCE</el-col
                      >
                      <el-col
                        :span="16"
                        style="
                          font-size: 12px;
                          color: #303133;
                          font-weight: 600;
                          text-align: right;
                        "
                        >{{ vueNumberFormat(rckt.balanceRkdao) }} rkDAO</el-col
                      >
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="4" style="text-align: center">
                  <i class="far fa-equals"></i>
                </el-col>
                <el-col :span="10" style="position: relative">
                  <h3 style="margin: 0; margin-bottom: 8px">Get CRUNCH</h3>
                  <el-avatar
                    src="https://nftstorage.link/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq"
                    shape="circle"
                    :size="38"
                    style="position: absolute; top: 0; right: 10px"
                  ></el-avatar>
                  <el-form-item
                    label="1 CRUNCH = 0.00504500 rkDAO"
                    style="margin-bottom: 24px"
                  >
                    <el-input
                      v-model="form2.outputCrunch"
                      label="CRUNCH"
                      :disabled="true"
                    >
                      <span slot="suffix">CRUNCH</span>
                    </el-input>
                  </el-form-item>
                  <el-button
                    v-if="wallet.connected === false"
                    type="success"
                    style="
                      border-radius: 12px;
                      font-weight: bold;
                      width: 100%;
                      padding: 12px 20px;
                      margin-left: 0;
                    "
                    @click="connectWallet"
                    >Connect Wallet</el-button
                  >
                  <el-button
                    v-else
                    type="primary"
                    style="
                      border-radius: 12px;
                      font-weight: bold;
                      width: 100%;
                      padding: 12px 20px;
                      margin-left: 0;
                    "
                    @click="swapRkdao(form2.inputRkdao)"
                    >SWAP AND BURN</el-button
                  >
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { BigNumber } from "bignumber.js";

export default {
  name: "RocketSwap",
  data() {
    return {
      form1: {
        inputRckt: "",
        outputCrunch: "",
      },
      form2: {
        inputRkdao: "",
        outputCrunch: "",
      },
    };
  },
  computed: {
    ...mapState(["wallet", "rckt"]),
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions([
      "connectWallet",
      // 'loadRcktData',
      "swapRckt",
      "swapRkdao",
    ]),

    refresh() {
      // this.loadRcktData();
    },

    calcRcktSwap(input) {
      return BigNumber(input).times(0.2479134).toNumber().toFixed(8);
    },

    calcRkdaoSwap(input) {
      return BigNumber(input).times(198.21589897).toNumber().toFixed(8);
    },
  },
};
</script>

<style lang="scss">
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#rckt-swap {
  position: relative;
  width: 100%;

  .el-form-item__label {
    color: #a3a4a5;
  }
  .el-input .el-input__inner {
    border-radius: 10px;
  }

  .el-input.is-disabled .el-input__inner {
    color: #191b1f;
    border-color: #f6f6f6;
  }
  .el-input.is-disabled .el-input__suffix {
    color: #191b1f;
    font-weight: bold;
  }
}
</style>
