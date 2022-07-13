<template>
  <div id="update-multisig">
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
                <h2 class="lg">Update Multisig Contract</h2>
                <p edit class="light-text small-text" style="margin-top: 10px">
                  Updates will require you to reach your previous signature
                  threshold before changes are accepted.
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
                      class="_clear-btn"
                      @click="() => removeAddressField(index)"
                    >
                      <i class="fa-solid fa-minus"></i>
                    </button>
                  </template>
                </el-input>
              </el-form-item>

              <button class="add-address _clear-btn" @click="addAddressField">
                <p class="light-text">tz...</p>
                <i class="fa-solid fa-plus"></i>
              </button>
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
                  @click="handleSubmit"
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
                    @click="handleUpdateMultisig"
                  >
                    UPDATE MULTISIG
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </template>
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
      mode: "edit",
      form: {
        addresses: [
          {
            value: "tz1Q9Bgggw2VDNfcNtwUtK5ykmXEgXiDWQSs",
          },
          {
            value: "tz1NkFRjmkqqcGkAhqe78fdgemDNKXvL7Bod",
          },
          {
            value: "tz1Mq8j7AwoynKU8vXTe7ovh2ZALzxVHnRUM",
          },
          {
            value: "tz1SFeLaGdLzgJZiCDnSpMCsbx76pHZZwA2E",
          },
          {
            value: "tz1Q9Bgggw2VDNfcNtwUtKsasdkjflkdasjk565",
          },
          {
            value: "tz1Q9Bgggw2VDNfcNtwUtK12223ddsxghjhdew",
          },
        ],
        threshold: 4,
      },
    };
  },

  methods: {
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

    handleUpdateMultisig() {
      this.showModal = false;
      this.mode = "edit";
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

#update-multisig .el-input {
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
