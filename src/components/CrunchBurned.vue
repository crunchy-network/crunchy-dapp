<template>
  <el-card
    v-loading="loading"
    class="box-card"
    shadow="never"
    style="height: 100%; width: 100%"
  >
    <h2>CRNCHY Burned</h2>
    <h2 style="color: #ff4d4b; margin-bottom: 0">
      {{
        vueNumberFormat(burnedValue, {
          decimal: ".",
          thousand: ",",
          precision: 2,
          prefix: "",
          suffix: "",
        })
      }}
    </h2>

    <p class="light-text" style="margin: 0">
      {{
        vueNumberFormat(burnedValueUsd, {
          decimal: ".",
          thousand: ",",
          precision: 2,
          prefix: "$",
          suffix: "",
        })
      }}
    </p>
  </el-card>
</template>

<script>
import firePit from "../utils/fire-pit";

export default {
  name: "DaasCard",
  data() {
    return {
      burnedValue: 0,
      burnedValueUsd: 0,
      loading: false,
    };
  },

  created() {
    this.setBurned();
  },
  methods: {
    setBurned() {
      this.loading = true;
      firePit
        .getCrunchBurned()
        .then((resp) => {
          this.burnedValue = resp.burned;
          this.burnedValueUsd = resp.burnedUsd;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 14px;
  color: var(--color-text-secondary-opaque);
}
.el-button {
  font-weight: bold;
}
</style>
