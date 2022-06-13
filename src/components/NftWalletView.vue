<template>
  <div
    id="nft-wallet-view"
    style="min-height: 50vh; display: flex; flex-direction: column"
  >
    <el-row type="flex" style="justify-content: flex-end; margin-bottom: 36px">
      <div>
        <el-select collapse-tags value="collections" placeholder="Collections">
          <el-option class="select" label="Collections" value="collections">
          </el-option>
        </el-select>
      </div>
    </el-row>

    <el-row type="flex" align="stretch" :gutter="20">
      <el-col v-for="(nft, index) in tabledata" :key="index" :span="4">
        <nft-asset-card
          :art="nft.assets[0]"
          :count="nft.count"
          :icon="nft.icon"
          :name="nft.name"
          type="Collection"
        ></nft-asset-card>
      </el-col>
    </el-row>
    <div style="margin-top: auto">
      <div id="pagination">
        <el-button
          :disabled="currentPage === 0"
          style="margin-right: 12px"
          @click="handleStart"
        >
          <i class="fal fa-angle-left"></i>
          <i class="fal fa-angle-left"></i>
        </el-button>
        <el-button :disabled="currentPage === 0" @click="handlePrevPage">
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
        <el-button :disabled="nextPage + 1 > pages" @click="handleNextPage">
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
</template>

<script>
import NftAssetCard from "./NftAssetCard.vue";
export default {
  name: "NftWalletView",
  components: { NftAssetCard },
  data() {
    return {
      currentPage: 0,
      pages: 0,
      nextPage: 1,
      prevPage: 0,
      tabledata: [],
      displayCount: 12,
      collection: [
        {
          count: 100,
          name: "CyberKidz Club",
          icon: require("../assets/nfts/icon1.png"),
          assets: [require("../assets/nfts/1.png")],
        },
        {
          count: 1,
          name: "Froggos",
          icon: require("../assets/nfts/icon2.png"),
          assets: [require("../assets/nfts/2.png")],
        },
        {
          count: 1005,
          name: "CyberKidz Club",
          icon: require("../assets/nfts/icon3.png"),
          assets: [require("../assets/nfts/3.png")],
        },
        {
          count: 100,
          name: "CyberKidz Club",
          icon: require("../assets/nfts/icon1.png"),
          assets: [require("../assets/nfts/1.png")],
        },
        {
          count: 1,
          name: "Froggos",
          icon: require("../assets/nfts/icon2.png"),
          assets: [require("../assets/nfts/2.png")],
        },
        {
          count: 1005,
          name: "CyberKidz Club",
          icon: require("../assets/nfts/icon3.png"),
          assets: [require("../assets/nfts/3.png")],
        },
      ],
    };
  },
  mounted() {
    this.paginationHandler();
  },
  methods: {
    _() {
      console.log(this.collection);
    },
    paginationHandler() {
      this.pages = Math.ceil(this.collection.length / this.displayCount);
      this.handleVisibleData();
    },
    handleVisibleData() {
      const next = this.nextPage > this.pages ? this.pages : this.nextPage;
      this.tabledata = this.collection.slice(
        (next - 1) * this.displayCount,
        this.nextPage * this.displayCount > this.collection.length
          ? this.collection.length
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
</style>
