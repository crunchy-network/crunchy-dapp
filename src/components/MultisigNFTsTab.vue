<template>
  <div>
    <el-row :gutter="10">
      <el-col
        v-for="(nft, index) in nfts"
        :key="index"
        :xs="24"
        :md="8"
        :lg="4"
        style="margin-bottom: 10px"
      >
        <MultisigNftCard :nft="nft" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MultisigNftCard from "./multisig/MultisigNftCard.vue";
export default {
  name: "MultisigNFTsTab",
  components: { MultisigNftCard },
  data() {
    return {
      nfts: [
        {
          id: "1",
          thumbnailUrl: require("../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "2",
          thumbnailUrl: require("../assets/multisig/nft-2.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "3",
          thumbnailUrl: require("../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "4",
          thumbnailUrl: require("../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "5",
          thumbnailUrl: require("../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "6",
          thumbnailUrl: require("../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "7",
          thumbnailUrl: require("../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "8",
          thumbnailUrl: require("../assets/multisig/nft-2.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "9",
          thumbnailUrl: require("../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "10",
          thumbnailUrl: require("../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "11",
          thumbnailUrl: require("../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "12",
          thumbnailUrl: require("../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "13",
          thumbnailUrl: require("../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "14",
          thumbnailUrl: require("../assets/multisig/nft-2.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "15",
          thumbnailUrl: require("../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "16",
          thumbnailUrl: require("../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "17",
          thumbnailUrl: require("../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
        {
          id: "18",
          thumbnailUrl: require("../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
        },
      ],
    };
  },
};
</script>

<style></style>
