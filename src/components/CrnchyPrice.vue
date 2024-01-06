<template>
  <el-card
    v-loading="loading"
    shadow="never"
    style="border: 0 !important; background: transparent !important"
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
      src="https://nftstorage.link/ipfs/bafkreifcxtpqojfllakxbhkmy5qfcur7izyyr2e7c6ukm7y43v3scgsszi"
      fit="cover"
      shape="circle"
      :size="30"
      style="
        position: relative;
        border: 4px solid #fff;
        vertical-align: middle;
        margin-right: 5px;
      "
    ></el-avatar>
    <price-format
      :value="currentPrice"
      :usd-value="currentPriceUsd"
      :font-size="16"
      :font-weight="500"
      line-height="24px"
      :precision="4"
    />
  </el-card>
</template>

<script>
import dexIndexer from "../utils/dex-indexer";
import tzkt from "../utils/tzkt";
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

  mounted() {
    this.getCrnchyPrice();
    setInterval(() => {
      this.softLoadCrnchyPrice();
    }, 1000 * 60 * 5);
  },

  methods: {
    async getCrnchyPrice() {
      this.loading = true;
      try {
        let crnchy = await dexIndexer.getToken(
          process.env.VUE_APP_CONTRACTS_CRNCHY,
          "0"
        );
        crnchy = crnchy[0];
        const xtzUsd = await tzkt.getXtzUsdPrice();
        const priceXTZ = crnchy?.quotes.find(
          (el) => el.token.tokenAddress === "tez"
        )?.quote;

        this.price = Number(priceXTZ);
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
        let crnchy = await dexIndexer.getToken(
          process.env.VUE_APP_CONTRACTS_CRNCHY,
          "0"
        );
        crnchy = crnchy[0];
        const xtzUsd = await tzkt.getXtzUsdPrice();
        const priceXTZ = crnchy?.quotes.find(
          (el) => el.token.tokenAddress === "tez"
        )?.quote;

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
