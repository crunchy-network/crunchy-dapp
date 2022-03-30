<template>
  <div class="page_width">
    <nav-menu></nav-menu>

    <el-row>
      <el-col :xs="24" :md="17">
        <el-main>
          <el-row type="flex" justify="space-between" align="center">
            <div>
              <h2
                style="
                  font-weight: 600;
                  font-size: 24px;
                  color: #191b1f;
                  margin: 0;
                "
              >
                crDAO Dashboard
              </h2>
              <h2
                style="
                  font-weight: 300;
                  font-size: 16px;
                  color: #191b1f;
                  opacity: 0.5;
                  margin: 0;
                "
              >
                The current participation status of crDAO stakers.
              </h2>
            </div>
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
              gutter="20"
              class="grid-row"
              style="margin-top: 20px; flex-wrap: wrap"
            >
              <el-col :span="24" :md="12" :lg="6">
                <el-card class="box-card" shadow="never" style="height: 100%">
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
                      font-size: 16px;
                      margin-bottom: 5px;
                    "
                  >
                    Total crDAO
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
                        vueNumberFormat(12000, {
                          precision: 0,
                          prefix: "",
                          decimal: ".",
                          thousand: ",",
                        })
                      }}
                    </div>
                    <el-avatar
                      shape="circle"
                      :size="48"
                      src="https://ipfs.fleek.co/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u"
                    >
                    </el-avatar>
                  </el-row>
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
                      font-size: 16px;
                      margin-bottom: 0px;
                    "
                  >
                    $12.2m
                  </h2>
                </el-card>
              </el-col>
              <el-col :span="24" :md="12" :lg="6">
                <el-card class="box-card" shadow="never" style="height: 100%">
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
                      font-size: 16px;
                      margin-bottom: 5px;
                    "
                  >
                    Total crDAO Staked
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
                        vueNumberFormat(8142.12, {
                          precision: 2,
                          prefix: "",
                          decimal: ".",
                          thousand: ",",
                        })
                      }}
                    </div>
                    <el-progress
                      :percentage="17.01"
                      type="circle"
                      :width="48"
                      :stroke-width="8"
                      color="#1EC37F"
                    ></el-progress>
                  </el-row>

                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
                      font-size: 16px;
                      margin-bottom: 0px;
                    "
                  >
                    $8.2m
                  </h2>
                </el-card>
              </el-col>
              <el-col :span="24" :md="12" :lg="6">
                <div class="grid-content" style="height: 100%">
                  <el-card class="box-card" shadow="never" style="height: 100%">
                    <h2
                      style="
                        color: #191b1f;
                        opacity: 0.4;
                        font-size: 16px;
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
                          vueNumberFormat(12123.12, {
                            precision: 2,
                            prefix: "",
                            decimal: ".",
                            thousand: ",",
                          })
                        }}
                      </div>
                      <el-avatar
                        shape="circle"
                        :size="48"
                        src="https://res.cloudinary.com/melvin-manni/image/upload/v1648552189/lhpbwmibiwyq2tmxjdqv.png"
                      >
                      </el-avatar>
                    </el-row>
                  </el-card>
                </div>
              </el-col>

              <el-col :span="24" :md="12" :lg="6">
                <div class="grid-content" style="height: 100%">
                  <el-card class="box-card" shadow="never" style="height: 100%">
                    <h2
                      style="
                        color: #191b1f;
                        opacity: 0.4;
                        font-size: 16px;
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
                        1.23 yrs
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
            </el-row>
          </div>

          <div style="margin-top: 24px">
            <div>
              <h2
                style="
                  font-weight: 600;
                  font-size: 24px;
                  color: #191b1f;
                  margin: 0;
                "
              >
                My crDAO Staking
              </h2>
              <h2
                style="
                  font-weight: 300;
                  font-size: 16px;
                  color: #191b1f;
                  opacity: 0.5;
                  margin: 0;
                "
              >
                Track your staked tokens and rewards.
              </h2>
            </div>

            <el-card
              class="box-card"
              shadow="never"
              style="height: 100%; margin-top: 16px"
            >
              <el-row style="flex-wrap: wrap" gutter="20" type="flex">
                <el-col :md="10">
                  <el-row gutter="10" type="flex" justify="space-between">
                    <el-col :span="12">
                      <h2 class="stake-text_small">Total Staked</h2>
                      <h2 class="stake-text_big">5.2</h2>
                    </el-col>
                    <el-col :span="12">
                      <h2
                        style="
                          color: rgba(25, 27, 31, 0.4);

                          font-size: 12px;
                          font-weight: 600;
                          margin-bottom: 0px;
                        "
                      >
                        Staking Power
                        <el-tooltip
                          content="Total Value Locked"
                          placement="top"
                          effect="light"
                        >
                          <i
                            style="color: rgba(25, 27, 31, 1)"
                            class="fas fa-question-circle"
                          ></i>
                        </el-tooltip>
                      </h2>
                      <h2 class="stake-text_big">100%</h2>
                    </el-col>
                  </el-row>

                  <el-row
                    style="margin: 32px 0"
                    gutter="10"
                    type="flex"
                    justify="space-between"
                  >
                    <el-col :span="12">
                      <h2 class="stake-text_small">crVOTE Earned</h2>
                      <h2 class="stake-text_big">5.2</h2>
                    </el-col>
                    <el-col :span="12">
                      <h2 class="stake-text_small">crDAO Unlocks</h2>
                      <h2 class="stake-text_big">1.4 yrs</h2>
                      <h2
                        class="stake-text_small"
                        style="font-weight: 500 !important"
                      >
                        03 MAR 2024 14:23 UTC
                      </h2>
                    </el-col>
                  </el-row>

                  <el-row type="flex" justify="center">
                    <el-button
                      round
                      plain
                      type="primary"
                      style="background: #fff; font-weight: 700; min-width: 50%"
                      >Unstake
                    </el-button>
                  </el-row>
                </el-col>
                <el-col class="divider" :md="1">
                  <el-divider direction="vertical"></el-divider>
                  <el-divider direction="horizontal"></el-divider>
                </el-col>

                <el-col :md="13">
                  <el-row gutter="10" type="flex" justify="space-between">
                    <el-col :span="8">
                      <h2 class="stake-text_small">Reward Token</h2>
                      <h2
                        style="display: flex; align-items: center"
                        class="stake-text_big"
                      >
                        WTZ
                        <el-avatar
                          shape="circle"
                          :size="24"
                          style="margin-left: 5px"
                          src="data:image/png;base64,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"
                        >
                        </el-avatar>
                      </h2>
                    </el-col>
                    <el-col :span="8">
                      <h2 class="stake-text_small">Staking APR</h2>
                      <h2 class="stake-text_big">36%</h2>
                    </el-col>
                    <el-col :span="8">
                      <h2 class="stake-text_small">
                        Pool Ownership
                        <el-tooltip
                          content="Total Value Locked"
                          placement="top"
                          effect="light"
                        >
                          <i
                            style="color: rgba(25, 27, 31, 1)"
                            class="fas fa-question-circle"
                          ></i>
                        </el-tooltip>
                      </h2>
                      <h2 class="stake-text_big">12.2%</h2>
                    </el-col>
                  </el-row>

                  <el-row
                    style="margin: 22px 0"
                    gutter="10"
                    type="flex"
                    justify="center"
                  >
                    <div style="margin: 10px">
                      <h2 class="stake-text_small">End Date</h2>
                      <h2 class="stake-text_big">19 Apr 2022</h2>
                    </div>
                    <div style="margin: 10px">
                      <h2 class="stake-text_small">Earned</h2>
                      <h2 class="stake-text_big">1.4 yrs</h2>
                    </div>
                  </el-row>

                  <el-row type="flex" justify="center">
                    <el-button
                      round
                      type="primary"
                      style="font-weight: 700; min-width: 50%"
                      >Harvest
                    </el-button>
                  </el-row>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-main>
      </el-col>
      <el-col :xs="24" :md="7">
        <el-main>
          <div>
            <h2
              style="
                font-weight: 600;
                font-size: 24px;
                color: #191b1f;
                margin: 0;
              "
            >
              Stake crDAO
            </h2>
            <h2
              style="
                font-weight: 300;
                font-size: 16px;
                color: #191b1f;
                opacity: 0.5;
                margin: 0;
              "
            >
              Stake crDAO to earn farm rewards and crVOTE to participate in DAO
              votes.
            </h2>

            <el-card
              class="box-card"
              shadow="never"
              style="height: 100%; margin-top: 16px"
            >
              <el-button
                class="text-btn"
                type="text"
                @click="switchStakeTab('stake')"
                :style="
                  stakeTab === 'stake' &&
                  'color: #555CFF;  border-bottom: 1.5px solid #555CFF;'
                "
              >
                Stake
              </el-button>
              <el-button
                class="text-btn"
                type="text"
                @click="switchStakeTab('restake')"
                :style="
                  stakeTab === 'restake' &&
                  'color: #555CFF;  border-bottom: 1.5px solid #555CFF;'
                "
              >
                Re-Stake
              </el-button>
            </el-card>
          </div>
        </el-main>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import NavMenu from "./NavMenu.vue";
export default {
  components: { NavMenu },
  name: "CrDAO",
  data() {
    return {
      stakeTab: "stake",
    };
  },

  methods: {
    switchStakeTab(tab = "stake") {
      this.stakeTab = tab;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-col {
  min-height: unset;
}

.grid-row .el-col {
  margin-bottom: 10px;
}

.stake-text_small {
  color: rgba(25, 27, 31, 0.4);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0px;
}
.stake-text_big {
  color: rgba(25, 27, 31, 1);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 0px;
}
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
}
.divider .el-divider.el-divider--vertical {
  height: 100% !important;
  margin: 0 !important;
  @media (max-width: 991px) {
    display: none;
  }
}

.divider .el-divider.el-divider--horizontal {
  width: 100% !important;
  @media (min-width: 991px) {
    display: none;
  }
}

.text-btn {
  font-weight: 700;
  width: max-content;
  padding: 0;
  color: #191b1f;
  transition: 0.3s ease color;
}
</style>