<template>
  <el-card
    v-loading="loading"
    shadow="never"
    style="border: 0"
    body-style="
        display: flex;
        align-items: center;
        height: max-content;
        width: fit-content;
        row-gap: 5px;
        padding: 0;
      "
  >
    <el-avatar
      src="https://fleek.ipfs.io/ipfs/bafkreifcxtpqojfllakxbhkmy5qfcur7izyyr2e7c6ukm7y43v3scgsszi"
      fit="cover"
      shape="circle"
      :size="30"
      style="position: relative; border: 4px solid #fff; vertical-align: middle"
    ></el-avatar>
    <price-format
      :value="currentPrice"
      :usd-value="currentPriceUsd"
      color=" #191b1f"
      :font-size="16"
      :font-weight="500"
      line-height="24px"
      :precision="4"
    />
  </el-card>
</template>

<script>
import coingecko from "../utils/coingecko";
import queryDipdup from "../utils/queryDipdup";
import PriceFormat from "./PriceFormat.vue";
export default {
  name: "CrnchyPrice",
  components: { PriceFormat },
  data() {
    return {
      price: 0,
      priceUsd: 0,
      loading: false,
    };
  },
  computed: {
    currentPrice() {
      return this.price;
    },
    currentPriceUsd() {
      return this.priceUsd;
    },
  },

  created() {
    this.getCrnchyPrice();
    setInterval(() => {
      this.softLoadCrnchyPrice();
    }, 1000 * 60 * 5);
  },

  methods: {
    async getCrnchyPrice() {
      this.loading = true;
      try {
        const xtzUsd = await coingecko.getXtzUsdPrice();
        const priceXTZ = await queryDipdup.getTokenPriceXTZ(
          `${process.env.VUE_APP_CONTRACTS_CRNCHY}_0`
        );

        this.price = priceXTZ;
        this.priceUsd = xtzUsd * priceXTZ;
      } catch (error) {
        console.log("\n\n------ begin:  ------");
        console.log("ERROR", error);
        console.log("------ end:  ------\n\n");
      } finally {
        this.loading = false;
      }
    },
    async softLoadCrnchyPrice() {
      try {
        const xtzUsd = await coingecko.getXtzUsdPrice();
        const priceXTZ = await queryDipdup.getTokenPriceXTZ(
          `${process.env.VUE_APP_CONTRACTS_CRNCHY}_0`
        );

        this.price = priceXTZ;
        this.priceUsd = xtzUsd * priceXTZ;
      } catch (error) {
        console.log("\n\n------ begin:  ------");
        console.log("ERROR", error);
        console.log("------ end:  ------\n\n");
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
