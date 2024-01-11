<template>
  <div class="page_width">
    <nav-menu></nav-menu>

    <el-main>
      <el-row class="main-row" :gutter="40" type="flex" style="flex-wrap: wrap">
        <el-col>
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            style="flex-wrap: wrap; row-gap: 20px"
          >
            <el-col :md="17">
              <h2 style="font-weight: 600; font-size: 24px; margin: 0">
                CRNCHY Staking Dashboard
              </h2>
              <h2 style="margin: 0" class="color__subheading fs__16 fw__3">
                The current participation status of CRNCHY stakers. Rewards are
                accrued over a 7 day cycle and then claimable the following 7
                day cycle.
                <a
                  ref="link"
                  style="color: var(--link-btn-color); text-decoration: none"
                  href="https://crunchytez.medium.com/crunchy-network-crnhcy-staking-b4ae3ac6167e"
                  target="_blank"
                  >Read more</a
                >
              </h2>
            </el-col>
            <div>
              <button
                style="
                  background: transparent !important;
                  border: 2px solid #555cff;
                  color: #555cff;
                  display: flex;
                  align-items: center;
                  border-radius: 24px;
                  padding: 10px 20px;
                  width: max-content;
                "
                round
                type="primary"
                plain
              >
                <svg
                  width="24"
                  height="20"
                  viewBox="0 0 24 20"
                  fill="none"
                  style="margin-right: 10px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.88834 2.21684V2.21805V2.21684ZM3.90611 3.0561H3.90572H3.90611ZM4.0256 3.15486L4.0271 3.64847C4.02723 3.68643 4.02074 3.72452 4.00505 3.75914C3.96128 3.85563 3.86695 3.91303 3.76668 3.91303H3.37768C3.3228 3.91303 3.2783 3.9572 3.2783 4.01167V11.6735H2.75741V3.8065C2.75741 3.57977 2.94255 3.39599 3.17096 3.39599H3.40575C3.46079 3.39599 3.50531 3.35161 3.50516 3.297L3.50405 2.94065C3.50405 2.71513 3.68028 2.53904 3.90525 2.53904L4.57604 2.53781L4.57378 2.21022C4.57375 1.98626 4.76333 1.80547 4.99634 1.80547C5.22401 1.80547 5.40921 1.98933 5.40921 2.21531L5.41115 2.53862L6.07539 2.53904C6.29686 2.53917 6.47633 2.71745 6.47633 2.93726V3.29731C6.47633 3.35179 6.5208 3.39599 6.57571 3.39599H6.81305C7.04143 3.39599 7.22657 3.57977 7.22657 3.80647V11.6735H6.70568V4.01167C6.70568 3.9572 6.66115 3.91303 6.60625 3.91303H6.21588C6.07203 3.91303 5.95544 3.79729 5.95544 3.65449V3.15467C5.95544 3.10017 5.91091 3.056 5.85603 3.056L4.12498 3.05587C4.06997 3.05587 4.02542 3.10022 4.0256 3.15486Z"
                    fill="#555CFF"
                  />
                  <path
                    d="M12.9436 11.6735H12.4227V8.14653C12.4227 8.09187 12.3969 8.04032 12.353 8.00721L10.1808 6.36781C10.1438 6.33986 10.0922 6.34114 10.0566 6.37088L8.09925 8.00671C8.05948 8.03995 8.03654 8.08892 8.03654 8.14058V11.6735H7.51562V8.02078C7.51562 7.88667 7.57891 7.7588 7.68539 7.67672L9.8408 5.87534C9.84495 5.8719 9.84921 5.86854 9.8536 5.86533C10.0094 5.75092 10.2259 5.75222 10.3802 5.86872L12.7704 7.67265C12.8795 7.75499 12.9436 7.88325 12.9436 8.01931V11.6735Z"
                    fill="#555CFF"
                  />
                  <path
                    d="M16.643 11.6735H16.1221V5.58397C16.1221 5.54204 16.0879 5.50807 16.0457 5.50807H15.803C15.6733 5.50807 15.5683 5.40376 15.5683 5.27513V4.87211C15.5683 4.82765 15.532 4.79162 15.4872 4.79162H14.3826C14.3378 4.79162 14.3015 4.82765 14.3015 4.87211V5.27513C14.3015 5.40376 14.1964 5.50807 14.0668 5.50807H13.8299C13.7877 5.50807 13.7535 5.54204 13.7535 5.58397V11.6735H13.2326V5.34965C13.2326 5.15157 13.3943 4.991 13.5939 4.991H13.7245C13.7555 4.991 13.7806 4.96606 13.7806 4.93528V4.62654C13.7806 4.43214 13.9394 4.27456 14.1352 4.27456H15.7346C15.9304 4.27456 16.0892 4.43217 16.0892 4.62657V4.93528C16.0892 4.96606 16.1143 4.991 16.1453 4.991H16.2837C16.4821 4.991 16.643 5.15068 16.643 5.34769V11.6735Z"
                    fill="#555CFF"
                  />
                  <path
                    d="M17.1463 0.493156L17.1467 0.493392L17.1463 0.493156ZM21.2426 11.6735H20.7217V3.30331C20.7217 3.21745 20.6813 3.13652 20.6124 3.08454L17.585 0.799224C17.5315 0.75881 17.4545 0.79672 17.4545 0.863485L17.4545 5.24956C17.4545 5.26318 17.4535 5.27654 17.4514 5.28961V11.6735H16.9305V5.24956C16.9305 5.23592 16.9316 5.22258 16.9336 5.20951V0.500072L16.9324 0.370662C16.9289 0.168903 17.033 0.0791788 17.0954 0.043643C17.1933 -0.0120602 17.3162 -0.00908566 17.4168 0.0512877C17.468 0.0815268 17.5908 0.155727 17.5908 0.155727C17.5985 0.160372 17.6059 0.165382 17.613 0.170783L21.0807 2.78847C21.0838 2.79079 21.0868 2.79319 21.0898 2.79567C21.1869 2.876 21.2426 2.99341 21.2426 3.11778V11.6735Z"
                    fill="#555CFF"
                  />
                  <path
                    d="M15.7373 20H8.26271C8.17484 20 8.10364 19.9293 8.10364 19.8421V18.8163C8.10364 18.7291 8.17484 18.6584 8.26271 18.6584H15.7373C15.8252 18.6584 15.8964 18.7291 15.8964 18.8163V19.8421C15.8964 19.9293 15.8252 20 15.7373 20Z"
                    fill="#555CFF"
                  />
                  <path
                    d="M19.4126 15.8996L18.3569 17.7095C18.2563 17.8246 18.131 17.8874 18.0018 17.8874H5.94161C5.8089 17.8874 5.6804 17.8212 5.57858 17.7003L4.58644 15.8985C4.53945 15.8428 4.5672 15.7341 4.62847 15.7341H19.3715C19.4334 15.7341 19.4608 15.8445 19.4126 15.8996Z"
                    fill="#555CFF"
                  />
                  <path
                    d="M23.2648 14.9631H0.735159C0.592385 14.9631 0.476684 14.8318 0.476684 14.6698L0 12.547C0 12.385 0.115727 12.2537 0.258475 12.2537H23.7415C23.8842 12.2537 24 12.385 24 12.547L23.5233 14.6698C23.5233 14.8318 23.4076 14.9631 23.2648 14.9631Z"
                    fill="#555CFF"
                  />
                </svg>
                DAO Voting
              </button>
            </div>
          </el-row>

          <div>
            <el-row
              type="flex"
              :gutter="40"
              class="grid-row"
              style="margin-top: 20px; flex-wrap: wrap"
            >
              <el-col :span="24" :md="12" :lg="6">
                <el-card
                  v-loading="crnchyStaking.loading"
                  class="box-card"
                  style="height: 100%"
                >
                  <h2
                    style="
                      color: var(--color-subheading-text);
                      font-size: 14px;
                      margin-bottom: 5px;
                    "
                  >
                    Total CRNCHY Staked
                  </h2>
                  <el-row
                    type="flex"
                    justify="space-between"
                    style="align-items: center"
                  >
                    <div
                      style="
                        font-size: 24px;
                        font-weight: 600;
                        margin-right: 8px;
                      "
                    >
                      {{
                        vueNumberFormat(
                          crnchyStaking.summary.totalCrnchyStaked,
                          {
                            precision: 2,
                            prefix: "",
                            decimal: ".",
                            thousand: ",",
                          }
                        )
                      }}
                    </div>
                    <el-progress
                      :percentage="totalCrnchyStakedPct"
                      type="circle"
                      :width="48"
                      :stroke-width="8"
                      color="#1EC37F"
                    ></el-progress>
                  </el-row>

                  <!-- <h2
                    style="
                      color: var(--color-subheading-text);
                      font-size: 16px;
                      margin-bottom: 0px;
                    "
                  >
                    $8.2m
                  </h2> -->
                </el-card>
              </el-col>
              <el-col :span="24" :md="12" :lg="6">
                <div class="grid-content" style="height: 100%">
                  <el-card
                    v-loading="crnchyStaking.loading"
                    class="box-card"
                    style="height: 100%"
                  >
                    <h2
                      style="
                        color: var(--color-subheading-text);
                        font-size: 14px;
                        margin-bottom: 5px;
                      "
                    >
                      Total crVOTE
                    </h2>
                    <el-row
                      type="flex"
                      justify="space-between"
                      style="align-items: center"
                    >
                      <div
                        style="
                          font-size: 24px;
                          font-weight: 600;
                          margin-right: 8px;
                        "
                      >
                        {{
                          vueNumberFormat(
                            crnchyStaking.summary.totalCrvoteIssued,
                            {
                              precision: 2,
                              prefix: "",
                              decimal: ".",
                              thousand: ",",
                            }
                          )
                        }}
                      </div>
                      <el-avatar
                        shape="circle"
                        :size="48"
                        src="https://nftstorage.link/ipfs/bafkreiemgfthsxmobacmi76hyl3z5nn5rr2z4hi4qzqmiovbvfbp352rme"
                      >
                      </el-avatar>
                    </el-row>
                  </el-card>
                </div>
              </el-col>
              <el-col :span="24" :md="12" :lg="6">
                <div class="grid-content" style="height: 100%">
                  <el-card
                    v-loading="crnchyStaking.loading"
                    class="box-card"
                    style="height: 100%"
                  >
                    <h2
                      style="
                        color: var(--color-subheading-text);
                        font-size: 14px;
                        margin-bottom: 5px;
                      "
                    >
                      Average Lock Time
                    </h2>
                    <el-row
                      type="flex"
                      justify="space-between"
                      style="align-items: center"
                    >
                      <div
                        style="
                          font-size: 24px;
                          font-weight: 600;
                          margin-right: 8px;
                        "
                      >
                        {{
                          crnchyStaking.summary.avgLockTimeMs
                            | humanizeDuration({
                              maxDecimalPoints: 0,
                              largest: 2,
                            })
                        }}
                      </div>
                      <el-avatar
                        shape="circle"
                        :size="48"
                        style="background: #ffcf36"
                      >
                        <img
                          src="./../assets/svg-icons/lock.svg"
                          style="width: 24px; height: 24px; padding: 12px"
                        />
                      </el-avatar>
                    </el-row>
                  </el-card>
                </div>
              </el-col>
              <el-col :span="24" :md="12" :lg="6">
                <el-card
                  v-loading="crnchyStaking.loading"
                  class="box-card"
                  style="height: 100%"
                >
                  <h2
                    style="
                      color: var(--color-subheading-text);
                      font-size: 14px;
                      margin-bottom: 5px;
                    "
                  >
                    Total Rewards Available
                  </h2>
                  <el-row
                    type="flex"
                    justify="space-between"
                    style="align-items: center"
                  >
                    <div
                      style="
                        font-size: 24px;
                        font-weight: 600;
                        margin-right: 8px;
                      "
                    >
                      {{
                        vueNumberFormat(
                          crnchyStaking.summary.totalRewardsAvail,
                          {
                            precision: 2,
                            prefix: "",
                            decimal: ".",
                            thousand: ",",
                          }
                        )
                      }}
                    </div>
                    <el-avatar
                      shape="circle"
                      :size="48"
                      src="https://res.cloudinary.com/melvin-manni/image/upload/v1677920267/gtdqpxe3oflwbpwnzdqd.png"
                    >
                    </el-avatar>
                  </el-row>
                  <!-- <h2
                    style="
                      color: var(--color-subheading-text);
                      font-size: 16px;
                      margin-bottom: 0px;
                    "
                  >
                    $6.2K
                  </h2> -->
                </el-card>
              </el-col>
            </el-row>
          </div>

          <template v-if="wallet.connected">
            <div
              class="custom-tab__wrapper tab-wrapper tab-custom-element"
              style="margin-top: 32px"
            >
              <button
                :class="['tab-text', isActiveTab('current')]"
                @click="setActiveTab('current')"
              >
                Current Cycle
              </button>
              <button
                :class="['tab-text', isActiveTab('next')]"
                @click="setActiveTab('next')"
              >
                Next Cycle
              </button>
            </div>
            <crnchy-staking-cycle
              :active-tab="activeTab"
            ></crnchy-staking-cycle>
          </template>
          <template v-else>
            <div style="text-align: center; margin-top: 48px">
              <connect-button />
            </div>
          </template>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import CrnchyStakingCycle from "./CrnchyStakingCycle/Index.vue";
