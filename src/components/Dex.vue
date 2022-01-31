<template>
  <div style="position: relative; width: 100%; max-width: 1450px; margin: 0 auto;">
    <el-header style="position: fixed; height: 90px; top: 0; left: 230px; right: 0; background: #fff; z-index: 999; border-bottom: 1px solid #e8e8e9;">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="12"></el-col>
        <el-col :span="12">
          <div class="grid-content" style="text-align: right;">
            <NavWallet />
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-main style="margin-top: 95px;">
      <el-row type="flex" justify="center">
        <el-col style="max-width: 420px" :xs="24" :md="14" :lg="8">
          <el-card body-style="padding: 10px 8px 20px 8px" style="box-shadow: 0 !important;">
            <el-row type="flex" justify="space-between" style="align-items: center;">
              <h2 style="margin-bottom:0">
                SWAP
              </h2>
              <el-button style="border: 0; color: #191B1F; padding: 0;" circle type="text">
                <i class="fas fa-redo-alt refresh"></i>
              </el-button>
            </el-row>

            <div style="margin-top: 11px">
              <el-row type="flex" justify="space-between" style="align-items: center; padding: 2px 20px">
                <h2 style="margin: 0 10px 0 0; font-size: 12px; color: #757679; font-weight: 500 !important;">
                  From
                </h2>

                <h2 style="margin: 0; font-size: 12px; color: #757679;  text-align: right; font-weight: 500 !important; ">
                  Balance: 0 <a style="color: #555CFF; cursor: pointer; text-decoration: underline">Max</a>
                </h2>
              </el-row>
              <div>
                <div style="background: #F3F3F3; border-radius: 20px; padding: 20px 20px; position: relative;">
                  <el-row type="flex" style="align-items: center;">
                    <dex-dropdown :items="dropdownItems" :value="input" :onChange="handleInputDropChange" />
                    <div style="flex: 1;">
                      <input v-model="input.value" placeholder="VALUE" class="input-elem" type="number" />
                    </div>
                  </el-row>
                  <h2 style="0; font-size: 12px; color: #757679; font-weight: 500 !important; text-align: right; position: absolute; right: 20px; bottom: -9px;">~ $0</h2>
                </div>
              </div>

              <div style="margin-top: 16px">
                <el-card body-style="padding: 6px 20px 22px 20px; " class="_output">
                  <el-row type="flex" justify="space-between" style="align-items: center; margin-bootm: 8px">
                    <h2 style="margin: 0; font-size: 12px; color: #757679; font-weight: 500 !important;">
                      To(estimated)
                    </h2>
                    <el-row style="width: 100%" type="flex" justify="center">
                      <el-button style="cursor: pointer; width: 27px; height: 27px; display: flex; align-items: center; justify-content: center;" circle>
                        <div>
                          <svg @click="handleSwitch" width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M4.03113 4.57386L1.84944 6.75555C1.59812 7.0073 1.18982 7.0073 0.938506 6.75555C0.687116 6.504 0.687164 6.09657 0.93865 5.84508C0.938652 5.84508 0.938655 5.84507 0.938657 5.84507L4.21939 2.56408L4.21939 2.56407C4.24968 2.53378 4.28229 2.50725 4.3168 2.48411L4.31979 2.4821L4.31981 2.48212C4.32877 2.47629 4.33668 2.47186 4.34247 2.46877C4.34509 2.46738 4.34753 2.46612 4.34956 2.4651C4.36901 2.45331 4.39562 2.43819 4.42695 2.42501L4.43766 2.42051L4.43775 2.42077C4.44619 2.41768 4.45352 2.41539 4.45883 2.41381L4.46923 2.41088C4.48343 2.40578 4.51368 2.39504 4.54735 2.38821M4.03113 4.57386L5.31908 4.5739M4.03113 4.57386L4.03113 12.825C4.03113 15.4372 6.156 17.562 8.76821 17.562C9.12413 17.562 9.41218 17.2735 9.41218 16.9181C9.41218 16.5626 9.12413 16.2741 8.76821 16.2741C6.86656 16.2741 5.31908 14.7266 5.31908 12.825L5.31908 4.5739M4.03113 4.57386L5.31908 4.5739M4.54735 2.38821C4.58968 2.37947 4.63272 2.37528 4.6751 2.37528C4.71586 2.37528 4.75936 2.37891 4.80429 2.38851C4.83572 2.39503 4.86725 2.40604 4.87833 2.40998L4.87931 2.41025C4.88438 2.41161 4.90068 2.41595 4.91924 2.42337L4.92327 2.42498L4.92325 2.42501C4.954 2.43794 4.98019 2.45274 4.99954 2.46443C5.00229 2.4658 5.00564 2.46752 5.00928 2.46949C5.01613 2.4732 5.02491 2.4783 5.03468 2.48496C5.06882 2.50798 5.10124 2.53449 5.13081 2.56407L5.13082 2.56408L8.41181 5.84533C8.41182 5.84534 8.41182 5.84534 8.41182 5.84534C8.53768 5.97121 8.60034 6.13655 8.60034 6.30078C8.60034 6.46502 8.53768 6.63036 8.41181 6.75623C8.16035 7.00769 7.75243 7.0079 7.50103 6.75608M4.54735 2.38821C4.54768 2.38815 4.548 2.38808 4.54833 2.38802L4.59736 2.63315L4.54637 2.38842C4.5467 2.38835 4.54702 2.38828 4.54735 2.38821ZM7.50103 6.75608L7.67766 6.57975L7.50118 6.75622L7.50103 6.75608ZM7.50103 6.75608L5.31908 4.5739M10.4094 11.868C10.158 11.6162 9.75008 11.6164 9.49862 11.8679C9.24708 12.1194 9.24708 12.5269 9.49861 12.7785C9.49861 12.7785 9.49862 12.7785 9.49862 12.7785L12.7796 16.06L12.7796 16.06L13.0163 15.9324C12.9947 15.9179 12.9745 15.9014 12.9564 15.8832L9.6754 12.6017C9.52149 12.4478 9.52149 12.1985 9.6754 12.0446C9.82931 11.8907 10.0788 11.8907 10.2325 12.0446L12.5914 14.4038V14.0502M10.4094 11.868L10.2326 12.0445L10.4093 11.8679L10.4094 11.868ZM10.4094 11.868L12.5914 14.0502M12.5914 14.0502V5.79912C12.5914 3.89747 11.0439 2.34999 9.14222 2.34999C8.78631 2.34999 8.49825 2.06145 8.49825 1.70601C8.49825 1.35058 8.78631 1.06204 9.14222 1.06204C11.7544 1.06204 13.8793 3.18691 13.8793 5.79912V14.0502L16.061 11.8685L13.6293 14.3002V5.79912C13.6293 3.32498 11.6164 1.31204 9.14222 1.31204C8.92449 1.31204 8.74825 1.48854 8.74825 1.70601C8.74825 1.92349 8.92449 2.09999 9.14222 2.09999C11.1819 2.09999 12.8414 3.7594 12.8414 5.79912V14.3002L12.5914 14.0502ZM13.0343 16.2152C13.0489 16.2203 13.0769 16.2299 13.1068 16.236L13.1068 16.236C13.1493 16.2448 13.1922 16.2491 13.2353 16.2491C13.2801 16.2491 13.3223 16.2442 13.3614 16.2365L13.3614 16.2365L13.3639 16.236C13.3958 16.2294 13.4256 16.219 13.4391 16.2142L13.4391 16.2142L13.4398 16.214C13.4446 16.2127 13.4588 16.2089 13.4747 16.2029L13.4747 16.2031L13.4833 16.1995C13.5154 16.1861 13.5428 16.1701 13.5601 16.1596C13.563 16.1581 13.5669 16.1561 13.5712 16.1537C13.5787 16.1496 13.5886 16.1437 13.5997 16.1358L13.4544 15.9324L13.5936 16.14C13.6281 16.1168 13.6607 16.0903 13.691 16.06L16.9718 12.7793C17.0976 12.6534 17.1603 12.4881 17.1603 12.3238C17.1603 12.1597 17.0977 11.9944 16.9719 11.8685C16.7207 11.6168 16.3125 11.6168 16.0611 11.8684L13.0343 16.2152ZM16.2379 12.0452L13.8793 14.4038L13.437 15.9418C13.4394 15.9403 13.442 15.9391 13.4445 15.9379C13.4479 15.9362 13.4513 15.9346 13.4544 15.9324C13.4759 15.9179 13.4959 15.9016 13.5143 15.8832L16.795 12.6025C16.872 12.5255 16.9103 12.4247 16.9103 12.3238C16.9103 12.223 16.872 12.1221 16.795 12.0452C16.6414 11.8912 16.3916 11.8912 16.2379 12.0452ZM13.5532 16.163L13.5532 16.163L13.5532 16.163Z"
                              fill="#555CFF"
                              stroke="#555CFF"
                              stroke-width="0.5"
                            />
                          </svg>
                        </div>
                      </el-button>
                    </el-row>
                    <h2 style="margin: 0; min-width: max-content; font-size: 12px; color: #757679; text-align: right; font-weight: 500 !important; ">
                      Balance: 0
                    </h2>
                  </el-row>

                  <div style="margin: 0px 0 15px 0">
                    <dex-dropdown :items="dropdownItems" :value="output" :onChange="handleOutputDropChange" />
                  </div>

                  <div>
                    <DexResultCard
                      v-for="dex in dexResultData"
                      :key="dex.name"
                      :name="dex.name"
                      :txCost="dex.txCost"
                      :txCostUSD="dex.txCostUSD"
                      :value="dex.value"
                      :valueUSD="dex.valueUSD"
                      :best="dex.best"
                      :active="dex.name === activeDexResult.name"
                      :handleClick="
                        () => {
                          handleDexResultSelect(dex);
                        }
                      "
                    />
                  </div>
                </el-card>
              </div>

              <div style="padding: 16px 33px 0 33px">
                <el-button style="width: 100%" round type="primary">
                  SWAP
                </el-button>
              </div>
            </div>
          </el-card>

          <diV style="padding: 4px 56px 0 56px">
            <el-row type="flex" justify="space-between" align="center">
              <h2 style="margin: 0; font-size: 12px; color: #757679; font-weight: 500 !important; ">Minimum received</h2>
              <h2 style="margin: 0; font-size: 12px; color: #757679; text-align: right; font-weight: 500 !important; ">~$0 0 CRUNCH</h2>
            </el-row>

            <el-row type="flex" justify="space-between" align="center">
              <h2 style="margin: 0; font-size: 12px; color: #757679; font-weight: 500 !important; ">Price Impact (%)</h2>
              <h2 style="margin: 0; font-size: 12px; color: #757679;  text-align: right; font-weight: 500 !important; ">0.1</h2>
            </el-row>
          </diV>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import DexDropdown from "./DexDropdown.vue";
