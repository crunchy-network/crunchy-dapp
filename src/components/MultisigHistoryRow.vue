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
            <el-col style="padding-left: 10px" :span="5">
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
                    v-if="item.action === 'recieve'"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.7153 23.1415C28.583 24.0093 28.5845 25.4152 27.7153 26.2845L21.4735 32.5262C21.2182 32.7816 20.9697 32.9456 20.7109 33.0502C20.4924 33.1165 20.1638 33.2201 19.8628 33.2236C19.8603 33.2211 19.8579 33.2186 19.851 33.2216C19.2411 33.2206 18.7343 32.9299 18.2913 32.5753C18.2893 32.5734 18.2879 32.5719 18.2864 32.5704L12.0004 26.2845C11.1312 25.4152 11.1312 24.0107 12.0004 23.1415C12.8697 22.2723 14.2742 22.2723 15.1434 23.1415L17.6332 25.6313L17.6381 8.99813C17.6381 7.77041 18.6301 6.77841 19.8579 6.77841C21.0856 6.77841 22.0776 7.77041 22.0776 8.99814L22.0825 25.6313L24.5723 23.1415C25.4415 22.2723 26.8475 22.2737 27.7153 23.1415Z"
                      fill="#757679"
                    />
                    <circle
                      cx="20"
                      cy="19.9998"
                      r="18.5"
                      transform="rotate(-180 20 19.9998)"
                      stroke="#757679"
                      stroke-width="3"
                    />
                  </svg>
                  <svg
                    v-if="item.action === 'exchange'"
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
                      d="M11.25 16.875H25.7344L23.493 19.1164C23.0047 19.6047 23.0047 20.3957 23.493 20.884C23.7344 21.1289 24.0547 21.25 24.375 21.25C24.6953 21.25 25.0148 21.1279 25.2586 20.8838L29.6336 16.5088C30.1219 16.0205 30.1219 15.2295 29.6336 14.7412L25.2586 10.3662C24.7703 9.87793 23.9793 9.87793 23.491 10.3662C23.0027 10.8545 23.0027 11.6455 23.491 12.1338L25.7344 14.375H11.25C10.559 14.375 10 14.934 10 15.625C10 16.316 10.559 16.875 11.25 16.875ZM28.75 23.125H14.2695L16.5109 20.8836C16.9992 20.3953 16.9992 19.6043 16.5109 19.116C16.0227 18.6277 15.2316 18.6277 14.7434 19.116L10.3684 23.491C9.88008 23.9793 9.88008 24.7703 10.3684 25.2586L14.7434 29.6336C14.9844 29.8789 15.3047 30 15.625 30C15.9453 30 16.2648 29.8779 16.5086 29.6338C16.9969 29.1455 16.9969 28.3545 16.5086 27.8662L14.2695 25.625H28.75C29.441 25.625 30 25.066 30 24.375C30 23.684 29.4414 23.125 28.75 23.125Z"
                      fill="#757679"
                      stroke="#757679"
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
            <el-col :span="9">
              <el-row type="flex" align="middle">
                <el-col :span="9">
                  <template>
                    <div v-if="item.action === 'send'">
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
                    </div>
                    <div v-if="item.action === 'recieve'">
                      <p class="light-text small-text bold-text">From</p>
                      <el-link
                        style="
                          font-weight: 600;
                          font-size: 14px;
                          letter-spacing: 0.02em;
                        "
                        :href="`https://tzkt.io/${item.to}`"
                        target="_blank"
                        type="primary"
                        >{{ fmtAddress(item.to) }}</el-link
                      >
                    </div>
                    <div v-if="item.action === 'exchange'">
                      -{{
                        vueNumberFormat(item.from.amount, {
                          prefix: "",
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        })
                      }}
                      <el-link>{{ item.from.tokenSymbol }}</el-link>
                    </div>
                  </template>
                </el-col>
                <el-col :span="7">
                  <svg
                    v-if="item.action === 'exchange'"
                    width="22"
                    height="15"
                    viewBox="0 0 22 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.656 1.02777C14.3502 0.333566 15.475 0.332387 16.1703 1.02777L21.1637 6.02116C21.368 6.22546 21.4993 6.42425 21.5829 6.63129C21.636 6.80612 21.7189 7.06895 21.7216 7.30978C21.7197 7.31174 21.7177 7.31371 21.72 7.31921C21.7193 7.80715 21.4867 8.2126 21.203 8.56697C21.2015 8.56854 21.2003 8.56972 21.1991 8.5709L16.1703 13.5996C15.475 14.295 14.3514 14.295 13.656 13.5996C12.9606 12.9043 12.9606 11.7807 13.656 11.0853L15.6478 9.09341L2.34128 9.08949C1.3591 9.08949 0.565503 8.29589 0.565503 7.31371C0.565504 6.33153 1.3591 5.53793 2.34128 5.53793L15.6478 5.534L13.656 3.54214C12.9606 2.84676 12.9618 1.72197 13.656 1.02777Z"
                      fill="#757679"
                    />
                  </svg>
                </el-col>
                <el-col :span="9">
                  <div v-if="item.action === 'send'">
                    -{{
                      vueNumberFormat(item.amount, {
                        prefix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}
                    <el-link>{{ item.tokenSymbol }}</el-link>
                  </div>
                  <div v-if="item.action === 'recieve'">
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
                  <div v-if="item.action === 'exchange'">
                    {{
                      vueNumberFormat(item.to.amount, {
                        prefix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}
                    <el-link>{{ item.to.tokenSymbol }}</el-link>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col class="text-right" :span="5">
              <el-link
                style="
                  font-weight: 600;
                  font-size: 14px;
                  letter-spacing: 0.02em;
                "
                type="primary"
                :href="`https://tzkt.io/${item.txId}`"
                target="_blank"
                >{{ item.txId && fmtTxId(item.txId) }}</el-link
              >
            </el-col>
            <el-col class="text-right" :span="5">
              <template>
                <p v-if="!item.status.signed" class="signtext">
                  Sign TX ({{ item.status.total - item.status.pending }}/{{
                    item.status.total
                  }})
                </p>
                <p v-else-if="!item.status.approved" class="signtext approved">
                  Sign TX ({{ item.status.total - item.status.pending }}/{{
                    item.status.total
                  }})
                </p>
                <p v-else class="signtext pending">
                  Pending ({{ item.status.total - item.status.pending }}/{{
                    item.status.total
                  }})
                </p>
              </template>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
import multisigUtils from "../utils/multisig";

export default {
  name: "MultisigHistoryRow",
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
