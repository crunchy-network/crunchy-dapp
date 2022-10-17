<template>
  <div>
    <nav-menu></nav-menu>

    <el-main class="page_width">
      <el-row
        :gutter="20"
        type="flex"
        style="margin-bottom: 30px; flex-wrap: wrap; row-gap: 10px"
      >
        <el-col :md="19">
          <el-row
            type="flex"
            justify="space-between"
            style="flex-wrap: wrap; gap: 10px"
          >
            <el-col :xs="24" :span="18" class="grid-content">
              <h2
                style="
                  margin-top: 0;
                  margin-bottom: 5px;
                  font-weight: 700;
                  font-size: 28px;
                  line-height: 42px;
                "
              >
                Tezos Token Tracker
              </h2>
              <span
                style="
                  color: #8c8d8f;
                  font-weight: 400;
                  font-size: 16px;
                  line-height: 24px;
                "
                >The Tezos ecosystem crypto currency market cap by
                project.</span
              >
            </el-col>

            <div class="show-md" :span="5" style="text-align: right">
              <el-button
                type="primary"
                round
                icon="fa-solid fa-wallet"
                style="
                  font-weight: bold;
                  background: #ffffff;
                  border: 2px solid #555cff;
                  color: #555cff;
                "
                >{{ " " }}My Portfolio</el-button
              >
            </div>
          </el-row>

          <el-row
            type="flex"
            :gutter="20"
            style="margin-top: 24px; flex-wrap: wrap; row-gap: 20px"
          >
            <el-col :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card class="box-card" shadow="always" style="height: 100%">
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
                      font-size: 14px;
                      margin: 0;
                    "
                  >
                    EST Total Mkt Cap
                  </h2>
                  <div
                    style="
                      font-weight: 700;
                      font-size: 24px;
                      margin-top: 14px;
                      margin-bottom: 5px;
                      margin-top: 4px;
                    "
                  >
                    {{
                      vueNumberFormat(120.21, {
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                        prefix: "$",
                        suffix: "M",
                      })
                    }}
                  </div>
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
                      font-size: 16px;
                      margin: 0px;
                    "
                  >
                    {{
                      vueNumberFormat(82.2, {
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                        prefix: "$",
                        suffix: "M",
                      })
                    }}
                  </h2>
                </el-card>
              </div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card class="box-card" shadow="always" style="height: 100%">
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
                      font-size: 14px;
                      margin: 0;
                    "
                  >
                    24h Total Vol
                  </h2>
                  <div
                    style="
                      font-weight: 700;
                      font-size: 24px;
                      margin-top: 14px;
                      margin-bottom: 5px;
                      margin-top: 4px;
                    "
                  >
                    {{
                      vueNumberFormat(1.2, {
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                        prefix: "$",
                        suffix: "M",
                      })
                    }}
                  </div>
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
                      font-size: 16px;
                      margin: 0px;
                    "
                  >
                    {{
                      vueNumberFormat(500, {
                        decimal: ".",
                        thousand: ",",
                        precision: 0,
                        prefix: "$",
                        suffix: "K",
                      })
                    }}
                  </h2>
                </el-card>
              </div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card class="box-card" shadow="always" style="height: 100%">
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
                      font-size: 14px;
                      margin: 0;
                    "
                  >
                    Tokens Tracked
                  </h2>
                  <div
                    style="
                      font-weight: 700;
                      font-size: 24px;
                      margin-top: 14px;
                      margin-bottom: 5px;
                      margin-top: 4px;
                    "
                  >
                    {{ 524 }}
                  </div>
                </el-card>
              </div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card class="box-card" shadow="always" style="height: 100%">
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
                      font-size: 14px;
                      margin: 0;
                    "
                  >
                    DEX’s Tracked
                  </h2>
                  <div
                    style="
                      font-weight: 700;
                      font-size: 24px;
                      margin-top: 14px;
                      margin-bottom: 5px;
                      margin-top: 4px;
                    "
                  >
                    {{ 4 }}
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>

          <el-row style="margin-top: 30px">
            <el-col :xs="12" :span="10">
              <div class="grid-content search-input">
                <el-input
                  placeholder="Search tokens"
                  prefix-icon="fad fa-search"
                >
                </el-input></div
            ></el-col>
          </el-row>
        </el-col>
        <el-col class="hide-md" :span="5" style="text-align: right">
          <router-link :to="'/'">
            <el-button
              type="primary"
              round
              icon="fa-solid fa-wallet"
              style="
                font-weight: bold;
                background: #ffffff;
                border: 2px solid #555cff;
                color: #555cff;
              "
              >{{ " " }}My Portfolio</el-button
            ></router-link
          >
          <div style="margin-top: 14px">
            <img
              style="width: 80%"
              src="../assets/token-tracker-vector.svg"
              alt=""
            />
          </div>
        </el-col>
      </el-row>
      <div>
        <el-card shadow="always">
          <div class="responsive-table">
            <div>
              <el-row
                type="flex"
                align="middle"
                style="
                  color: #757679;
                  font-size: 14px;
                  font-weight: 600;
                  border-bottom: 2px solid #f4f4f4;
                  padding-bottom: 14px;
                  margin-bottom: 14px;
                  min-width: 900px;
                  opacity: 0.6;
                "
              >
                <el-col :span="24">
                  <el-row
                    :gutter="20"
                    type="flex"
                    align="middle"
                    style="padding: 0 20px"
                  >
                    <el-col :span="2">#</el-col>

                    <el-col :span="4">Token</el-col>

                    <el-col style="text-align: right" :span="4">Price</el-col>
                    <el-col style="text-align: right" :span="4"
                      >24h Volume</el-col
                    >
                    <el-col style="text-align: right" :span="4">Mkt Cap</el-col>
                    <el-col style="text-align: right" :span="2"
                      >1d
                      <el-tooltip
                        content="% Change in XTZ"
                        placement="top"
                        effect="light"
                      >
                        <i class="fa-regular fa-info-circle"></i>
                      </el-tooltip>
                    </el-col>
                    <el-col style="text-align: right" :span="2"
                      >7d
                      <el-tooltip
                        content="% Change in XTZ"
                        placement="top"
                        effect="light"
                      >
                        <i class="fa-regular fa-info-circle"></i>
                      </el-tooltip>
                    </el-col>
                    <el-col style="text-align: right" :span="2"
                      >30d
                      <el-tooltip
                        content="% Change in XTZ"
                        placement="top"
                        effect="light"
                      >
                        <i class="fa-regular fa-info-circle"></i>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>

              <TokenTrakerRow
                v-for="(asset, index) in tokens"
                :id="index + 1"
                :key="index"
                :asset="asset"
              />
              <div id="pagination">
                <el-button
                  :disabled="currentPage === 0"
                  style="margin-right: 12px"
                  @click="handleStart"
                >
                  <i class="fal fa-angle-left"></i>
                  <i class="fal fa-angle-left"></i>
                </el-button>
                <el-button
                  :disabled="currentPage === 0"
                  @click="handlePrevPage"
                >
                  <i class="fal fa-angle-left"></i>
                </el-button>

                <h2
                  style="
                    font-weight: 800;
                    font-size: 14px;
                    color: #191b1f;
                    opacity: 0.5;
                    margin: 0 19px;
                  "
                >
                  {{
                    vueNumberFormat(nextPage > pages ? pages : nextPage, {
                      prefix: "",
                      decimal: ".",
                      thousand: ",",
                      precision: 0,
                    })
                  }}
                  out of
                  {{
                    vueNumberFormat(pages, {
                      prefix: "",
                      decimal: ".",
                      thousand: ",",
                      precision: 0,
                    })
                  }}
                </h2>
                <el-button
                  :disabled="nextPage + 1 > pages"
                  @click="handleNextPage"
                >
                  <i class="fal fa-angle-right"></i>
                </el-button>

                <el-button
                  :disabled="nextPage + 1 > pages"
                  style="margin-left: 12px"
                  @click="handleEnd"
                >
                  <i class="fal fa-angle-right"></i>
                  <i class="fal fa-angle-right"></i>
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script>
import TokenTrakerRow from "./TokenTrakerRow.vue";
import NavMenu from "./NavMenu.vue";

