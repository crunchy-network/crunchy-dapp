<template>
  <div id="#ifo">
    <AppBar />
    <div id="wrapper">
      <el-row :gutter="40">
        <el-col :xs="24" :md="12"
          ><el-card class="grid-content box top-box box-card">
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
          </el-card>
        </el-col>
        <el-col :xs="24" :md="12"
          ><el-card class="grid-content box top-box swap-box box-card">
            <div class="column-center">
              <h1 class="swap-title">Token Swap Details</h1>
              <div>
                <p>Token Swap Rate</p>
                <p class="mid"><b>TBA</b></p>
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
            </div>
          </el-card></el-col
        >
      </el-row>
      <el-row :gutter="30">
        <el-col class="tier-wrapper" :xs="24" :md="8">
          <div class="grid-content box tier-box">
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
                    <p>Launching in:</p>
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
                    <p>TBA</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Share:</p>
                  </div>

                  <div class="data-col">
                    <p>TBA</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Projected to farm:</p>
                  </div>

                  <div class="data-col">
                    <p>TBA</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Projected fee:</p>
                  </div>

                  <div class="data-col">
                    <p>TBA</p>
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
                    <p>TBA</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Funds to raise:</p>
                  </div>

                  <div class="data-col">
                    <p>TBA</p>
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

              <el-button
                type="primary"
                style="
                  border-radius: 12px;
                  font-weight: bold;
                  padding: 12px 20px;
                  margin-left: 0;
                "
                >FARM</el-button
              >
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="40">
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
                <p>30 October 2021 10:00:00 UTC</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Last Sale Ends</p>
              </div>

              <div class="data-col">
                <p>1 November 2021 10:00:00 UTC</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Swap Rate</p>
              </div>

              <div class="data-col">
                <p>TBA</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Total Funds Raised</p>
              </div>

              <div class="data-col">
                <p>TBA</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Pool Size</p>
              </div>

              <div class="data-col">
                <p>5,000,000 $PXL</p>
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
                <p>Pixel POTUS</p>
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
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";

export default {
  components: { AppBar },
  data: () => ({
    displayDays: "",
    displayHours: "",
    displayMinutes: "",
  }),
  name: "IFO",
  computed: {
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
  methods: {
    formatCount(value) {
      return value < 10 ? "0" + value : value;
    },
    showTimer() {
      const timer = setInterval(() => {
        const startDate = new Date("30 October 2021 10:00 UTC").getTime();
        const currentDate = new Date().getTime();
        const dateDifference = startDate - currentDate;

        if (dateDifference <= 0) {
          clearInterval(timer);
        }

        const days = Math.floor(dateDifference / this._days);
        const hours = Math.floor((dateDifference % days) / this._hours);
        const minutes = Math.floor(
          (dateDifference % this._hours) / this._minutes
        );

        this.displayDays = this.formatCount(days);
        this.displayHours = this.formatCount(hours);
        this.displayMinutes = this.formatCount(minutes);
      }, 1000);
    },
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
  min-height: 390px;
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