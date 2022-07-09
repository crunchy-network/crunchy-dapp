<template>
  <div id="create-multisig">
    <div v-if="!showModal" class="modal-wrapper">
      <div>
        <el-card>
          <el-row
            type="flex"
            justify="space-between"
            style="gap: 5px; align-items: flex-start"
            class="create-multisig_header"
          >
            <template>
              <div v-if="mode === 'edit'" style="flex: 1">
                <h2 class="lg">Create New Multisig</h2>
                <p edit class="light-text small-text" style="margin-top: 10px">
                  Please provide the Tezos addresses that will be controlling
                  and administrating the multisig wallet.
                </p>
              </div>
              <div v-else style="flex: 1">
                <h2 class="lg">Review New Multisig</h2>
                <p edit class="light-text small-text" style="margin-top: 10px">
                  Please ensure that the below information is correct. If the
                  information is incorrect, the multisig creation will likely
                  fail.
                </p>
              </div>
            </template>
            <el-button
              circle
              icon="fa-solid fa-xmark"
              style="font-size: 18px; width: 45px !important; height: 45px"
              @click="toggleModal"
            ></el-button>
          </el-row>
          <template>
            <el-form
              v-if="mode === 'edit'"
              id="create-multisig"
              ref="create-multisig"
              :model="form"
              style="margin-top: 32px"
              @submit="handleSubmit"
            >
              <p class="light-text small-text" style="margin-bottom: 10px">
                Admin Addresses:
                <span style="color: #191b1f">{{ form.addresses.length }}</span>
              </p>
              <el-form-item
                v-for="(address, index) in form.addresses"
                :key="index"
                :prop="'addresses.' + index + '.value'"
              >
                <el-input v-model="address.value">
                  <template slot="append">
                    <button
                      v-if="index + 1 === form.addresses.length"
                      class="_clear-btn"
                      @click="addAddressField"
                    >
                      <i class="fa-solid fa-plus"></i>
                    </button>
                    <button
                      v-else
                      class="_clear-btn"
                      @click="() => removeAddressField(index)"
                    >
                      <i class="fa-solid fa-minus"></i>
                    </button>
                  </template>
                </el-input>
              </el-form-item>

              <p class="light-text small-text" style="margin-bottom: 10px">
                Signature Threshold
              </p>
              <el-form-item class="threshold-form-item" prop="threshold">
                <el-input v-model="form.threshold">
                  <template slot="append">
                    <button class="_clear-btn" @click="incThreshold">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                    <button class="_clear-btn" @click="decThreshold">
                      <i class="fa-solid fa-minus"></i>
                    </button>
                  </template>
                </el-input>
              </el-form-item>

              <el-row justify="center" type="flex">
                <el-button
                  type="primary"
                  class="continue-btn"
                  form="create-multisig"
                >
                  Continue
                </el-button>
              </el-row>
            </el-form>

            <div v-else style="margin-top: 32px">
              <div style="margin-bottom: 24px">
                <p class="light-text small-text" style="margin-bottom: 10px">
                  Admin Addresses:
                  <span style="color: #191b1f">{{
                    form.addresses.length
                  }}</span>
                </p>
                <div v-for="(address, index) in form.addresses" :key="index">
                  <p class="opaque small-text">
                    {{ address.value }}
                  </p>
                </div>
              </div>

              <p class="light-text small-text" style="margin-bottom: 10px">
                Signature Threshold:
                <span style="color: #191b1f">{{ form.threshold }}</span>
              </p>

              <el-row
                type="flex"
                style="flex-wrap: wrap; row-gap: 10px; margin-top: 32px"
                :gutter="10"
              >
                <el-col :xs="24" :md="8">
                  <el-button
                    class="continue-btn"
                    style="width: 100%"
                    plain
                    @click="setModeToEdit"
                  >
                    EDIT
                  </el-button>
                </el-col>
                <el-col :xs="24" :md="16">
                  <el-button
                    class="continue-btn"
                    style="width: 100%"
                    type="primary"
                    @click="handleCreateMultisig"
                  >
                    CREATE MULTISIG
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-card>
      </div>
    </div>
    <button
      class="el-button center el-button--primary is-round"
      @click="toggleModal"
    >
      <slot />
    </button>
  </div>
</template>

<script>
import { validateAddress } from "@taquito/utils";

export default {
  name: "CreateMultisig",
  data() {
    return {
      showModal: false,
      mode: "edit",
      form: {
        addresses: [
          {
            value: "",
          },
        ],
        threshold: 1,
      },
    };
  },

  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
    addAddressField() {
      this.form.addresses.push({ value: "" });
    },
    removeAddressField(index) {
      if (this.form.addresses.length > 1) {
        this.form.addresses.splice(index, 1);
      }
    },

    incThreshold() {
      if (this.form.threshold < this.form.addresses.length) {
        this.form.threshold++;
      }
    },

    decThreshold() {
      if (this.form.threshold > 1) {
        this.form.threshold--;
      }
    },

    isAddressValid(address) {
      return validateAddress(address) === 3;
    },

    handleSubmit(e) {
      e.preventDefault();
      this.mode = "confirm";
    },

    handleCreateMultisig() {
      this.showModal = false;
    },

    setModeToEdit() {
      this.mode = "edit";
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
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding: 60px 40px;

  > div {
    max-width: 540px;
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

#create-multisig .el-input {
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
