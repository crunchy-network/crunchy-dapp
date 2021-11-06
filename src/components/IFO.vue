<template>
  <div id="#ifo">
    <AppBar />
    <div id="wrapper">
      <el-row :gutter="40">
        <el-col :xs="24" :md="12"
          ><el-card class="grid-content box top-box box-card" shadow="never">
            <div class="column-center">
              <div class="logo-wrapper">
                <img src="./../assets/pixel.png" class="logo" />
              </div>
            </div>

            <div class="socials">
              <a
                href="https://pixelpotus.medium.com/"
                rel="nonreffere"
                target="_blank"
                class="social-link"
              >
                Medium
              </a>
              <a
                href="https://twitter.com/PixelPotus"
                rel="nonreffere"
                target="_blank"
                class="social-link"
              >
                Twitter
              </a>
              <a
                href="https://discord.gg/CbdbvwtwkM"
                rel="nonreffere"
                target="_blank"
                class="social-link"
              >
                Discord
              </a>
              <a
                href="https://t.me/pixelpotus"
                rel="nonreffere"
                target="_blank"
                class="social-link"
              >
                Telegram
              </a>
            </div>
            <p>
              Pixel is bringing gamification to NFTs and Defi. Their first
              project, PixelPotus.com, is an early collectable on Tezos and has
              been in the top 5 on DappRadar for months. The Pixel Debates TCG
              release is quickly approaching and will be the first major utility
              for the PXL token. This is just the beginning from a proven team
              with an exciting roadmap.
            </p>

            <div class="swap-box space-top">
              <p>Token Swap Rate</p>
              <p class="mid"><b>{{ ifo.data.swapRate }} $XTZ</b></p>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="12"
          ><el-card class="grid-content box top-box swap-box box-card" v-loading="ifo.loading">
            <!-- <div class="column-center">
              <h1 class="swap-title">Token Swap Details</h1>
              <div>
                <p>Token Swap Rate</p>
                <p class="mid"><b>{{ ifo.data.swapRate }} $XTZ</b></p>
              </div>

              <p class="text-left swap-text">
                If you send less than the minimum allocation, your transaction
                will fail. This doesn’t mean you cannot participate, you simply
                have to send equal to or more than the minimum amount to
                participate.
              </p>

              <p class="text-left swap-text">
                Once you have participated, you can verify your transaction was
                successful by visitiing tzkt.io and searching your address.
              </p>
            </div> -->
            <div class="column-center">
              <h1 class="title">Initial Farm Offering</h1>

              <div class="data-section">
                <div class="line-row">
                  <div class="line"></div>
                  <div>
                    <p class="line-title">IFO Details</p>
                  </div>
                  <div class="line"></div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p v-if="!live">Harvest Begins in:</p>
                    <p v-if="live">Harvesting Ends in:</p>
                  </div>

                  <div class="data-col">
                    <p>
                      {{ displayDays }} days {{ displayHours }} hr
                      {{ displayMinutes }} min
                    </p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Farm with:</p>
                  </div>

                  <div class="data-col">
                    <p>$XTZ</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Earn:</p>
                  </div>

                  <div class="data-col">
                    <p>$PXL</p>
                  </div>
                </div>
              </div>

              <div class="data-section">
                <div class="line-row">
                  <div class="line"></div>
                  <div>
                    <p class="line-title">Your Details</p>
                  </div>
                  <div class="line"></div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Amount committed:</p>
                  </div>

                  <div class="data-col">
                    <p>{{ vueNumberFormat(ifo.data.userRecord.committed) }} XTZ</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Share:</p>
                  </div>

                  <div class="data-col">
                    <p>{{ vueNumberFormat(ifo.data.userRecord.committedPercent, {prefix: '', decimal: '.', thousand: ',', precision: 2}) }}%</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Projected to farm:</p>
                  </div>

                  <div class="data-col">
                    <p>{{ vueNumberFormat(ifo.data.userRecord.projectedHarvest) }} PXL</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Projected fee:</p>
                  </div>

                  <div class="data-col">
                    <p>{{ vueNumberFormat(ifo.data.userRecord.projectedFee) }} XTZ</p>
                  </div>
                </div>
              </div>

              <div class="data-section">
                <div class="line-row">
                  <div class="line"></div>
                  <div>
                    <p class="line-title">Summary</p>
                  </div>
                  <div class="line"></div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Total committed:</p>
                  </div>

                  <div class="data-col">
                    <p>{{ vueNumberFormat(ifo.data.totalRaised) }} XTZ</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Funds to raise:</p>
                  </div>

                  <div class="data-col">
                    <p>{{ vueNumberFormat(ifo.data.raisingGoal) }} XTZ</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>$CRUNCH to burn:</p>
                  </div>

                  <div class="data-col">
                    <p>TBA</p>
                  </div>
                </div>
              </div>

              <div v-if="wallet.connected && ifo.data.harvesting" style="border-radius: 22px; background: #FFEECC; padding: 12px 0px; width: 100%; margin-top: 18px;">
                <el-row type="flex" align="middle" justify="space-between" style="margin: 0 20px;">
                  <el-col :span="8" style="color: #8C8477; font-size: 12px; text-align: left;">PENDING HARVEST</el-col>
                  <el-col :span="16" style="font-size: 12px; color: #303133; font-weight: 600; text-align: right;">{{ vueNumberFormat(ifo.data.userRecord.pendingHarvest) }} PXL</el-col>
                </el-row>
              </div>

              <div style="width: 100%; margin-top: 18px;">
                <el-button v-if="wallet.connected === false" type="success" @click="connectWallet" style="border-radius: 10px; font-weight: bold; width: 100%; padding: 12px 20px;">Connect Wallet</el-button>
                <!-- <el-button v-else :disabled="!live" type="primary" @click="showStakeDialog" style="border-radius: 10px; font-weight: bold; width: 100%; padding: 12px 20px;">FARM</el-button> -->
                <el-button v-else :disabled="!live" type="primary" @click="harvestIfo" style="border-radius: 10px; font-weight: bold; width: 100%; padding: 12px 20px;">HARVEST</el-button>
              </div>

            </div>
          </el-card></el-col
        >
      </el-row>
      <!-- <el-row :gutter="30">
        <el-col class="tier-wrapper" :xs="24" :md="8">
          
        </el-col>
      </el-row> -->

      <el-row class="tier-wrapper" :gutter="40">
        <el-col :xs="24" :md="12">
          <div class="grid-content box info-box">
            <div class="column-center">
              <h1 class="title">Pool Info</h1>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>First Sale Begins</p>
              </div>

              <div class="data-col">
                <p>30 October 2021 14:00:00 UTC</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Last Sale Ends</p>
              </div>

              <div class="data-col">
                <p>1 November 2021 14:00:00 UTC</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Swap Rate</p>
              </div>

              <div class="data-col">
                <p>{{ ifo.data.swapRate }} $XTZ</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Total Funds Raised</p>
              </div>

              <div class="data-col">
                <p>{{ vueNumberFormat(ifo.data.totalRaised) }} XTZ</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Pool Size</p>
              </div>

              <div class="data-col">
                <p>{{ vueNumberFormat(ifo.data.offeringSupply, {prefix: '', decimal: '.', thousand: ',', precision: 0}) }} $PXL</p>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :md="12">
          <div class="grid-content box info-box">
            <div class="column-center">
              <h1 class="title">Token Information</h1>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Name</p>
              </div>

              <div class="data-col">
                <p>Pixel</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Token Symbol</p>
              </div>

              <div class="data-col">
                <p>PXL</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Circultating Supply After Farm</p>
              </div>

              <div class="data-col">
                <p>10,500,000</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Total Supply</p>
              </div>

              <div class="data-col">
                <p>100,000,000</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Decimals</p>
              </div>

              <div class="data-col">
                <p>6</p>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

  <el-dialog title="Commit XTZ" :visible.sync="form.visible" width="380px" class="stake-dialog">
    <p>Commit XTZ to harvest PXL.</p>
    <el-form :model="form" ref="form" label-position="top" hide-required-asterisk>
      <div class="current-balance" style="border-radius: 22px; background: #FFEECC; padding: 12px 20px; margin-bottom: 18px;">
        <el-row type="flex" align="middle" justify="space-between">
          <el-col :span="8" style="font-size: 12px;">BALANCE</el-col>
          <el-col :span="16" style="color: #303133; font-weight: bold; text-align: right;">{{ vueNumberFormat(wallet.balance.toNumber() / 1000000) }}</el-col>
        </el-row>
      </div>
      <el-form-item
        label="Commit"
        prop="input"
        :rules="[
          { type: 'number', required: true, message: 'Enter an amount', transform: (v) => Number(v) },
          { type: 'number', min: 0.000001, message: 'Enter a valid amount (at least 0.000001)', transform: (v) => Number(v) }
        ]"
        style="margin-bottom: 14px;"
      >
        <el-input v-model="form.input" label="Commit">
          <span slot="suffix">XTZ</span>
        </el-input>
      </el-form-item>
      <el-button type="success" size="small" round style="margin-bottom: 22px;" @click="form.input = ((wallet.balance.toNumber() / 1000000) - 0.5)">USE MAX</el-button>
      <el-button type="primary" @click="form.visible = false; stakeIfo(form.input)" style="border-radius: 12px; font-weight: bold; width: 100%; padding: 20px; margin-left: 0;">COMMIT</el-button>
    </el-form>
  </el-dialog>
  </div>