import NavMenu from "./NavMenu.vue";
import ConnectButton from "./ConnectButton.vue";

export default {
  name: "CrnchyStaking",
  components: { NavMenu, ConnectButton, CrnchyStakingCycle },
  data() {
    return {
      dialogTab: "stake",
      activeTab: "current",
    };
  },
  computed: {
    ...mapState(["wallet", "crnchyStaking"]),
    ...mapGetters(["currentCycle"]),

    totalCrnchyStakedPct: function () {
      return Number(
        (
          (this.crnchyStaking.summary.totalCrnchyStaked /
            this.crnchyStaking.summary.totalCrnchy) *
          100
        ).toFixed(1)
      );
    },
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions([
      "connectWallet",
      "disconnectWallet",
      "refreshCrnchyStakingData",
    ]),

    refresh() {
      this.refreshCrnchyStakingData();
    },

    isActiveTab(tab) {
      return this.activeTab === tab ? "is-active" : "";
    },

    setActiveTab(tab = "") {
      if (["current", "next"].includes(tab)) {
        this.activeTab = tab;
      }
    },
    showCreateDialog() {
      this.$refs.stakeRestakeDialog.showDialog();
    },
    setDialogTab(tab) {
      this.dialogTab = tab;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-col {
  min-height: unset;
}

.main-row {
  > .el-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
  }

  @media (max-width: 991px) {
    flex-direction: column;
    > .el-col:nth-child(2) {
      margin-top: 50px;
    }
  }
}
.grid-row .el-col {
  margin-bottom: 10px;
}

.staking-details-row .el-col {
  display: flex;
  flex-direction: column;
}

.stake-text_small {
  color: var(--color-subheading-text);
  font-size: 12px;
  font-weight: 700 !important;
  margin-bottom: 0px;
}
.stake-text_big {
  color: var(--primary-text);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 0px;
}
</style>
