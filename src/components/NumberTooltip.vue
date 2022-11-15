<template>
  <div
    v-if="
      `${number}`.split('.')[1] && `${number}`.split('.')[1].startsWith('00')
    "
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
      type: Number,
      default: 0,
    },
  },

  mounted() {
    console.log(this.number);
  },
};
</script>

<style></style>
