<template>
  <el-card
    v-loading="getNFTsLoading"
    style="background-color: transparent; border: 0"
    body-style="padding: 0"
    shadow="never"
  >
    <el-row
      type="flex"
      align="stretch"
      style="flex-wrap: wrap; row-gap: 20px"
      :gutter="20"
    >
      <el-col v-for="(nft, index) in tabledata" :key="index" :lg="4" :md="6">
        <nft-asset-card
          :key="index"
          :art="getImage(nft.art) || '../assets/nfts/not-found.png'"
          :thumbnail="getImage(nft.art) || '../assets/nfts/not-found.png'"
          :count="getCount(nft)"
          :icon="getImage(nft.thumbnailUri)"
          :links="nft.links"
          :link="nft.objkLink"
          :name="nft.name"
          :value="nft.value"
          :page-change="currentPage"
          :on-collection-select="
            () => {
              setCollectionName(nft.name || nft.address);
              return setCollectionView(nft.address);
            }
          "
          :type="'collections'"
        ></nft-asset-card>
      </el-col>
    </el-row>
    <div style="margin-top: auto">
      <table-pagination
        :current-page="currentPage"
        :next-page="nextPage"
        :pages="pages"
        :handle-next-page="handleNextPage"
        :handle-prev-page="handlePrevPage"
        :handle-start="handleStart"
        :handle-end="handleEnd"
      />
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import NftAssetCard from "./NftAssetCard.vue";
import TablePagination from "./TablePagination.vue";
export default {
  name: "NftCollectionsView",
  components: { NftAssetCard, TablePagination },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    setCollectionName: Function,
    // eslint-disable-next-line vue/require-default-prop
    setCollectionView: Function,

    loading: Boolean,
  },
  data() {
    return {
      currentPage: 0,
      pages: 0,
      nextPage: 1,
      prevPage: 0,
      tabledata: [],
      displayCount: 24,
    };
  },
  computed: {
    ...mapGetters(["getNFTs", "getNFTsLoading"]),
  },
  watch: {
    getNFTs(newVal) {
      console.log(newVal);
      this.paginationHandler();
    },
  },
  mounted() {
    this.paginationHandler();
  },
  methods: {
    paginationHandler() {
      const data = this.getNFTs;
      this.pages = Math.ceil(data.length / this.displayCount);
      this.handleVisibleData();
    },
    handleVisibleData() {
      const data = this.getNFTs;
      const next = this.nextPage > this.pages ? this.pages : this.nextPage;
      this.tabledata = data.slice(
        (next - 1) * this.displayCount,
        this.nextPage * this.displayCount > data.length
          ? data.length
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
    getCount(collection) {
      return collection.items?.length;
    },
    getImage(image) {
      if (!image) {
        return "https://res.cloudinary.com/melvin-manni/image/upload/v1660322565/fgpwgssbhq2bfmsjerur.png";
      }
      if (image.startsWith("assets")) {
        return (
          require(`../${image}`) ||
          "https://res.cloudinary.com/melvin-manni/image/upload/v1660322565/fgpwgssbhq2bfmsjerur.png"
        );
      }
      return (
        image ||
        "https://res.cloudinary.com/melvin-manni/image/upload/v1660322565/fgpwgssbhq2bfmsjerur.png"
      );
    },
  },
};
</script>

<style lang="scss">
#nft-wallet-view {
  .el-select .el-input__inner {
    border-radius: 24px;
  }
}
</style>
