<template>
  <button style="font-weight: 600" @click="toggleTheme">
    <i v-if="getTheme === 'light'" class="fa-solid fa-moon"></i>
    <i v-else class="fa-solid fa-sun"></i>
  </button>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "ToggleTheme",
  computed: {
    ...mapGetters(["getTheme"]),
  },
  watch: {
    getTheme(value) {
      console.log(value);
      document.documentElement.setAttribute("data-theme", value);
    },
  },
  mounted() {
    document.documentElement.setAttribute("data-theme", this.getTheme);
    this.loadLSTheme();
  },
  methods: {
    ...mapActions(["toggleTheme", "loadLSTheme"]),
  },
};
</script>

<style scoped>
button {
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  padding: 3px;
}
i {
  font-size: 20px;
  color: var(--link-btn-color) !important;
}
</style>
