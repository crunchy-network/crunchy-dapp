<template>
  <div>
    <slot v-if="resolved" default />
    <slot v-else fallback />
  </div>
</template>

<script>
export default {
  name: "Suspense",
  data: () => ({
    resolved: false,
  }),
  async created() {
    const setupMethod = this.$parent.setup;
    if (!setupMethod) return;

    await setupMethod();
    this.resolved = true;
  },
};
</script>
