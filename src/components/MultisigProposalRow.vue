<template>
  <div
    style="padding-bottom: 14px; font-size: 14px; font-weight: 600"
    type="flex"
    align="top"
  >
    <el-col :span="24">
      <p class="opaque" style="margin-bottom: 8px">{{ date }}</p>
      <div class="item-row">
        <div v-for="(item, index) in items" :key="index">
          <el-row
            style="margin-left: 0; margin-right: 0"
            :gutter="20"
            class="farm-row"
            type="flex"
            align="middle"
          >
            <el-col :span="4">
              <el-row type="flex">
                <template>
                  <svg
                    v-if="item.action === 'send'"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.2847 16.8583C11.417 15.9905 11.4155 14.5845 12.2847 13.7153L18.5265 7.47355C18.7818 7.21818 19.0303 7.05416 19.2891 6.94955C19.5076 6.88326 19.8362 6.77964 20.1372 6.7762C20.1397 6.77866 20.1421 6.78111 20.149 6.77816C20.7589 6.77915 21.2657 7.06987 21.7087 7.42444C21.7107 7.4264 21.7121 7.42787 21.7136 7.42935L27.9996 13.7153C28.8688 14.5845 28.8688 15.989 27.9996 16.8583C27.1303 17.7275 25.7258 17.7275 24.8566 16.8583L22.3668 14.3684L22.3619 31.0016C22.3619 32.2293 21.3699 33.2213 20.1421 33.2213C18.9144 33.2213 17.9224 32.2293 17.9224 31.0016L17.9175 14.3684L15.4277 16.8583C14.5585 17.7275 13.1525 17.726 12.2847 16.8583Z"
                      fill="#757679"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="18.5"
                      stroke="#757679"
                      stroke-width="3"
                    />
                  </svg>
                  <svg
                    v-if="item.action === 'lambda'"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="18.5"
                      stroke="#757679"
                      stroke-width="3"
                    />
                    <path
                      d="M14.7464 13.2464L19.9596 13.2467L21.6579 16.542L23.3824 19.9458L26.8315 26.7533L29.675 26.7536"
                      stroke="#757679"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14 26.7949L19.6665 14.7628"
                      stroke="#757679"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </template>
                <div style="margin-left: 30px">
                  <p
                    style="text-transform: capitalize"
                    class="small-text opaque"
                  >
                    {{ item.action }}
                  </p>
                  <p class="light-text">
                    {{ item.time }}
                  </p>
                </div>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex" align="middle" justify="space-between">
                <el-col>
                  <template>
                    <p class="light-text small-text bold-text">To</p>
                    <el-link
                      style="
                        font-weight: 600;
                        font-size: 14px;
                        letter-spacing: 0.02em;
                      "
                      type="primary"
                      :href="`https://tzkt.io/${item.to}`"
                      target="_blank"
                      >{{ fmtAddress(item.to) }}</el-link
                    >
                  </template>
                </el-col>
                <el-col>
                  <el-row type="flex" justify="center">
                    <svg
                      width="22"
                      height="15"
                      viewBox="0 0 22 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style="margin: auto"
                    >
                      <path
                        d="M13.656 1.02777C14.3502 0.333566 15.475 0.332387 16.1703 1.02777L21.1637 6.02116C21.368 6.22546 21.4993 6.42425 21.5829 6.63129C21.636 6.80612 21.7189 7.06895 21.7216 7.30978C21.7197 7.31174 21.7177 7.31371 21.72 7.31921C21.7193 7.80715 21.4867 8.2126 21.203 8.56697C21.2015 8.56854 21.2003 8.56972 21.1991 8.5709L16.1703 13.5996C15.475 14.295 14.3514 14.295 13.656 13.5996C12.9606 12.9043 12.9606 11.7807 13.656 11.0853L15.6478 9.09341L2.34128 9.08949C1.3591 9.08949 0.565503 8.29589 0.565503 7.31371C0.565504 6.33153 1.3591 5.53793 2.34128 5.53793L15.6478 5.534L13.656 3.54214C12.9606 2.84676 12.9618 1.72197 13.656 1.02777Z"
                        fill="#757679"
                      />
                    </svg>
                  </el-row>
                </el-col>
                <el-col>
                  <p class="light-text small-text" style="font-weight: 600">
                    Amount
                  </p>
                  <div>
                    {{
                      vueNumberFormat(item.amount, {
                        prefix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}
                    <el-link>{{ item.tokenSymbol }}</el-link>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4">
              <p style="text-transform: capitalize" class="small-text opaque">
                {{ item.expireDate }}
              </p>
              <p class="light-text">
                {{ item.expireTime }}
              </p>
            </el-col>
            <el-col class="text-right" :span="4">
              <template>
                <p
                  v-if="!(item.status.total - item.status.pending)"
                  class="signtext approved"
                >
                  Approved ({{ item.status.total }}/{{ item.status.total }})
                </p>
                <p v-else class="signtext pending">
                  Pending ({{ item.status.total - item.status.pending }}/{{
                    item.status.total
                  }})
                </p>
              </template>
            </el-col>
            <el-col class="text-right" :span="4"> </el-col>
          </el-row>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
import multisigUtils from "../utils/multisig";

export default {
  name: "MultisigProposalRow",
  props: {
    date: String,
    items: Array,
  },

  methods: {
    fmtAddress(address) {
      return multisigUtils.fmtAddress(address);
    },
    fmtTxId(txId) {
      return multisigUtils.fmtTxId(txId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

.item-row {
  /* border: 1px solid #ebeef5; */
  border-radius: 14px;
}

.n-change {
  color: $--color-danger;
}

.p-change {
  color: $--color-success;
}

.signtext {
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  text-align: right;
  letter-spacing: -0.02em;
  color: #555cff;

  &.approved {
    color: #1ec37f;
  }

  &.pending {
    color: #c4a334;
  }
}
</style>
