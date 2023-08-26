<template>
  <div id="create-token" class="create-token">
    <!-- class="hidden-sm-and-down" -->
    <nav-menu></nav-menu>

    <!-- class="hidden-sm-and-down" -->
    <el-main style="margin-top: 90px">
      <el-row :gutter="20" type="flex" align="bottom">
        <el-col :span="24">
          <div class="grid-content">
            <h2 style="margin-top: 0; margin-bottom: 5px">
              Create A Tezos TOKEN
            </h2>
            <span style="font-size: 14px"
              >Create your own token on the Tezos blockchain. There is a 5 $XTZ
              fee to create a token that will be deposited in the Crunchy
              DAO.</span
            >
          </div>
        </el-col>
      </el-row>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="135px"
        label-position="top"
      >
        <el-row :gutter="20" type="flex" style="margin-top: 25px">
          <el-col :span="20" class="farm-input">
            <div class="grid-content" style="height: 100%">
              <el-card
                v-loading="loading"
                shadow="always"
                class="box-card"
                style="height: 100%"
              >
                <el-row :gutter="20" class="row-input">
                  <el-col :span="12" class="row-input_item">
                    <el-form-item label="Token Type" prop="tokenType" required>
                      <el-select
                        v-model="form.tokenType"
                        placeholder="Select your token type"
                        style="width: 400px"
                      >
                        <el-option
                          v-for="item in tokenTypes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.label"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" class="row-input_item">
                    <el-form-item
                      label="What is the total token supply you want minted?"
                      prop="totalSupply"
                      required
                    >
                      <el-input
                        v-model="form.totalSupply"
                        placeholder="500,000,000"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20" class="row-input">
                  <el-col :span="12" class="row-input_item">
                    <el-form-item
                      label="Whats the name of your token? (ex: Crunchy.Network, Tezos)"
                      prop="tokenName"
                      required
                    >
                      <el-input
                        v-model="form.tokenName"
                        placeholder="Token Name"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" class="row-input_item">
                    <el-form-item
                      label="How many decimal places should your token have?"
                      prop="decimals"
                      required
                    >
                      <el-input v-model="form.decimals" placeholder="8">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="row-input">
                  <el-col :span="12" class="row-input_item">
                    <el-form-item
                      label="What is your token symbol? (ex: CRUNCHY, XTZ)"
                      prop="tokenSymbol"
                    >
                      <el-input
                        v-model="form.tokenSymbol"
                        placeholder="Token symbol"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <hr style="border: 2px solid rgb(37, 39, 42)" />

                <el-row :gutter="20" class="row-input">
                  <el-col :span="12" class="row-input_item">
                    <el-form-item
                      label="What is your tokens icon URL? (Optional)"
                      prop="tokenIcon"
                    >
                      <el-input
                        v-model="form.tokenIcon"
                        placeholder="Token Icon"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20" class="row-input">
                  <el-col :span="12" class="row-input_item">
                    <el-form-item
                      label="What is your tokens description? (Optional)"
                      prop="tokenDesc"
                    >
                      <el-input
                        v-model="form.tokenDesc"
                        style="background-color: #191b1f !important"
                        type="textarea"
                        placeholder="Description text...."
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" style="margin-top: 25px">
                  <el-col
                    :span="8"
                    :offset="16"
                    class="btn-container"
                    style="text-align: right"
                  >
                    <el-button
                      v-if="wallet.connected"
                      v-loading="loading"
                      class="create-token-btn"
                      type="primary"
                      style="border-radius: 10px; font-weight: bold"
                      @click="
                        createAToken(
                          form.tokenType,
                          form.tokenName,
                          form.totalSupply,
                          form.tokenSymbol,
                          form.tokenIcon,
                          form.decimals,
                          form.tokenDesc
                        )
                      "
                    >
                      Create Your Token
                    </el-button>
                    <connect-button v-if="wallet.connected === false" />
                  </el-col>
                </el-row>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavMenu from "./NavMenu.vue";
import ConnectButton from "./ConnectButton.vue";

