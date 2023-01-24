<template>
  <div
    :style="
      marginLeft
        ? 'display: inline;   margin-left: 5px;'
        : 'display: inline;   margin-righ: 5px;'
    "
  >
    <i v-if="value === 'desc'" class="fa-light fa-arrow-down-wide-short"></i>
    <i v-if="value === 'asc'" class="fa-regular fa-arrow-up-short-wide"></i>
  </div>
</template>

<script>
export default {
  name: "SortArrowIndicator",
  props: {
    value: {
      type: String,
      default: "",
    },
    marginLeft: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
i {
  color: #555cff;
  display: inline;
  transition: 0.3s ease all;
}
</style>