export default {
  name: "TokenTracker",
  components: {
    TokenTrakerRow,
    NavMenu,
  },
  data() {
    return {
      activeTab: "wallet",
      tabledata: [],
      tokens: [
        {
          id: "1",
          token: "CRUNCH",
          price: 8.11,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://cloudflare-ipfs.com/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq",
          volume24: 3480,
          mktCap: 98940000,
          change1d: -1.3,
          change7d: 1.9,
          change30d: 3.2,
        },
        {
          id: "1",
          token: "crDAO",
          price: 70.31,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://cloudflare-ipfs.com/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u",
          volume24: 99870000,
          mktCap: 843000,
          change1d: 10,
          change7d: 11.9,
          change30d: 13.2,
        },
        {
          id: "1",
          token: "kUSD",
          price: 1.1,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://kolibri-data.s3.amazonaws.com/logo.png",
          volume24: 19210000,
          mktCap: 1330000,
          change1d: -1.3,
          change7d: -1,
          change30d: -4.2,
        },
        {
          id: "1",
          token: "USDT",
          price: 1.01,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://cloudflare-ipfs.com/ipfs/bafybeibi45na6dimqwdznpj6m254vos6hez7232mqrrbj27xzwsh36gz4i",
          volume24: 10400000,
          mktCap: 2140000,
          change1d: -13,
          change7d: 129,
          change30d: 32,
        },
        {
          id: "1",
          token: "GIF",
          price: 8.11,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://cloudflare-ipfs.com/ipfs/QmQxoTVVuFS677TQJFdVh1PNRoBmVbvkwJSxe1xvf9cSqU",
          volume24: 348000,
          mktCap: 98940000,
          change1d: -1.3,
          change7d: 1.9,
          change30d: 3.2,
        },
        {
          id: "1",
          token: "crDAO",
          price: 70.31,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://cloudflare-ipfs.com/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u",
          volume24: 99870000,
          mktCap: 843000,
          change1d: 10,
          change7d: 11.9,
          change30d: 13.2,
        },
        {
          id: "1",
          token: "kUSD",
          price: 1.1,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://kolibri-data.s3.amazonaws.com/logo.png",
          volume24: 19210000,
          mktCap: 1330000,
          change1d: -1.3,
          change7d: -1,
          change30d: -4.2,
        },
        {
          id: "1",
          token: "USDT",
          price: 1.01,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://cloudflare-ipfs.com/ipfs/bafybeibi45na6dimqwdznpj6m254vos6hez7232mqrrbj27xzwsh36gz4i",
          volume24: 10400000,
          mktCap: 2140000,
          change1d: -13,
          change7d: 129,
          change30d: 32,
        },
        {
          id: "1",
          token: "GIF",
          price: 8.11,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://cloudflare-ipfs.com/ipfs/QmQxoTVVuFS677TQJFdVh1PNRoBmVbvkwJSxe1xvf9cSqU",
          volume24: 348000,
          mktCap: 98940000,
          change1d: -1.3,
          change7d: 1.9,
          change30d: 3.2,
        },
        {
          id: "1",
          token: "GIF",
          price: 8.11,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://cloudflare-ipfs.com/ipfs/QmQxoTVVuFS677TQJFdVh1PNRoBmVbvkwJSxe1xvf9cSqU",
          volume24: 348000,
          mktCap: 98940000,
          change1d: -1.3,
          change7d: 1.9,
          change30d: 3.2,
        },
        {
          id: "1",
          token: "crDAO",
          price: 70.31,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://cloudflare-ipfs.com/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u",
          volume24: 99870000,
          mktCap: 843000,
          change1d: 10,
          change7d: 11.9,
          change30d: 13.2,
        },
        {
          id: "1",
          token: "kUSD",
          price: 1.1,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://kolibri-data.s3.amazonaws.com/logo.png",
          volume24: 19210000,
          mktCap: 1330000,
          change1d: -1.3,
          change7d: -1,
          change30d: -4.2,
        },
        {
          id: "1",
          token: "USDT",
          price: 1.01,
          thumbnail:
            "https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://img.templewallet.com/insecure/fill/50/50/ce/0/plain/https://cloudflare-ipfs.com/ipfs/bafybeibi45na6dimqwdznpj6m254vos6hez7232mqrrbj27xzwsh36gz4i",
          volume24: 10400000,
          mktCap: 2140000,
          change1d: -13,
          change7d: 129,
          change30d: 32,
        },
      ],
      showUsd: false,
      currentPage: 0,
      pages: 0,
      nextPage: 1,
      prevPage: 0,
      displayCount: 12,
    };
  },

  watch: {
    tokens() {
      this.paginationHandler();
    },
    tableData(newVal) {
      console.log(newVal);
    },
  },

  mounted() {
    console.log(this.tokens);
    this.paginationHandler();
    console.log(this.tableData);
  },

  methods: {
    paginationHandler() {
      this.pages = Math.ceil(this.tokens.length / this.displayCount);
      this.handleVisibleData();
    },

    handleVisibleData() {
      const next = this.nextPage > this.pages ? this.pages : this.nextPage;
      this.tableData = this.tokens.slice(
        (next - 1) * this.displayCount,
        this.nextPage * this.displayCount > this.tokens.length
          ? this.tokens.length
          : next * this.displayCount
      );
    },

    handleNextPage() {
      if (this.nextPage + 1 <= this.pages) {
        this.currentPage = this.nextPage;
        this.prevPage = this.nextPage - 1;
        this.nextPage = this.nextPage + 1;
        this.handleVisibleData();
      }
    },

    handlePrevPage() {
      if (this.currentPage > 0) {
        this.currentPage = this.prevPage;
        this.nextPage = this.prevPage + 1;
        this.prevPage = this.prevPage - 1;
        this.handleVisibleData();
      }
    },

    handleEnd() {
      if (this.currentPage !== this.pages) {
        this.currentPage = this.pages;
        this.nextPage = this.pages;
        this.prevPage = this.pages - 1;
        this.handleVisibleData();
      }
    },

    handleStart() {
      if (this.currentPage !== 0) {
        this.currentPage = 0;
        this.nextPage = 1;
        this.prevPage = 0;
        this.handleVisibleData();
      }
    },
    resetPagination() {
      this.currentPage = 0;
      this.pages = 0;
      this.nextPage = 1;
      this.prevPage = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

.el-divider--vertical {
  height: 120% !important;
}

.el-card.top {
  box-shadow: unset !important;
  padding-left: 20px;
}

.tab-wrapper {
  display: flex;
  align-items: flex-start;
}

.tab-text {
  min-width: 100px;
  text-align: center;
  padding: 2px 20px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: #757679;
  cursor: pointer;
  transition: 0.3s ease all;
  margin: 0;
  border: 0;
  border-bottom: 3px solid transparent;
  background: transparent;
  &:disabled {
    color: #191b1f66;
    cursor: not-allowed;
  }
}

.divider {
  opacity: 0.26;
}

.divider .el-divider.el-divider--horizontal {
  margin: 0 !important;
}

#pagination {
  margin-top: 32px;
  padding: 20px 0 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid rgba(25, 27, 31, 0.05);
  .el-button {
    width: 42px;
    height: 42px;
    color: rgba(25, 27, 31, 0.5);
    padding: 13px;
    background: rgba(25, 27, 31, 0.04);
    border: 1px solid rgba(25, 27, 31, 0.2);
    box-sizing: border-box;
    border-radius: 8px;
  }
}

.el-input__inner {
  border-radius: 28px;
}

.tab-select-element {
  display: none;
  width: 100%;
}

.show-md {
  display: none;
}

.hide-md {
  display: block;
}

@media (max-width: 993px) {
  .show-md {
    display: block;
  }

  .hide-md {
    display: none;
  }
}

@media (max-width: 600px) {
  .tab-select-element {
    display: block;
  }

  .tab-custom-element {
    display: none;
  }
}
</style>
