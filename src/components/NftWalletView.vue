<template>
  <div id="nft-wallet-view">
    <el-row type="flex" style="justify-content: flex-end; margin-bottom: 16px">
      <div>
        <el-select collapse-tags value="collections" placeholder="Collections">
          <el-option class="select" label="Collections" value="collections"> </el-option>
        </el-select>
      </div>
    </el-row>

    <el-row type="flex" align="stretch" :gutter="20">
        <el-col v-for="(nft, index) in collection" :key="index" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <nft-asset-card :art="nft.assets[0]" :count="nft.count" :icon="nft.icon" :name="nft.name" type="Coollection"></nft-asset-card>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import NftAssetCard from "./NftAssetCard.vue";
export default {
  components: { NftAssetCard },
  name: "NftWalletView",
  data() {
    return {
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
      ],
    };
  },

  methods: {
    _() {
      console.log(this.collection);
    },
  },
};
</script>

<style lang="scss" scoped></style>
