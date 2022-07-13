<template>
  <div id="transfer-nfts-multisig">
    <div v-if="showModal" class="modal-wrapper">
      <div>
        <el-card>
          <el-row
            type="flex"
            justify="space-between"
            style="gap: 5px; align-items: flex-start; margin-bottom: 14px"
            class="create-multisig_header"
          >
            <template>
              <div style="flex: 1">
                <h2 class="bold-text">Select your NFT(s) to transfer</h2>
              </div>
            </template>
            <el-button
              circle
              icon="fa-solid fa-xmark"
              style="font-size: 18px; width: 45px !important; height: 45px"
              @click="toggleModal"
            ></el-button>
          </el-row>
          <template v-if="mode === 'select'">
            <el-row
              justify="space-between"
              type="flex"
              style="align-items: end"
              class="column-flex-wrapper"
            >
              <div>
                <p class="opaque" style="line-height: 10px">
                  NFTs Selected:
                  <span class="bold-text">{{ selected.length }}</span>
                </p>
              </div>
              <el-row type="flex" style="align-items: end">
                <el-button
                  type="text"
                  style="font-weight: 700; padding: 0"
                  @click="selectAll"
                >
                  Select All
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="text"
                  style="font-weight: 700; padding: 0"
                  @click="unselectAll"
                >
                  Unselect All
                </el-button>
                <el-button
                  type="primary"
                  style="font-weight: 700; border-radius: 12px"
                  @click="handleSwitchToTransfer"
                >
                  Transfer NFTs
                </el-button>
              </el-row>
            </el-row>
            <el-row :gutter="10" class="content-wrapper">
              <el-col
                v-for="(nft, index) in nfts"
                :key="index"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
                style="margin-bottom: 10px"
              >
                <MultisigNftCard
                  :on-change="handleSelect"
                  :selectable="true"
                  :nft="nft"
                />
              </el-col>
            </el-row>
          </template>
          <template v-if="mode === 'transfer'">
            <el-row
              justify="space-between"
              type="flex"
              style="align-items: end"
              class="column-flex-wrapper"
            >
              <div>
                <p
                  class="opaque"
                  style="line-height: 10px; margin-bottom: 20px"
                >
                  NFTs Selected:
                  <span class="bold-text">{{ selected.length }}</span>
                </p>
                <el-form>
                  <el-form-item
                    :key="index"
                    :prop="'address'"
                    style="margin-bottom: 0"
                  >
                    <el-input
                      v-model="address"
                      placeholder="tz..."
                      class="opaque"
                    >
                    </el-input>
                  </el-form-item>
                </el-form>
              </div>
              <el-row type="flex" style="align-items: end">
                <el-button
                  type="primary"
                  plain
                  style="font-weight: 700; border-radius: 12px"
                  @click="mode = 'select'"
                >
                  Back
                </el-button>
                <el-button
                  type="primary"
                  style="font-weight: 700; border-radius: 12px"
                  @click="continueToTransfer"
                >
                  Transfer NFTs
                </el-button>
              </el-row>
            </el-row>
            <el-row :gutter="10" class="content-wrapper">
              <el-col
                v-for="(nft, index) in selected"
                :key="index"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
                style="margin-bottom: 10px"
              >
                <MultisigNftCard :nft="nft" />
              </el-col>
            </el-row>
          </template>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { validateAddress } from "@taquito/utils";
import MultisigNftCard from "./MultisigNftCard.vue";

export default {
  name: "MultisigNftsTransfer",
  components: { MultisigNftCard },
  props: {
    showModal: { type: Boolean, default: false },
    toggleModal: Function,
  },
  data() {
    return {
      address: "",
      mode: "select",
      selected: [],
      nfts: [
        {
          id: "1",
          thumbnailUrl: require("../../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "2",
          thumbnailUrl: require("../../assets/multisig/nft-2.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "3",
          thumbnailUrl: require("../../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "4",
          thumbnailUrl: require("../../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "5",
          thumbnailUrl: require("../../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "6",
          thumbnailUrl: require("../../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "7",
          thumbnailUrl: require("../../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "8",
          thumbnailUrl: require("../../assets/multisig/nft-2.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "9",
          thumbnailUrl: require("../../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "10",
          thumbnailUrl: require("../../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "11",
          thumbnailUrl: require("../../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "12",
          thumbnailUrl: require("../../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "13",
          thumbnailUrl: require("../../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "14",
          thumbnailUrl: require("../../assets/multisig/nft-2.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "15",
          thumbnailUrl: require("../../assets/multisig/nft-1.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "16",
          thumbnailUrl: require("../../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "17",
          thumbnailUrl: require("../../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
        {
          id: "18",
          thumbnailUrl: require("../../assets/multisig/nft-3.png"),
          name: "Bored Ape Yacht",
          tokenId: 9269,
          select: false,
        },
      ],
    };
  },
  methods: {
    isAddressValid(address) {
      return validateAddress(address) === 3;
    },
    continueToTransfer(e) {
      e.preventDefault();
    },
    selectAll() {
      this.nfts = this.nfts.map((nft) => {
        nft.select = true;
        return nft;
      });
      this.selected = this.nfts;
    },
    unselectAll() {
      this.nfts = this.nfts.map((nft) => {
        nft.select = false;
        return nft;
      });
      this.selected = [];
    },
    handleSelect(nft) {
      if (nft.select) {
        this.selected.push(nft);
      } else {
        this.selected = this.selected.filter((n) => n.id !== nft.id);
      }
    },

    handleSwitchToTransfer() {
      if (this.selected.length > 0) {
        this.mode = "transfer";
      }
    },
  },
};
</script>

<style lang="scss">
h2,
p {
  margin: 0;
}

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  padding: 60px 40px;

  > div {
    max-width: 800px;
    max-height: calc(100vh - 120px);
    .el-card {
      max-height: 100%;
      overflow-y: auto;
    }
  }
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

#transfer-nfts-multisig .el-input {
  border: 2px solid #e8e9e9 !important;
  border-radius: 12px !important;
  input {
    border: 0;
    border-radius: 12px 0 0 12px;
    min-height: 100%;
    padding: 8px;
  }
  .el-input-group__append {
    border: 0;
    background: transparent;
    padding: 8px;
    border-radius: 0 12px 12px 0;
  }
}

._clear-btn {
  font-weight: 700;
  font-size: 20px;
  line-height: 19px;
  letter-spacing: 0.02em;
  color: #555cff;
}

.threshold-form-item {
  width: max-content;
  input {
    width: 40px;
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;
  }
}

.add-address._clear-btn {
  border: 2px solid rgba(25, 27, 31, 0.1);
  border-radius: 12px;
  height: 50px;
  width: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.content-wrapper {
  overflow-y: auto;
  margin-top: 20px;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    border-radius: 50px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #c4c4c4;
    opacity: 0.85;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #c4c4c4;
  }
}

@media (max-width: 580px) {
  .modal-wrapper {
    padding: 40px 20px;
  }

  .column-flex-wrapper {
    flex-direction: column;
    align-items: start !important;
    row-gap: 5px;
  }
}
@media (max-width: 400px) {
  .modal-wrapper {
    .create-multisig_header {
      flex-direction: column-reverse;
      align-items: flex-start;
      justify-content: center;
      button {
        align-self: flex-end;
      }
    }
  }
}
</style>
