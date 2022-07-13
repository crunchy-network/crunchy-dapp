<template>
  <div id="manage-multisig">
    <el-row
      type="flex"
      justify="space-between"
      style="flex-wrap: wrap; gap: 10px; align-items: flex-end"
    >
      <div>
        <h2 class="lg">Manage Multisig</h2>
        <p class="light-text" style="margin-top: 10px">
          Administor existing or create a new multisig wallet.
        </p>
      </div>
      <create-multisig>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="margin-right: 5px"
        >
          <path
            d="M8.25868 21.2436C8.90562 20.5967 9.27726 19.7708 9.37361 18.9174C9.50438 17.7818 9.12585 16.605 8.25868 15.7378C7.74251 15.2216 7.10934 14.8775 6.44176 14.7192C5.16854 14.3958 3.75767 14.733 2.75286 15.7378C2.05775 16.4329 1.67923 17.3207 1.63105 18.2361C1.59664 18.6284 1.63105 19.0344 1.73428 19.4267C1.89258 20.0943 2.23669 20.7275 2.75286 21.2436C4.27385 22.7646 6.7377 22.7646 8.25868 21.2436ZM6.96482 17.775C7.36399 17.775 7.69434 18.1053 7.69434 18.5045C7.68746 18.9105 7.36399 19.234 6.95793 19.2409L6.23529 19.234L6.24218 19.9291C6.23529 20.3352 5.91183 20.6586 5.50577 20.6655C5.09972 20.6586 4.77625 20.3352 4.76937 19.9291L4.77625 19.234L4.05361 19.2409C3.64756 19.234 3.32409 18.9105 3.31721 18.5045C3.32409 18.3049 3.40668 18.126 3.53744 17.9952C3.6682 17.8644 3.84714 17.7818 4.04673 17.775L4.77625 17.775L4.77625 17.0179C4.77625 16.8114 4.85884 16.6325 4.9896 16.5017C5.12037 16.371 5.2993 16.2884 5.50577 16.2884C5.90495 16.2884 6.23529 16.6187 6.23529 17.0179L6.23529 17.775L6.96482 17.775Z"
            fill="white"
          />
          <path
            d="M15.0942 3.84537V7.54391H13.6343V3.84537C13.6343 3.58257 13.4007 3.45605 13.245 3.45605C13.1963 3.45605 13.1476 3.46578 13.099 3.48524L5.3807 6.39542C4.86485 6.59008 4.53393 7.07673 4.53393 7.63151V8.28362C3.64822 8.94546 3.07397 10.0064 3.07397 11.2035V7.63151C3.07397 6.47328 3.78448 5.44158 4.86485 5.03279L12.5929 2.11289C12.807 2.03503 13.0308 1.99609 13.245 1.99609C14.2183 1.99609 15.0942 2.78447 15.0942 3.84537Z"
            fill="white"
          />
          <path
            d="M21.5682 14.1146V15.0879C21.5682 15.3507 21.3638 15.5648 21.0912 15.5745H19.6702C19.1544 15.5745 18.6872 15.1949 18.6482 14.6888C18.6191 14.3871 18.7358 14.1048 18.9305 13.9102C19.1057 13.7253 19.349 13.6279 19.6118 13.6279H21.0815C21.3638 13.6377 21.5682 13.8518 21.5682 14.1146Z"
            fill="white"
          />
          <path
            d="M19.6006 12.6044H20.5934C21.1287 12.6044 21.5667 12.1664 21.5667 11.6311V11.2028C21.5667 9.18809 19.9218 7.54321 17.9071 7.54321H6.73359C5.90628 7.54321 5.14711 7.81574 4.53393 8.28292C3.64822 8.94477 3.07397 10.0057 3.07397 11.2028V12.9353C3.07397 13.3052 3.4633 13.5387 3.81368 13.422C4.35873 13.237 4.93298 13.1397 5.50723 13.1397C8.45633 13.1397 10.8604 15.5437 10.8604 18.4929C10.8604 19.1936 10.6755 19.9625 10.3835 20.6438C10.2277 20.9942 10.4711 21.4128 10.8507 21.4128H17.9071C19.9218 21.4128 21.5667 19.7679 21.5667 17.7531V17.5682C21.5667 17.0329 21.1287 16.5949 20.5934 16.5949H19.7466C18.8123 16.5949 17.9168 16.0207 17.6735 15.1155C17.4788 14.3758 17.7124 13.6555 18.1991 13.1884C18.5592 12.8185 19.0556 12.6044 19.6006 12.6044ZM14.2669 12.4097H9.40043C9.00138 12.4097 8.67046 12.0788 8.67046 11.6797C8.67046 11.2807 9.00138 10.9498 9.40043 10.9498H14.2669C14.666 10.9498 14.9969 11.2807 14.9969 11.6797C14.9969 12.0788 14.666 12.4097 14.2669 12.4097Z"
            fill="white"
          />
        </svg>
        Create Multisig
      </create-multisig>
    </el-row>

    <template name="table">
      <el-card style="margin-top: 24px">
        <div class="responsive-table">
          <div>
            <el-row type="flex" style="gap: 15px" class="_table-header">
              <el-col style="padding-left: 10px" :span="7"> Alias </el-col>
              <el-col class="text-right" :span="5"> Admins </el-col>
              <el-col class="text-right" :span="5"> TXs Completed </el-col>
              <el-col class="text-right" :span="4"> Created </el-col>
              <el-col class="text-right" :span="3"> </el-col>
            </el-row>
            <MultisigRow
              v-for="multisig in multisigs"
              :key="multisig.alias"
              :multisig="multisig"
            />
          </div>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
import CreateMultisig from "./multisig/CreateMultisig.vue";
import MultisigRow from "./MultisigRow.vue";
export default {
  name: "MultisigsTable",
  components: { MultisigRow, CreateMultisig },
  data() {
    return {
      multisigs: [
        {
          alias: "crunchymultisig.tez",
          address: "KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng",
          adminsCount: 6,
          txCompleted: 32,
          created: "21 Jun 2020",
        },
        {
          alias: "KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng",
          address: "KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng",
          adminsCount: 3,
          txCompleted: 132,
          created: "21 Jun 2020",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped >
* {
  margin: 0;
}

#manage-multisig {
  margin-top: 40px;
}

._table-header {
  color: rgba(25, 27, 31, 0.6);
  padding: 0 0 18px;
  margin-bottom: 20px;
}
</style>