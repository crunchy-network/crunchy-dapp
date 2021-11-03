<template>
  <div>
    <app-bar />

    <el-main>
      <nav>
        <router-link tag="span" :to="{ name: 'home' }" exact active-class="is-active">
          Home
        </router-link>
        <i class="fal fa-angle-right"></i>
        <span>Pie Slicer</span>
      </nav>

      <div class="page-header row-between">
        <div>
          <h2 style="margin-bottom: 0px">Tezzard #4156</h2>
          <h2
            style="
              color: #191b1f;
              opacity: 0.4;
              font-size: 14px;
              margin-bottom: 0px;
            "
          >
            Buy a slice(s) representing a fraction of the NFT.
          </h2>
        </div>

        <el-row>
          <el-button plain round type="primary" style="font-weight: bold">
            <i style="margin-right: 10px" class="far fa-external-link-alt"></i>
            OBJKT
          </el-button>

          <el-button plain round type="primary" style="font-weight: bold">
            <i style="margin-right: 10px" class="far fa-external-link-alt"></i>
            Tzkt
          </el-button>
        </el-row>
      </div>

      <el-row :gutter="30">
        <el-col :xs="24" :md="8">
          <div class="art-wrapper margin-bottom-32">
            <el-button
              style="
                position: absolute;
                top: 8px;
                right: 8px;
                color: #fff;
                background: #191b1f;
              "
              round
              class="icon-holder"
            >
              1
              <i class="fak fa-crunchy-basket"></i>
            </el-button>
            <img src="../assets/pie-art.png" alt="" class="art" />
          </div>

          <el-card
            class="margin-bottom-32"
            style="
              background: rgba(25, 27, 31, 0.05);
              border: 1px solid rgba(25, 27, 31, 0.1);
            "
            shadow="hover"
          >
            <div class="row-between">
              <div>
                <h2
                  style="
                    color: #191b1f;
                    opacity: 0.4;
                    font-size: 14px;
                    margin-bottom: 0px;
                  "
                >
                  Total Supply
                </h2>
                <h2 style="margin-bottom: 0px">100,000 GHOST</h2>
              </div>

              <el-button type="success" circle class="icon-holder">
                <i class="fas fa-sack-dollar"></i>
              </el-button>
            </div>
          </el-card>

          <el-card style="border: 1px solid rgba(25, 27, 31, 0.1)" shadow="hover">
            <div class="row-between">
              <div>
                <h2
                  style="
                    color: #191b1f;
                    opacity: 0.4;
                    font-size: 14px;
                    margin-bottom: 0px;
                  "
                >
                  Owned by
                </h2>
                <h2 style="margin-bottom: 0px; font-size: 19px">
                  tz1Da...sf5w3
                </h2>
              </div>

              <el-button icon="far fa-shield-check" type="success" circle plain class="icon-holder"> </el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="14">
          <el-card>
            <div class="row-between">
              <el-row>
                <el-button round @click="setTab('slices')" :style="active !== 'slices' && 'color: rgba(25, 27, 31,0.5)'" :type="active === 'slices' ? 'primary' : 'text'">
                  Slices
                </el-button>
                <el-button round @click="setTab('buyout')" :style="active !== 'buyout' && 'color: rgba(25, 27, 31,0.5)'" :type="active === 'buyout' ? 'primary' : 'text'">
                  Buyout
                </el-button>
                <el-button round @click="setTab('reserve')" :style="active !== 'reserve' && 'color: rgba(25, 27, 31,0.5)'" :type="active === 'reserve' ? 'primary' : 'text'">
                  Set Reserve
                </el-button>
              </el-row>

              <el-button circle icon="fas fa-ellipsis-v" style="width: 40px; height: 40px"> </el-button>
            </div>
            <el-divider />

            <el-row class="margin-bottom-24" :gutter="30">
              <el-col :xs="24" :md="12">
                <el-card style="border: 1px solid rgba(25, 27, 31, 0.1)" shadow="hover">
                  <div class="row-between" style="margin-bottom: 16xpx">
                    <h2
                      style="
                        color: #191b1f;
                        opacity: 0.4;
                        font-size: 18px;
                        margin-bottom: 0px;
                      "
                    >
                      Implied Valuation
                    </h2>
                    <el-avatar shape="circle" icon="fas fa-sack-dollar" :size="48" style="background: #ffcf36; font-size: 24px"></el-avatar>
                  </div>
                  <div>
                    <el-row>
                      <span style="font-size: 20px; margin-bottom: 0px">ꜩ</span>
                      <span
                        style="
                          font-weight: 700;
                          margin-top: 0px;
                          font-size: 24px;
                        "
                      >
                        100,000
                      </span>
                    </el-row>

                    <h2
                      style="
                        color: #191b1f;
                        opacity: 0.4;
                        font-size: 14px;
                        margin-bottom: 0px;
                      "
                    >
                      ≈ $700,000
                    </h2>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-card style="border: 1px solid rgba(25, 27, 31, 0.1)" shadow="hover">
                  <div class="row-between" style="margin-bottom: 16xpx">
                    <h2
                      style="
                        color: #191b1f;
                        opacity: 0.4;
                        font-size: 18px;
                        margin-bottom: 0px;
                      "
                    >
                      Slices Sold
                    </h2>
                    <el-progress :percentage="29.51" type="circle" :width="48" :stroke-width="8" color="#1EC37F" style="float: right"></el-progress>
                  </div>
                  <div>
                    <el-row>
                      <span
                        style="
                          font-weight: 700;
                          margin-top: 0px;
                          font-size: 24px;
                        "
                      >
                        29.51%
                      </span>
                    </el-row>

                    <h2
                      style="
                        color: #191b1f;
                        opacity: 0.4;
                        font-size: 14px;
                        margin-bottom: 0px;
                      "
                    >
                      ≈ 29,51.954 GHOST
                    </h2>
                  </div>
                </el-card>
                    
              </el-col>
            </el-row>

            <el-divider class="margin-bottom-24" />
            
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";
export default {
  components: { AppBar },
  name: "PieSlicer",
  data: () => ({
    active: "slices",
  }),
  methods: {
    setTab(type) {
      if (["slices", "buyout", "reserve"].includes(type)) {
        this.active = type;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  align-items: center;
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.02em;
    color: #191b1f6b;
  }
  span:first-child {
    color: #555cff;
  }

  i {
    margin: 0 10px;
  }
}

.row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header {
  margin-bottom: 27px;
}

.art-wrapper {
  position: relative;
  width: 100%;
  .art {
    width: 100%;
  }
}
.icon-holder {
  padding: 10px;
}

.margin-bottom-32 {
  margin-bottom: 32px;
}

.margin-bottom-24 {
  margin-bottom: 24px;
}
</style>
