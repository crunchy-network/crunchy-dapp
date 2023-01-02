<template>
  <div
    v-if="Number(number) !== 0 && Number(number) < dp"
    style="display: inline"
  >
    <el-tooltip :content="`${number}`" placement="top"
      ><i style="font-size: 12px" class="el-icon-info"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "NumberTooltip",
  props: {
    number: {
      type: String,
      default: "0",
    },
    dp: {
      type: Number,
      default: 0.0001,
    },
  },
};
</script>

<style></style>
