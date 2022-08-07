<template name="table">
  <el-card style="margin-top: 24px">
    <div class="responsive-table">
      <div>
        <el-row class="_table-header" type="flex" align="middle">
          <el-col :span="24">
            <el-row
              type="flex"
              align="middle"
              :gutter="20"
              style="padding: 0 20px"
            >
              <el-col style="padding-left: 10px" :span="5"> Action </el-col>
              <el-col :span="9"> Details </el-col>
              <el-col class="text-right" :span="5"> Transaction ID </el-col>
              <el-col class="text-right" :span="5"> Status </el-col>
            </el-row>
          </el-col>
        </el-row>
        <multisig-history-row
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
import MultisigHistoryRow from "./MultisigHistoryRow.vue";
export default {
  name: "MultisigHistoryTab",
  components: { MultisigHistoryRow },
  data() {
    return {
      histories: [
        {
          date: "March 21, 2022",
          items: [
            {
              action: "send",
              time: "12:23 UTC",
              to: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX",
              amount: 20024,
              tokenSymbol: "XTZ",
              status: {
                total: 3,
                pending: 2,
                signed: false,
              },
            },
            {
              action: "send",
              time: "12:23 UTC",
              to: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX",
              amount: 21124,
              tokenSymbol: "IDZ",
              status: {
                total: 3,
                pending: 1,
                signed: true,
              },
            },
          ],
        },
        {
          date: "March 20, 2022",
          items: [
            {
              action: "exchange",
              time: "12:23 UTC",
              from: {
                amount: 21124,
                tokenSymbol: "EASY",
              },
              to: {
                amount: 32000,
                tokenSymbol: "IDZ",
              },
              txId: " oo4Tv5xgz6dQrFk8a3DSDicmHGPrtPb3471M7E5SQEYYCLkpA5A",
              status: {
                total: 3,
                pending: 0,
                signed: true,
              },
            },
            {
              action: "recieve",
              time: "12:23 UTC",
              to: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX",
              amount: 21124,
              tokenSymbol: "IDZ",
              status: {
                total: 3,
                pending: 3,
                approved: true,
                signed: false,
              },
            },
          ],
        },
        {
          date: "March 19, 2022",
          items: [
            {
              action: "exchange",
              time: "12:23 UTC",
              from: {
                amount: 21124,
                tokenSymbol: "EASY",
              },
              to: {
                amount: 32000,
                tokenSymbol: "IDZ",
              },
              txId: " oo4Tv5xgz6dQrFk8a3DSDicmHGPrtPb3471M7E5SQEYYCLkpA5A",
              status: {
                total: 3,
                pending: 0,
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
