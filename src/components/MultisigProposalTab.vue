<template name="table">
  <el-card style="margin-top: 24px">
    <div class="responsive-table">
      <div>
        <el-row type="flex" :gutter="20" class="_table-header">
          <el-col :span="4"> Action </el-col>
          <el-col :span="8"> Details </el-col>
          <el-col :span="4">Expires</el-col>
          <el-col class="text-right" :span="4"> Status </el-col>
          <el-col class="text-right" :span="4"> </el-col>
        </el-row>
        <multisig-proposal-row
          v-for="(history, index) in histories"
          :key="index"
          :items="history.items"
          :date="history.date"
        />
      </div>
    </div>
  </el-card>
</template>
<script>
import MultisigProposalRow from "./MultisigProposalRow.vue";
export default {
  name: "MultisigProposalTab",
  components: { MultisigProposalRow },

  data() {
    return {
      histories: [
        {
          date: "March 21, 2022",
          items: [
            {
              action: "lambda",
              time: "12:23 UTC",
              to: "KT1BFFRQ22D6kigYTvZTiihnoXiqpec65obj",
              amount: 20024,
              tokenSymbol: "XTZ",
              expireDate: "March 30, 2022",
              expireTime: "12:23 UTC",
              status: {
                total: 3,
                pending: 2,
                signed: false,
              },
            },
          ],
        },
        {
          date: "March 14, 2022",
          items: [
            {
              action: "send",
              time: "22:23 UTC",
              to: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX",
              amount: 32000,
              tokenSymbol: "IDZ",
              expireDate: "March 30, 2022",
              expireTime: "22:23 UTC",
              status: {
                total: 3,
                pending: 3,
                signed: true,
              },
            },
          ],
        },
        {
          date: "March 13, 2022",
          items: [
            {
              action: "send",
              time: "12:23 UTC",
              to: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX",
              amount: 42000,
              tokenSymbol: "IDZ",
              expireDate: "March 30, 2022",
              expireTime: "21:21 UTC",
              status: {
                total: 3,
                pending: 2,
                signed: true,
              },
            },
          ],
        },
      ],
    };
  },
  mounted() {
    console.log(this.histories);
  },
};
</script>

<style></style>