export default {
  name: "CreateToken",
  components: {
    NavMenu,
    ConnectButton,
  },
  data() {
    return {
      notifyDefaults: {
        duration: 10000,
        showClose: true,
        customClass: "custom-notify-blurb",
        position: "bottom-right",
      },
      loading: false,
      form: {
        tokenType: "",
        tokenName: "",
        totalSupply: "",
        tokenSymbol: "",
        tokenIcon: "",
        decimals: "",
        tokenDesc: "",
      },
      tokenTypes: [
        { value: "0", label: "FA1.2" },
        { value: "1", label: "FA2" },
      ],
      rules: {
        tokenType: [{ required: true, message: "Select token type" }],
        tokenName: [{ required: true, message: "Enter token name" }],
        tokenSymbol: [{ required: true, message: "Enter token symbol" }],
        totalSupply: [
          { required: true, message: "Enter an amount" },
          {
            type: "number",
            required: true,
            message: "Enter a valid amount",
            transform: (v) => Number(v),
          },
        ],
        decimals: [
          { required: true, message: "Enter a number" },
          {
            type: "number",
            required: true,
            message: "Enter a valid amount",
            transform: (v) => Number(v),
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["wallet", "createToken"]),
  },
  
  methods: {
    ...mapActions(["connectWallet", "createTokenContract"]),

    async createAToken(
      tokenType,
      tokenName,
      totalSupply,
      tokenSymbol,
      tokenIcon,
      decimals,
      tokenDesc
    ) {
      const vm = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          vm.loading = true;
          vm.form.visible = false;
          vm.createTokenContract({
            tokenType: tokenType,
            tokenName: tokenName,
            totalSupply: totalSupply,
            tokenSymbol: tokenSymbol,
            tokenIcon: tokenIcon,
            decimals: decimals,
            tokenDesc: tokenDesc,
          })
            .then(async (tx) => {
              vm.loading = false;
              vm.$notify({
                message: vm.getMessageVNode(
                  "Transaction Pending",
                  "The blockchain will process your transaction in 15-30 seconds."
                ),
                ...vm.notifyDefaults,
              });
              const confirmation = await tx.confirmation();
              if (confirmation.completed) {
                vm.loading = false;
                vm.$notify({
                  message: vm.getMessageVNode("Transaction Complete!", [
                    "Transaction ",
                    vm.getTxLink(tx.opHash),
                    " has been confirmed on the blockchain.",
                  ]),
                  ...vm.notifyDefaults,
                  type: "success",
                });
              } else {
                vm.loading = false;
                console.log("confirmation", confirmation);
                vm.$notify({
                  message: vm.getMessageVNode("Error", [
                    "Something went wrong. check out the transaction here",
                    vm.getTxLink(tx.opHash),
                  ]),
                  ...vm.notifyDefaults,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              vm.loading = false;
              console.error(err);
              vm.$notify({
                message: vm.getMessageVNode(err.title, err.message),
                ...vm.notifyDefaults,
                type: "error",
              });
            });
        } else {
          vm.loading = false;
          vm.$notify({
            message: vm.getMessageVNode("Error", [
              "Please validate the form submitting again!",
            ]),
            ...vm.notifyDefaults,
            type: "error",
          });
        }
      });
    },
    getTxLink(hash) {
      const h = this.$createElement;
      const text = `${hash.slice(0, 5)}...${hash.slice(-8)}`;
      return h(
        "a",
        {
          attrs: {
            href: `https://tzstats.com/${hash}`,
            target: "_blank",
            class: "op-hash-link",
          },
        },
        text
      );
    },
    getMessageVNode(title, text) {
      const h = this.$createElement;
      const msgTitle = h("span", { attrs: { class: "message-title" } }, title);
      const mstText = h("span", { attrs: { class: "message-text" } }, text);
      return h(
        "div",
        {
          attrs: { class: "message-wrapper" },
        },
        [msgTitle, mstText]
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#create-token {
  position: relative;
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
  text-transform: none !important;
}
.preview-btn {
  display: none;
}
.create-token-btn_modal {
  display: none;
}
.el-avatar img {
  height: 95% !important;
}

@media (max-width: 991px) {
  .farm-review {
    display: none;
  }
  .farm-input {
    width: 100% !important;
  }
  .btn-container {
    width: 100% !important;
    margin-left: 0px !important;
  }
  .create-token-btn {
    display: none;
  }
  .create-token-btn_modal {
    display: block;
  }
  .preview-btn {
    display: block;
    margin-left: 0px !important;
  }
  .row-input {
    display: flex;
    flex-direction: column;
  }
  .row-input_item {
    width: 100% !important;
  }
  .el-select {
    width: 100% !important;
  }
  .el-range-editor.el-input__inner {
    width: 100% !important;
  }
}
</style>