</template>

<script>
import AppBar from "./AppBar.vue";
import { mapState, mapActions } from 'vuex'

export default {
  components: { AppBar },
  data: () => ({
    displayDays: "",
    displayHours: "",
    displayMinutes: "",
    form: {
      input: "",
      visible: false
    },
    live: false,
    ended: false
  }),
  name: "IFO",
  computed: {
    ...mapState([
      'wallet',
      'ifo'
    ]),
    _seconds() {
      return 1000;
    },
    _minutes() {
      return this._seconds * 60;
    },
    _hours() {
      return this._minutes * 60;
    },
    _days() {
      return this._hours * 24;
    },
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions([
      'connectWallet',
      'loadIfoData',
      'stakeIfo',
      'harvestIfo'
    ]),

    refresh() {
      this.loadIfoData();
    },

    formatCount(value) {
      return value < 10 ? "0" + value : value;
    },
    showTimer() {
      const vm = this;
      // vm.live = true;
      vm.live = (new Date().getTime() > new Date("01 November 2021 18:00 UTC").getTime());
      const timer = setInterval(() => {
        let startDate = new Date("01 November 2021 18:00 UTC").getTime();
        if (vm.live) {
          startDate = new Date("01 November 2021 18:00 UTC").getTime() + (1296000 * 1000);
        }

        const currentDate = new Date().getTime();
        let dateDifference = startDate - currentDate;

        if (vm.live && dateDifference <= 0) {
          vm.ended = true;
          clearInterval(timer);
        }

        const days = Math.floor(dateDifference / this._days);
        dateDifference -= days * this._days;
        const hours = Math.floor(dateDifference / this._hours) % 24;
        dateDifference -= hours * this._hours;
        const minutes = Math.floor(dateDifference / this._minutes) % 60;

        this.displayDays = this.formatCount(days);
        this.displayHours = this.formatCount(hours);
        this.displayMinutes = this.formatCount(minutes);
      }, 1000);
    },

    showStakeDialog() {
      this.form.input = "";
      if (Object.prototype.hasOwnProperty.call(this.$refs, 'form')) {
        this.$refs.form.resetFields();
      }
      this.form.visible = true;
    }

  },
  mounted() {
    this.showTimer();
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

* {
  margin: 0;
  padding: 0;
}

#ifo {
  position: relative;
  width: 100%;
  margin-top: 100px;
}

#wrapper {
  padding: 40px 45px;
  @media all and (max-width: 996px) {
    padding: 20px 25px;
  }
}

