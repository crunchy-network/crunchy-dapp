<template>
  <el-card body-style="padding: 0; box-sizing: border-box;">
    <img
      :src="nft.thumbnailUrl"
      alt=""
      class="_w-100"
      style="border-radius: 18px 18px 0px 0px"
    />

    <div style="padding: 5px 13px 10px">
      <p class="xs-text">{{ nft.name }}</p>
      <p class="xs-text">#{{ nft.tokenId }}</p>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "MultisigNftCard",
  props: {
    nft: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
