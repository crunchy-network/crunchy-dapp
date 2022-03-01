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
      <row-pagination
        :currentPage="currentPage"
        :handleEnd="handleEnd"
        :handleNextPage="handleNextPage"
        :handlePrevPage="handlePrevPage"
        :handleStart="handleStart"
        :nextPage="nextPage"
        :pages="pages"
      ></row-pagination>
    </div>
  </div>
</template>

<script>
import NftAssetCard from "./NftAssetCard.vue";
import RowPagination from "./RowPagination.vue";
export default {
  components: { NftAssetCard, RowPagination },
  name: "NftWalletView",
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
</style>
