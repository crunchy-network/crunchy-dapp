<template>
  <el-card body-style="padding: 0; box-sizing: border-box;">
    <div>
      <img
        :src="nft.thumbnailUrl"
        alt=""
        class="_w-100"
        style="border-radius: 18px 18px 0px 0px"
      />
    </div>

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
  data() {
    return {
      select: false,
    };
  },
};
</script>

<style lang="scss" scoped>
label {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(25, 27, 31, 0.2);
  background: #fff;
  i{
    color: rgba(25,27,31,1.0);
  }
}
</style>