import DexResultCard from "./DexResultCard.vue";
import NavWallet from "./NavWallet.vue";
export default {
  components: { NavWallet, DexDropdown, DexResultCard },
  name: "Dex",
  data() {
    return {
      activeDexResult: {},
      dexResultData: [
        { name: "Quipuswap", txCost: 0.1, txCostUSD: 0.51, valueUSD: 0, value: 0, best: true },
        { name: "Spicyswap", txCost: 0.1, txCostUSD: 0.51, valueUSD: 0, value: 0, best: false },
      ],
      input: {
        name: "XTZ",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAABC1BMVEUAAABCfe5LcORAfetCffBDfe9CffBCfe9Cf/BBfe9Df/JBe+xDeu5Df/JCfvBCfO9Cfe9Cfe9DfvBDfvBBfe9BffA+eu9Df/JCfe8+eeVCfvFCfe9Cfe9Cfu5BffBCffBBfu8+fO9CffJEf/JEfe9CfvFDfu////9Ff+/8/f8+e+87eO9FgvdGg/rr8f5EgPRWjPFTifFAfO9Ghfz0+P5gk/I4d+5Hhv+vyPg3du7n7/1Ef/BIgvD5+v+hv/dOhvBomPNajvHP3vu50PpvnPPv9P7d6PzW5PyMsfbn7v3H2fvB1fp5pPTj7P1ml/KIrfWCqfWow/irxvi0zPmzyvmZufeStPaWt/Ywce7hqexUAAAAJnRSTlMA/QMTxv6QilFW0DQM9a9K8d7WwrYuB/nqHJnL4l4ooHMXQ9p0cw375J8AAAlzSURBVHja1VsHe9JAGE7CHqWD2ta21h2uGQQCJEZWyxbtcv//X+J3hMuJwh2XxEf9nhaoIO9737z1SUKiKIunRCH3LF1KHpzsyarc3js/SJbSr3OFBPnMH5LFFx9dZNPJ/T3LNQ3DardVkLZlGUbDNfb2y+ncxVH8HOi4EtnTM7nRMA1L9kVdiP86ZRmm2ZDP0rsJyiFO+KPc0xOrYbYpMhXKo202rJPTXJFoLDbdP8rsG67lY7MEf8Byjf30o9goKPCTPZRd4ydwLgmjIR/u4v8Zy+izZaPRBnQBAVs0rHJWiewLCsAnDZMxeIYaTKu8C18RDb5QMk1ADyWYwmGBUAiFX8wcE/hwFFKNnUxCUsIOfzcPtlcjCfjCS2IH8eFbBh+ebwfDOC1Kijh+Ie8ytC9kB/esIM7gyY5B8SMrYeeJ4PCVjEmsHwsFy8wIOIIiJUo85xePyBKNBi7+86R7DPjxMnCThAEX/3HeJPBxUjDzjwkDDv4BwY+ZQeMAGMQ7/vh1AP6Xb1D82HWQf85jkEgyxo+IhNdBMsFRQMlljF8jEpqC7JYUhYWfYdkf1a9rC6nrekgGKbmRAZiN+E/MlLwR3u4Pqr68G7acsCpImU8AaAP+ox1LVhkEqhUi3V5HReEYWDuPNjEo5lnlF/DeVy4X8PDUrGkopA6MfHGDAk5ZDohV0JlXiLyraeEdEdxgHf6uwSkASEOBDqoRCBwbu+sYFPexATgM6tVKZAJghIPiugjkZ0Bk19/FQEAlsbg6A6MRwNLA21gIpIJIoAQOqQLECYir4FBRfvFAK0XfFycg7gbZVRUcMWrQHyFgJpUVBWSZDhA/ATW1qgKlbEYjEEkFwOQFSwGIik0JXNuII9urQFGYIaDpGhGnH+SBuqP9JvqKIF4gAAFSBY9VRhW8bgVyPSKZcDwK/pnK7VUgt1ctpo0AkOQCeEy78maz126aP0mFSHONXP4szZmHuDWJXwWAwLgSTi5nHtsJ9otLBeSMFItA9bJLx0W/fpOQj8DzVxsxNECSkSI9dRkeoF13w2qg8t5m2+Cpb4PECSsI7f7DGyqfiBN0h2/Wy8MNxUc2Yk7OThJ+GeDMA3QqXicIw76nrxHte2sc4KsYn8kAbIBjgCaByInI7t/wx09tcArwjDoknIoR0mDO5uMPYfzcdHyG99YvjtXYCDjfCP5HXWXhk1x0AQRyYIF4CCB9BPA+vkbw2ek4BwTSZkwEwAH8d+n4uTZIA4FyXARUew7YGP+B4HMJlCELnBvxEEBOb4nfI/j8idl5QirsWbEQQM4HDI/xnW1X77K1V4BCIEciQN8aL/F1Lj4tB1ZOegaFIBYTDABcDB+noleQB+MggLyPYvg0DEpGDASQc3/p4zsC8NgLS1IyBgJIvx4T+6sikrKS0oEVgwY6U0DH41fFCMjWgXTejkwAeZ+wAyzsL0igfSLtRSaAvNkCf/YdTwiEKMDJt9SG50gEkH7bXGxbXd99vRvVNM8WigMJHiIRQHZnghXQnPrrhfd3HUdk1RadgD4k+0bLGfG7Xt3b3hklORoB5H0FfMJg+TueadsqoR3RCZEz6i7G3W02u0t4/DCv62hLJzyJQgBp/QlGnN+1Ov3Wh49vAwoTnyCXwHnERGQPYfCfWpqj2bbmeP2v1YBBXUNbJaKklQpNAP7udj+3wOtBVPi1vfqAMBjY29SCpGgxugnWBZiA3e/dOjoAI20Bh5DeCRh88dAWxUigHNOYB+m2dLQIQoCHyVB12LGXUUk2Uy/HfDeQG2nplSuLxOGcjO/eQf6YAbMGmPfL8SLnjsTkG4dLwH0m5SxZQAXeQ7Dy0YNU3J9WupUZVfh0qaUmmIl3qJwTmpQC2CjYIbn1Ogvf82oAeNm91RGtTXR6yp2UCk3LQWwyvMpNy9M13bPvIfJgKaojuqNN9lQmHZs/LZe2W5vSyTchUBn3Rq3RbFBZlKKWhqia/ECAN3gbVWaZLM0E3PANYQDSJS/vQAGUQI985M7hEEiTxamAQPLDOqeJH28GUSCqJRwHHuIvTi92VCEVqPaX6s+bVFB/7wk+maGQRfKcVZIA9hgvz4/OwAZCDLz6lwHdMKw+1Al+sK81XhKYdjj7xUeMwzJWQvTU69Gs93k4/NT7UPc0tLZiAIGbvo3YeVAhW/VCAtGP94UdkDXTUKRtebIkW3B6xtim4+5cdbBg+I0EcDlgb9MxNir5vqB7nqcTHYtqgG5Ugg3C3BiCAjz68tD70KGO/rsTThg+IKegEChkszoljl8b+On2ig7ytzAcMPPwfjE4sxS3gV2f+LmAZOG1iWjosSwAMRAc26uikeiRjEwLM9XAN5KKv3mIkYXwgQU9tRR0wPYkKAlNYuiAQHDEfaUj/tml74YpUQ+o0m35X72gT9676diMIHwBwEQUqMmRCVAXIMZ5cBCjElN4cRXgXfHABN26vUqOWOASLMDeqpfCq0AfbHBCpF9VaC1k16EVFQgS8L4QDYxXwhDZ6pQQGG0mkPLLAAj77JJ1lNT0YQa3K/iq9pngDzVWCFD8IBekhBg4fiKoXn9HIKRA6epnkoSqdQ1tvspTAEiBKxyM6yTVe9XTFwszW3O00ZTgNxkGWH+dqnhgCDHQP1z6YFOYlHQArFO7n1covoOYVUD8Gg8VugAhjti9mc4Hky7dJLkBfMFrPOI1CTmzLtQj/EMEXuG/up/6oH/mYRnjKpcIg9vBApaKf6Z5pWsMfOPsiHmZTcgP1Lv5Lye7015L0xESvcxGr/OJTtHt2v3H+WSCL/lNBp9nrY6jATznOh/nQqMYBU33HNTH1xw7Og5IxFmNQQSyumlKrhxifgw5QNNs/JJ7Wlsi+JxLrcIsmOA0AyUT3Gvdf/Zab0JS/u2Lzf7VbqKDuPEPAP/fv9yOGSSSrizHDH/sJuFa919scGiUEiItFpCRrFhbPIyMIin/T5OLf8n0zE3J8eC7+UKYRqPiqRGHEmTDyhQJvmir18s4Wr3yL6TQ3WaJzE4jih1k2TzGw4/S7ndoRWn3M0qFyB2Hu2UrbMOjkcwS+Cj9tkoWKIRo+TTKAB9P16myeyg3xJpeXfkwp8TYdysV0rjtV+WSkEGshrGfeRR753Exd7pV47NrnTzNHf2R3mspsZuG1m/TNKzU763fkO/NBrR+n2YTf7L9/Ogily6T5nfLb35vW4YBA8fN71lofhfTfaT2/3N88i3vneD2/2ch2/9/ABtem2hAUcJLAAAAAElFTkSuQmCC",
        value: 0,
      },
      output: {
        name: "CRUNCH",
        icon: "https://ipfs.fleek.co/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq",
        value: 0,
      },
      dropdownItems: [
        {
          name: "XTZ",
          icon:
            "data:image/png;base64,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",
        },
        {
          name: "CRUNCH",
          icon: "https://ipfs.fleek.co/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq",
        },
        {
          name: "crDAO",
          icon: "https://ipfs.fleek.co/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u",
        },
      ],
    };
  },
  methods: {
    handleInputDropChange(value) {
      this.input = value;
    },
    handleOutputDropChange(value) {
      this.output = value;
    },
    handleSwitch() {
      const temp = this.input;
      this.input = this.output;
      this.output = temp;
    },
    handleDexResultSelect(val) {
      this.activeDexResult = val;
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  transition: 0.3s ease all;
}

i.refresh {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1) rotate(-55deg);
  rotate: 40deg;
  font-size: 20px;
}

.el-card._output.is-always-shadow {
  box-shadow: 0 0px 0px 0 rgb(21 21 52 / 5%) !important;
}

.el-card {
  overflow: visible !important;
}

.input-elem {
  width: 100%;
  height: 100%;
  text-align: right;
  border: 0;
  background: transparent;
  letter-spacing: -0.02em;
  color: #191b1f;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 33px;
  :hover {
    border: 0;
  }
  outline: 0;
  &::placeholder {
    font-weight: 200;
    letter-spacing: 0.6px;
    color: rgba(25, 27, 31, 0.2);
    font-size: 16px;
  }
}
</style>
