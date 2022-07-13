<template>
  <div id="transfer-token-multisig">
    <div v-if="showModal" class="modal-wrapper">
      <div>
        <el-card>
          <el-row
            type="flex"
            justify="space-between"
            style="gap: 5px; align-items: flex-start"
            class="create-multisig_header"
          >
            <template>
              <div style="flex: 1">
                <h2 class="lg">Transfer Tokens</h2>
              </div>
            </template>
            <el-button
              circle
              icon="fa-solid fa-xmark"
              style="font-size: 18px; width: 45px !important; height: 45px"
              @click="toggleModal"
            ></el-button>
          </el-row>
          <div style="margin-top: 42px; margin-bottom: 24px">
            <p class="small-text light-text bold">Current Bakers Address</p>
            <p class="opaque" style="margin-left: 15px">
              tz1Q9Bjfadslkhjfjkasdhfjkh322daksjdlfkjas2112
            </p>
          </div>
          <el-form>
            <el-form-item :key="index" :prop="'recipient'">
              <p class="small-text light-text bold">New Baker Address</p>
              <el-input v-model="newbaker" class="opaque"> </el-input>
            </el-form-item>
          </el-form>

          <el-row justify="center" type="flex">
            <el-button
              type="primary"
              class="continue-btn"
              form="create-multisig"
              @click="handleSubmit"
            >
              DELEGATE
            </el-button>
          </el-row>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { validateAddress } from "@taquito/utils";

export default {
  name: "UpdateMultisig",
  props: {
    showModal: { type: Boolean, default: false },
    toggleModal: Function,
  },
  data() {
    return {
      newBaker: "",
    };
  },
  methods: {
    isAddressValid(address) {
      return validateAddress(address) === 3;
    },
    handleSubmit(e) {
      e.preventDefault();
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
    min-width: 540px;

    @media (max-width: 578px) {
      min-width: 100%;
    }

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

#transfer-token-multisig .el-input {
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

.continue-btn {
  font-weight: 700;
  line-height: 19px;
  text-align: center;
  letter-spacing: 0.02em;
  width: 80%;
  text-transform: uppercase;
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

@media (max-width: 570px) {
  .modal-wrapper {
    padding: 40px 20px;
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
