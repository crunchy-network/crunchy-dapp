<template>
  <div id="#ifo" style="max-width: 1450px; margin: auto">
    <NavMenu />
    <div id="wrapper">
      <el-row v-if="!loading" :gutter="40">
        <el-col :xs="24" :md="12"
          ><el-card
            class="grid-content box top-box box-card"
            shadow="always"
            style="min-height: 489px"
          >
            <div class="column-center">
              <div class="logo-wrapper">
                <img :src="images[project.projectLogo]" class="logo" />
              </div>
            </div>

            <div class="socials">
              <a
                v-for="link in project.links"
                :key="link.name"
                :href="link.link"
                rel="noreffere"
                target="blank"
                class="social-link"
              >
                {{ link.name }}
              </a>
            </div>
            <p v-html="project.description"></p>

            <div class="swap-box space-top">
              <p>Token Swap Rate</p>
              <p class="mid">
                <b>{{ ifo.data.swapRate }} XTZ</b>
              </p>
            </div>
          </el-card>
        </el-col>
        <el-col v-if="project.isIFO" :xs="24" :md="12"
          ><el-card
            v-loading="ifo.loading"
            class="grid-content box top-box swap-box box-card"
            shadow="always"
          >
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
                    <p v-if="!ifo.data.started">Farming Begins in:</p>
                    <p v-else>Farming Ends in:</p>
                  </div>
                  <div class="data-col">
                    <p v-if="!ifo.data.ended">
                      {{ displayDays }} days {{ displayHours }} hr
                      {{ displayMinutes }} min
                    </p>
                    <p v-else>Ended</p>
                  </div>
                </div>

                <div class="detail-row" v-if="ifo.data.ended">
                  <div class="data-col">
                    <p v-if="!ifo.data.harvesting">Harvesting Begins in:</p>
                    <p v-else>Harvesting Ends in:</p>
                  </div>
                  <div class="data-col">
                    <p v-if="displayMinutes">
                      {{ displayDays }} days {{ displayHours }} hr
                      {{ displayMinutes }} min
                    </p>
                    <p v-else>Ended</p>
                  </div>
                </div>

                <div class="detail-row" v-if="!ifo.data.harvesting && ifo.data.harvestDuration">
                  <div class="data-col">
                    <p>Harvest Lasts:</p>
                  </div>
                  <div class="data-col">
                    <p>{{ ifo.data.harvestDuration | humanizeDuration({ units: ["d"] }) }}</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Farm with:</p>
                  </div>

                  <div class="data-col">
                    <p>XTZ</p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Earn:</p>
                  </div>

                  <div class="data-col">
                    <p>{{ project.tokenSymbol }}</p>
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
                    <p>
                      {{ vueNumberFormat(ifo.data.userRecord.committed) }} XTZ
                    </p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Share:</p>
                  </div>

                  <div class="data-col">
                    <p>
                      {{
                        vueNumberFormat(ifo.data.userRecord.committedPercent, {
                          prefix: "",
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        })
                      }}%
                    </p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Projected to farm:</p>
                  </div>

                  <div class="data-col">
                    <p>
                      {{
                        vueNumberFormat(ifo.data.userRecord.projectedHarvest)
                      }}
                      {{ project.tokenSymbol }}
                    </p>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="data-col">
                    <p>Projected fee:</p>
                  </div>

                  <div class="data-col">
                    <p>
                      {{ vueNumberFormat(ifo.data.userRecord.projectedFee) }}
                      XTZ
                    </p>
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
                    <p>$CRNCHY to burn:</p>
                  </div>

                  <div class="data-col">
                    <p>TBA</p>
                  </div>
                </div>
              </div>

              <div
                v-if="wallet.connected && ifo.data.harvesting"
                class="_info-card"
                style="
                  border-radius: 22px;
                  background: #ffeecc;
                  padding: 12px 0px;
                  width: 100%;
                  margin-top: 18px;
                "
              >
                <el-row
                  type="flex"
                  align="middle"
                  justify="space-between"
                  style="margin: 0 20px"
                >
                  <el-col
                    :span="8"
                    style="color: #8c8477; font-size: 12px; text-align: left"
                    class="_info-card__title"
                    >PENDING HARVEST</el-col
                  >
                  <el-col
                    :span="16"
                    style="font-size: 12px; font-weight: 600; text-align: right"
                    >{{
                      vueNumberFormat(ifo.data.userRecord.pendingHarvest)
                    }}
                    {{ project.tokenSymbol }}</el-col
                  >
                </el-row>
              </div>

              <div style="width: 100%; margin-top: 18px">
                <connect-button v-if="wallet.connected === false" />
                <el-button
                  v-else-if="ifo.data.ended"
                  :disabled="!ifo.data.harvesting"
                  type="primary"
                  style="
                    border-radius: 10px;
                    font-weight: bold;
                    width: 100%;
                    padding: 12px 20px;
                    color: #ffffff;
                  "
                  @click="harvestIfo"
                  >HARVEST</el-button
                >
                <el-button v-else :disabled="!ifo.data.started" type="primary" @click="showStakeDialog" style="border-radius: 10px; font-weight: bold; width: 100%; padding: 12px 20px; color: #ffffff;">FARM</el-button>
              </div>
            </div>
          </el-card></el-col
        >
      </el-row>
      <!-- <el-row :gutter="30">
        <el-col class="tier-wrapper" :xs="24" :md="8">
          
        </el-col>
      </el-row> -->
      <el-row :gutter="40" style="margin-top: 1em">
        <el-col style="margin-bottom: 5px" :xs="24" :md="12">
          <el-card class="grid-content box-card info-box" shadow="always">
            <div class="column-center">
              <h1 class="title">Pool Info</h1>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>First Sale Begins</p>
              </div>

              <div class="data-col">
                <p>{{ project.startTime | moment("calendar") }}</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Last Sale Ends</p>
              </div>

              <div class="data-col">
                <p>{{ project.endTime | moment("calendar") }}</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Swap Rate</p>
              </div>

              <div class="data-col">
                <p>{{ ifo.data.swapRate }} XTZ</p>
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
                <p>
                  {{
                    vueNumberFormat(ifo.data.offeringSupply, {
                      prefix: "",
                      decimal: ".",
                      thousand: ",",
                      precision: 0,
                    })
                  }}
                  {{ project.tokenSymbol }}
                </p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col style="margin-bottom: 5px" :xs="24" :md="12">
          <el-card class="grid-content box-card info-box" shadow="always">
            <div class="column-center">
              <h1 class="title">Token Information</h1>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Name</p>
              </div>

              <div class="data-col">
                <p>{{ project.tokenName }}</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Token Symbol</p>
              </div>

              <div class="data-col">
                <p>{{ project.tokenSymbol }}</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p v-if="project.isIFO">Circultating Supply After Farm</p>
                <p v-if="!project.isIFO">Circultating Supply</p>
              </div>

              <div class="data-col">
                <p>
                  {{
                    vueNumberFormat(project.circulatingSupply, {
                      prefix: "",
                      decimal: ".",
                      thousand: ",",
                      precision: 0,
                    })
                  }}
                </p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Total Supply</p>
              </div>

              <div class="data-col">
                <p>
                  {{
                    vueNumberFormat(project.totalSupply, {
                      prefix: "",
                      decimal: ".",
                      thousand: ",",
                      precision: 0,
                    })
                  }}
                </p>
              </div>
            </div>

            <div class="detail-row">
              <div class="data-col">
                <p>Decimals</p>
              </div>

              <div class="data-col">
                <p>{{ project.decimals }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      title="Commit XTZ"
      :visible.sync="form.visible"
      width="380px"
      class="stake-dialog"
    >
      <p>Commit XTZ to harvest {{ project.tokenSymbol }}.</p>
      <el-form
        ref="form"
        :model="form"
        label-position="top"
        hide-required-asterisk
      >
        <div
          class="current-balance _info-card"
          style="
            border-radius: 22px;
            background: #ffeecc;
            padding: 12px 20px;
            margin-bottom: 18px;
          "
        >
          <el-row type="flex" align="middle" justify="space-between">
            <el-col :span="8" style="font-size: 12px" class="_info-card__title">BALANCE</el-col>
            <el-col
              :span="16"
              style="font-weight: 600; text-align: right"
              >{{
                vueNumberFormat(wallet.balance.toNumber() / 1000000)
              }}</el-col
            >
          </el-row>
        </div>
        <el-form-item
          label="Commit"
          prop="input"
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
          style="margin-bottom: 14px"
        >
          <el-input v-model="form.input" label="Commit">
            <span slot="suffix">XTZ</span>
          </el-input>
        </el-form-item>
        <el-button
          type="success"
          size="small"
          round
          style="margin-bottom: 22px"
          @click="form.input = wallet.balance.toNumber() / 1000000 - 0.5"
          >USE MAX</el-button
        >
        <el-button
          type="primary"
          style="
            border-radius: 12px;
            font-weight: bold;
            width: 100%;
            padding: 20px;
            margin-left: 0;
          "
          @click="
            form.visible = false;
            stakeIfo(form.input);
          "
          >COMMIT</el-button
        >
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { gatherAllProjectJsonFiles, importAll } from "../lib/JsonHelper";
import ConnectButton from "./ConnectButton.vue";
import NavMenu from "./NavMenu.vue";
export default {
  name: "IFO",
  components: { NavMenu, ConnectButton },
  data: () => ({
    project: null,
    images: importAll(
      require.context("../assets/project_images", false, /\.(png|jpe?g|svg)$/)
    ),
    loading: true,
    displayDays: "",
    displayHours: "",
    displayMinutes: "",
    form: {
      input: "",
      visible: false,
    },
    live: false,
    ended: false,
  }),
  computed: {
    ...mapState(["wallet", "ifo"]),
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
  watch: {
    // call again the method if the route changes
    $route: "fetchProject",
  },
  created() {
    this.fetchProject();
    this.refresh();
  },
  methods: {
    ...mapActions(["connectWallet", "loadIfoData", "stakeIfo", "harvestIfo"]),

    fetchProject() {
      const project = gatherAllProjectJsonFiles().find((p) => {
        return p.tokenName === this.$route.params.tokenName;
      });
      console.log(this.$route.params.tokenName);
      this.project = project;
      this.loading = false;
    },
    refresh() {
      const vm = this;
      this.loadIfoData().then(() => {
        vm.showTimer();
      })
    },
    formatCount(value) {
      return value < 10 ? "0" + value : value;
    },
    showTimer() {
      const vm = this;
      const timer = setInterval(() => {
        const currentTime = new Date().getTime();

        let startTime = new Date(vm.ifo.data.startTime).getTime();
        if (vm.ifo.data.started) {
          startTime = new Date(vm.ifo.data.endTime).getTime();
        }
        if (vm.ifo.data.ended) {
          startTime = new Date(vm.ifo.data.harvestTime).getTime();
          if (startTime > currentTime) {
            startTime = startTime + vm.ifo.data.harvestDuration;
          }
        }

        let timeDiff = startTime - currentTime;
        if (timeDiff <= 0) {
          vm.displayDays = "";
          vm.displayHours = "";
          vm.displayMinutes = "";
          clearInterval(timer);
          return;
        }

        const days = Math.floor(timeDiff / vm._days);
        timeDiff -= days * vm._days;
        const hours = Math.floor(timeDiff / vm._hours) % 24;
        timeDiff -= hours * vm._hours;
        const minutes = Math.floor(timeDiff / vm._minutes) % 60;

        vm.displayDays = vm.formatCount(days);
        vm.displayHours = vm.formatCount(hours);
        vm.displayMinutes = vm.formatCount(minutes);
      }, 1000);
    },

    showStakeDialog() {
      this.form.input = "";
      if (Object.prototype.hasOwnProperty.call(this.$refs, "form")) {
        this.$refs.form.resetFields();
      }
      this.form.visible = true;
    },
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
  border: var(--line-border);
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
  background: var(--border-color);
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
  color: var(--color-subheading-text) !important;
  margin: 0;
}

p.mid {
  font-size: 16px;
  line-height: 24px;
}

.swap-box {
  text-align: center;
}

.space-top {
  margin-top: 30px;
}

.swap-title {
  font-weight: 800;
  font-size: 28px;
  line-height: 42px;
  color: var(primary-text) !important;
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
  color: var(--color-subheading-text) !important;
}

.line {
  max-width: 100%;
  flex: 1;
  height: 1px;
  background: var(--border-color);
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
  color: var(--color-subheading-text) !important;
  font-weight: 800;
  font-size: 12px;
  text-align: left;
}

.detail-row .data-col:nth-child(2) p {
  text-align: right;
  color: var(--primary-text) !important;
  font-weight: 700;
  font-size: 14px;
}

.info-box .title {
  font-weight: 800;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  color: var(--primary-text) !important;
  margin-bottom: 15px;
}

.info-box .detail-row {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: var(--line-border);
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