.box {
  border: 1px solid rgba(25, 27, 31, 0.1);
  box-sizing: border-box;
  border-radius: 18px;
  padding: 35px 45px;
  @media all and (max-width: 996px) {
    padding: 25px 30px;
  }
}

.top-box {
  min-height: 480px;
}

.column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-wrapper {
  min-width: 200px;
  max-width: 320%;
}

.logo {
  width: 100%;
}

.vertical-bar {
  background: #191b1f;
  min-height: 100%;
  width: 4.5px;
}

.socials {
  margin: auto;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  margin-top: 10px;
}

a.social-link {
  display: block;
  font-size: 18px;
  letter-spacing: -0.02em;
  line-height: 15px;
  color: #555cff;
  padding: 0 7px;
  border-right: 1px solid #555cff;
  text-decoration: none;
  &:last-child {
    border-right: 0px;
  }

  @media all and (max-width: 760px) {
    font-size: 14px;
    padding: 0 4px;
  }
}

p {
  font-size: 14px;
  font-weight: 300;
  line-height: 21px;
  letter-spacing: 0.02em;
  color: #757679;
  margin: 0;
}

p.mid {
  font-size: 16px;
  line-height: 24px;
}

.swap-box {
  text-align: center;
}

.space-top{
  margin-top: 30px;
}

.swap-title {
  font-weight: 800;
  font-size: 28px;
  line-height: 42px;
  color: #191b1f;
  margin: 0;
  margin-bottom: 25px;
}

.swap-text {
  margin-top: 15px;
}

.tier-wrapper {
  margin: 32px 0;
}

.line-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 5px;
}

.line-title {
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.02em;
  color: #757679;
}

.line {
  max-width: 100%;
  flex: 1;
  height: 1px;
  background: #e8e9e9;
}

.tier-box {
  padding: 18px 25px;
}
.tier-box .title {
  font-weight: 800;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  color: #1ec37f;
  margin-bottom: 12px;
  margin-top: 0px;
}

.data-section {
  width: 100%;
}

.detail-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.detail-row .data-col {
  flex: 1;
}

.detail-row .data-col p {
  color: rgba(117, 118, 121, 0.6);
  font-weight: 800;
  font-size: 12px;
  text-align: left;
}

.detail-row .data-col:nth-child(2) p {
  text-align: right;
  color: #757679;
  font-weight: 700;
  font-size: 14px;
}

.info-box .title {
  font-weight: 800;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  color: #757679;
  margin-bottom: 15px;
}

.info-box .detail-row {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e9e9;
  &:last-child {
    border-bottom: 0px;
    padding-bottom: 0px;
    margin-bottom: 0px;
  }
}

@media all and (max-width: 1200px) {
  .box {
    margin-bottom: 20px;
  }
}
</style>