<template>
  <div>hello{{ getNFTs }}</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getNFTs"]),
  },
};
</script>
