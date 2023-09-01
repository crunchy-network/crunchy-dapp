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
                v-loading="form.loading"
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
                  <el-col :span="12" class="row-input_item">
                    <el-form-item
                      label="Fixed token supply or mintable so you can mint more?"
                      prop="tokenFixedSupply"
                    >
                      <el-switch
                        v-model="form.tokenFixedSupply"
                        class="mb-2"
                        active-text="Mintable"
                        inactive-text="Fixed"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <hr style="border: 5px solid rgb(37, 39, 42)" />

                <el-row :gutter="20" class="row-input">
                  <el-col :span="12" class="row-input_item">
                    <el-form-item
                      label="What is your tokens icon URL? (Optional)"
                      prop="tokenIcon"
                    >
                      <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="Post Image URL" name="first"
                          ><el-input
                            v-model="form.tokenIcon"
                            placeholder="https://tokenicon.com/image.png"
                        /></el-tab-pane>
                        <el-tab-pane label="Upload Image" name="second"
                          ><el-upload
                            ref="upload"
                            action=""
                            :auto-upload="false"
                            :on-change="onUploadChange"
                            :on-remove="handleRemove"
                            :before-upload="beforeUpload"
                          >
                            <el-button
                              type="info"
                              plain
                              style="border-radius: 10px; padding: 10px 12px"
                              class="_action-btn"
                            >
                              UPLOAD IMAGE
                            </el-button>
                          </el-upload></el-tab-pane
                        >
                      </el-tabs>
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
                      v-loading="form.loading"
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
      <el-dialog
        v-if="dialog.loading"
        class="dialog"
        :visible="dialog.visible"
        title="Creating Token"
        style="width: 30%; padding: 20px; margin: 0 auto; margin-top: 25vh"
        width="100%"
        @close="closeDialog"
      >
        <div class="dialog-infor" style="margin-bottom: 24px; margin-top: 16px">
          Your token is being created and your details will be displayed below
          once the token has been generated on the blockchain.
        </div>
        <div
          style="
            text-align: center;
            color: white;
            font-size: 40px;
            display: block;
            position: relative;
          "
          data-html="true"
          class="tooltip"
        >
          <i class="el-icon-loading"> </i>
          <div class="tooltiptext" data-html="true">
            <span>Loading Data</span>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        v-else
        class="dialog"
        :visible="dialog.visible"
        title="Token Created!"
        style="width: 20%; padding: 20px; margin: 0 auto; margin-top: 25vh"
        width="100%"
        @close="closeDialog"
      >
        <div class="dialog-infor" style="margin-bottom: 24px; margin-top: 16px">
          Your token has been created and should be in your wallet. If it
          doesn’t auto populate in your wallet, you can manually add the token
          using your token details below.
        </div>
        <el-row :gutter="20" style="margin: 0 !important" class="row-input">
          <el-col
            :span="12"
            style="padding: 0 !important; text-align: left"
            class="row-input_item"
          >
            <div label="Token Contract Address">
              <div style="opacity: 60%; margin-bottom: 5px">
                Token Contract Address
              </div>
              <div
                style="
                  display: flex;

                  cursor: pointer;
                "
                :href="`https://tzkt.io/${form.tokenContractAddress}`"
                target="_blank"
              >
                <el-link
                  style="color: #555cff; font-weight: 700; font-size: 16px"
                  :href="`https://tzkt.io/${form.tokenContractAddress}`"
                  target="_blank"
                  >{{
                    formatLongString("KT1PLqCLjGJRggB7TDyZtDtqDh5fVB3Mu2nm")
                  }}
                </el-link>

                <el-tooltip
                  v-model="dialog.toolTip"
                  content="Copied"
                  placement="top"
                  effect="light"
                  trigger="click"
                  virtual-triggering
                  :virtual-ref="triggerRef"
                >
                </el-tooltip>
                <div
                  @click="toggleToolTip"
                  @mouseleave="dialog.toolTip = false"
                >
                  <img
                    src="../assets/svg-icons/vector.svg"
                    style="width: 12.67px; height: 14.67px; margin-left: 5px"
                  />
                </div>
              </div>
            </div>
          </el-col>
          <el-col
            :span="12"
            style="padding: 0 !important; text-align: right"
            class="row-input_item"
          >
            <div style="opacity: 60%; margin-bottom: 5px">Asset ID</div>
            <div style="font-weight: 700; font-size: 16px">
              {{ form.tokenId || 0 }}
            </div>
          </el-col>
        </el-row>
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavMenu from "./NavMenu.vue";
import ConnectButton from "./ConnectButton.vue";
import IPFS from "ipfs-mini";

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
      triggerRef: null,
      position: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      tabActiveName: "first",
      dialog: {
        visible: true,
        loading: false,
        toolTip: false,
      },
      form: {
        loading: false,
        tokenType: "",
        tokenName: "",
        totalSupply: "",
        tokenSymbol: "",
        tokenIcon: "",
        decimals: "",
        tokenDesc: "",
        tokenFixedSupply: "",
        fileList: [],
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
          vm.form.loading = true;
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
              const confirmation = await tx.confirmation();
              vm.form.loading = false;
              vm.dialog.visible = true;
              if (confirmation.completed) {
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
              vm.form.loading = false;
              console.error(err);
              vm.$notify({
                message: vm.getMessageVNode(err.title, err.message),
                ...vm.notifyDefaults,
                type: "error",
              });
            });
        } else {
          vm.form.loading = false;
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
    async onUploadChange(file, fileList) {
      this.form.fileList.push(URL.createObjectURL(file.raw));
      const uploadedFile = file.raw;

      if (uploadedFile) {
        try {
          const ipfsLink = await this.uploadFileToIPFS(uploadedFile);
          console.log("IPFS Link:", ipfsLink);
          // Handle the IPFS link as needed (e.g., store it in a database)
        } catch (error) {
          console.error("Error uploading to IPFS:", error);
        }
      }
    },
    async uploadFileToIPFS(file) {
      const ipfs = new IPFS({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
      });

      return new Promise((resolve, reject) => {
        ipfs.add("strng", (err, result) => {
          if (err) {
            reject(err);
          } else {
            const ipfsLink = result[0].hash;
            resolve(ipfsLink);
          }
        });
      });
    },
    handleRemove(file) {
      this.form.fileList.pop();
    },
    openDialog() {
      this.dialog.visible = true; // Set the property to true on button click
    },
    closeDialog() {
      this.dialog.visible = false; // Set the property to false on button click
    },
    beforeUpload(file) {
      // Perform any necessary validation or checks before uploading the file
      // Return false to prevent uploading or return true to proceed with uploading
      // You can also show an error message if the file doesn't meet the requirements
      // For example, checking the file size or type
      // Return false if the file doesn't meet the requirements
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error("Only JPEG or PNG images are allowed.");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("Image size must be less than 2MB.");
        return false;
      }
      return true;
    },
    toggleToolTip() {
      const textarea = document.createElement("textarea");
      textarea.value =
        this.form.tokenContractAddress ||
        "KT1PLqCLjGJRggB7TDyZtDtqDh5fVB3Mu2nm";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      // Show tooltip or some kind of feedback to the user
      this.dialog.toolTip = true;

      // You can also use a setTimeout to hide the tooltip after a few seconds
      setTimeout(() => {
        this.dialog.toolTip = false;
      }, 2000); // Hide after 2 seconds
    },
    formatLongString(inputString, prefixLength = 5, suffixLength = 6) {
      if (inputString.length <= prefixLength + suffixLength) {
        return inputString;
      }

      const prefix = inputString.substring(0, prefixLength);
      const suffix = inputString.substring(inputString.length - suffixLength);

      return `${prefix}...${suffix}`;
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
.el-avatar img {
  height: 95% !important;
}
.dialog-infor {
  color: #ffffff;
  opacity: 80%;
}
.el-dialog__headerbtn {
  top: 5px !important;
}
.custom-notify-blurb {
  .el-notification__content {
    margin-top: 0;
  }
  .message-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    max-width: 250px;
    .message-title {
      font-size: 14px;
      font-weight: bold;
    }
    .message-text {
      font-size: 12px;
      text-align: initial;
    }
    span {
      flex-basis: 100%;
    }
  }
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
