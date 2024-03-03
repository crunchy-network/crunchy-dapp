<template>
  <div class="airdrop-overlay">
    <el-dialog
      :visible.sync="airdropListVisible"
      :before-close="handleClose"
      width="500px"
      class="airdrop-list-dialog"
    >
      <div class="dialog-header">
        <h2>Airdrop List Tool</h2>
        <p>Generate a list of token holders for airdrops.</p>
      </div>
      <el-form :model="form">
        <el-form-item
          prop="tokenAddress"
          style="margin-bottom: 0px"
        >
          <el-autocomplete
            id="token-input"
            v-model="form.tokenAddress"
            class="el-input"
            :fetch-suggestions="queryTokens"
            :trigger-on-focus="false"
            placeholder="Search for Token or Enter Token Address"
            @select="onTokenSelect"
          >
            <template slot-scope="{ item }">
              <div class="autocomplete-item">
                <el-avatar
                  :src="item.thumbnailUri"
                  fit="cover"
                  shape="circle"
                  size="40"
                  class="autocomplete-avatar"
                ></el-avatar>
                {{ item.value }}
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="generateList">Generate List</el-button>

      <!-- ... additional content ... -->

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AirdropListTool',
  data() {
    return {
      airdropListVisible: false,
      form: {
        tokenAddress: ''
      },
      // ... additional data properties ...
    };
  },
  methods: {
    generateList() {
      // Method to generate the list of token holders
    },
    queryTokens(queryString, callback) {
      // Method to query for token suggestions based on input
      // Call the callback with the result array
    },
    onTokenSelect(item) {
      // Method called when a token is selected from suggestions
      // You can set the token address or perform other actions here
    },
    handleClose(done) {
      this.$confirm('Are you sure you want to close this dialog?')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // ... additional methods ...
  }
};
</script>

<style scoped>
.airdrop-overlay .el-dialog {
  background: #fff;
  border-radius: 10px;
}

.dialog-header {
  text-align: center;
  margin-bottom: 20px;
}

.dialog-header h2 {
  margin-top: 0;
  color: #333;
}

.autocomplete-item {
  padding: 6px 0;
  display: flex;
  align-items: center;
}

.autocomplete-avatar {
  position: relative;
  border: 4px solid #fff;
  vertical-align: middle;
  margin-right: 14px;
}

/* ... additional styles ... */
</style>
