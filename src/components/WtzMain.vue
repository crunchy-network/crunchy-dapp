<template>
  <div id="wtz">
    <!-- <el-header
      style="
        position: fixed;
        height: 90px;
        top: 0;
        left: 230px;
        right: 0;
        background: #fff;
        z-index: 999;
        border-bottom: 1px solid #e8e8e9;
      "
    >
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content" style="text-align: right">
            <NavWallet />
          </div>
        </el-col>
      </el-row>
    </el-header> -->
    <nav-menu></nav-menu>

    <el-main style="margin-top: 90px">
      <el-row :gutter="20" type="flex" align="bottom">
        <el-col :span="24">
          <div class="grid-content">
            <h2 style="margin-top: 0; margin-bottom: 5px">
              Mint WTZ/Redeem XTZ
            </h2>
            <span style="font-size: 14px"
              >Just submit XTZ to start minting. Burn WTZ to redeem for
              XTZ.</span
            >
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" type="flex" align="top" style="margin-top: 25px">
        <el-col :span="16">
          <div class="grid-content">
            <el-card class="box-card" shadow="always">
              <el-form
                ref="form"
                v-loading.lock="wtz.loading"
                :model="form"
                label-position="top"
                hide-required-asterisk
              >
                <el-row :gutter="20" type="flex" align="middle">
                  <el-col :span="10" style="position: relative">
                    <h3 style="margin: 0; margin-bottom: 8px">You Submit</h3>

                    <template v-if="mode === 'mint'">
                      <el-avatar
                        shape="circle"
                        :size="38"
                        style="position: absolute; top: 0; right: 10px"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAABC1BMVEUAAABCfe5LcORAfetCffBDfe9CffBCfe9Cf/BBfe9Df/JBe+xDeu5Df/JCfvBCfO9Cfe9Cfe9DfvBDfvBBfe9BffA+eu9Df/JCfe8+eeVCfvFCfe9Cfe9Cfu5BffBCffBBfu8+fO9CffJEf/JEfe9CfvFDfu////9Ff+/8/f8+e+87eO9FgvdGg/rr8f5EgPRWjPFTifFAfO9Ghfz0+P5gk/I4d+5Hhv+vyPg3du7n7/1Ef/BIgvD5+v+hv/dOhvBomPNajvHP3vu50PpvnPPv9P7d6PzW5PyMsfbn7v3H2fvB1fp5pPTj7P1ml/KIrfWCqfWow/irxvi0zPmzyvmZufeStPaWt/Ywce7hqexUAAAAJnRSTlMA/QMTxv6QilFW0DQM9a9K8d7WwrYuB/nqHJnL4l4ooHMXQ9p0cw375J8AAAlzSURBVHja1VsHe9JAGE7CHqWD2ta21h2uGQQCJEZWyxbtcv//X+J3hMuJwh2XxEf9nhaoIO9737z1SUKiKIunRCH3LF1KHpzsyarc3js/SJbSr3OFBPnMH5LFFx9dZNPJ/T3LNQ3DardVkLZlGUbDNfb2y+ncxVH8HOi4EtnTM7nRMA1L9kVdiP86ZRmm2ZDP0rsJyiFO+KPc0xOrYbYpMhXKo202rJPTXJFoLDbdP8rsG67lY7MEf8Byjf30o9goKPCTPZRd4ydwLgmjIR/u4v8Zy+izZaPRBnQBAVs0rHJWiewLCsAnDZMxeIYaTKu8C18RDb5QMk1ADyWYwmGBUAiFX8wcE/hwFFKNnUxCUsIOfzcPtlcjCfjCS2IH8eFbBh+ebwfDOC1Kijh+Ie8ytC9kB/esIM7gyY5B8SMrYeeJ4PCVjEmsHwsFy8wIOIIiJUo85xePyBKNBi7+86R7DPjxMnCThAEX/3HeJPBxUjDzjwkDDv4BwY+ZQeMAGMQ7/vh1AP6Xb1D82HWQf85jkEgyxo+IhNdBMsFRQMlljF8jEpqC7JYUhYWfYdkf1a9rC6nrekgGKbmRAZiN+E/MlLwR3u4Pqr68G7acsCpImU8AaAP+ox1LVhkEqhUi3V5HReEYWDuPNjEo5lnlF/DeVy4X8PDUrGkopA6MfHGDAk5ZDohV0JlXiLyraeEdEdxgHf6uwSkASEOBDqoRCBwbu+sYFPexATgM6tVKZAJghIPiugjkZ0Bk19/FQEAlsbg6A6MRwNLA21gIpIJIoAQOqQLECYir4FBRfvFAK0XfFycg7gbZVRUcMWrQHyFgJpUVBWSZDhA/ATW1qgKlbEYjEEkFwOQFSwGIik0JXNuII9urQFGYIaDpGhGnH+SBuqP9JvqKIF4gAAFSBY9VRhW8bgVyPSKZcDwK/pnK7VUgt1ctpo0AkOQCeEy78maz126aP0mFSHONXP4szZmHuDWJXwWAwLgSTi5nHtsJ9otLBeSMFItA9bJLx0W/fpOQj8DzVxsxNECSkSI9dRkeoF13w2qg8t5m2+Cpb4PECSsI7f7DGyqfiBN0h2/Wy8MNxUc2Yk7OThJ+GeDMA3QqXicIw76nrxHte2sc4KsYn8kAbIBjgCaByInI7t/wx09tcArwjDoknIoR0mDO5uMPYfzcdHyG99YvjtXYCDjfCP5HXWXhk1x0AQRyYIF4CCB9BPA+vkbw2ek4BwTSZkwEwAH8d+n4uTZIA4FyXARUew7YGP+B4HMJlCELnBvxEEBOb4nfI/j8idl5QirsWbEQQM4HDI/xnW1X77K1V4BCIEciQN8aL/F1Lj4tB1ZOegaFIBYTDABcDB+noleQB+MggLyPYvg0DEpGDASQc3/p4zsC8NgLS1IyBgJIvx4T+6sikrKS0oEVgwY6U0DH41fFCMjWgXTejkwAeZ+wAyzsL0igfSLtRSaAvNkCf/YdTwiEKMDJt9SG50gEkH7bXGxbXd99vRvVNM8WigMJHiIRQHZnghXQnPrrhfd3HUdk1RadgD4k+0bLGfG7Xt3b3hklORoB5H0FfMJg+TueadsqoR3RCZEz6i7G3W02u0t4/DCv62hLJzyJQgBp/QlGnN+1Ov3Wh49vAwoTnyCXwHnERGQPYfCfWpqj2bbmeP2v1YBBXUNbJaKklQpNAP7udj+3wOtBVPi1vfqAMBjY29SCpGgxugnWBZiA3e/dOjoAI20Bh5DeCRh88dAWxUigHNOYB+m2dLQIQoCHyVB12LGXUUk2Uy/HfDeQG2nplSuLxOGcjO/eQf6YAbMGmPfL8SLnjsTkG4dLwH0m5SxZQAXeQ7Dy0YNU3J9WupUZVfh0qaUmmIl3qJwTmpQC2CjYIbn1Ogvf82oAeNm91RGtTXR6yp2UCk3LQWwyvMpNy9M13bPvIfJgKaojuqNN9lQmHZs/LZe2W5vSyTchUBn3Rq3RbFBZlKKWhqia/ECAN3gbVWaZLM0E3PANYQDSJS/vQAGUQI985M7hEEiTxamAQPLDOqeJH28GUSCqJRwHHuIvTi92VCEVqPaX6s+bVFB/7wk+maGQRfKcVZIA9hgvz4/OwAZCDLz6lwHdMKw+1Al+sK81XhKYdjj7xUeMwzJWQvTU69Gs93k4/NT7UPc0tLZiAIGbvo3YeVAhW/VCAtGP94UdkDXTUKRtebIkW3B6xtim4+5cdbBg+I0EcDlgb9MxNir5vqB7nqcTHYtqgG5Ugg3C3BiCAjz68tD70KGO/rsTThg+IKegEChkszoljl8b+On2ig7ytzAcMPPwfjE4sxS3gV2f+LmAZOG1iWjosSwAMRAc26uikeiRjEwLM9XAN5KKv3mIkYXwgQU9tRR0wPYkKAlNYuiAQHDEfaUj/tml74YpUQ+o0m35X72gT9676diMIHwBwEQUqMmRCVAXIMZ5cBCjElN4cRXgXfHABN26vUqOWOASLMDeqpfCq0AfbHBCpF9VaC1k16EVFQgS8L4QDYxXwhDZ6pQQGG0mkPLLAAj77JJ1lNT0YQa3K/iq9pngDzVWCFD8IBekhBg4fiKoXn9HIKRA6epnkoSqdQ1tvspTAEiBKxyM6yTVe9XTFwszW3O00ZTgNxkGWH+dqnhgCDHQP1z6YFOYlHQArFO7n1covoOYVUD8Gg8VugAhjti9mc4Hky7dJLkBfMFrPOI1CTmzLtQj/EMEXuG/up/6oH/mYRnjKpcIg9vBApaKf6Z5pWsMfOPsiHmZTcgP1Lv5Lye7015L0xESvcxGr/OJTtHt2v3H+WSCL/lNBp9nrY6jATznOh/nQqMYBU33HNTH1xw7Og5IxFmNQQSyumlKrhxifgw5QNNs/JJ7Wlsi+JxLrcIsmOA0AyUT3Gvdf/Zab0JS/u2Lzf7VbqKDuPEPAP/fv9yOGSSSrizHDH/sJuFa919scGiUEiItFpCRrFhbPIyMIin/T5OLf8n0zE3J8eC7+UKYRqPiqRGHEmTDyhQJvmir18s4Wr3yL6TQ3WaJzE4jih1k2TzGw4/S7ndoRWn3M0qFyB2Hu2UrbMOjkcwS+Cj9tkoWKIRo+TTKAB9P16myeyg3xJpeXfkwp8TYdysV0rjtV+WSkEGshrGfeRR753Exd7pV47NrnTzNHf2R3mspsZuG1m/TNKzU763fkO/NBrR+n2YTf7L9/Ogily6T5nfLb35vW4YBA8fN71lofhfTfaT2/3N88i3vneD2/2ch2/9/ABtem2hAUcJLAAAAAElFTkSuQmCC"
                      ></el-avatar>
                      <el-form-item
                        key="input-xtz"
                        :label="`1 XTZ = ${calcXtzToWtz(1)} WTZ`"
                        prop="inputXtz"
                        :rules="[
                          {
                            type: 'number',
                            required: true,
                            message: 'Enter an amount',
                            transform: (v) => Number(v),
                          },
                          {
                            type: 'number',
                            min: 0.000001,
                            message: 'Enter a valid amount (at least 0.000001)',
                            transform: (v) => Number(v),
                          },
                        ]"
                        style="margin-bottom: 24px"
                      >
                        <el-input
                          v-model="form.inputXtz"
                          label="XTZ Input"
                          @input="form.outputWtz = calcXtzToWtz(form.inputXtz)"
                        >
                          <span slot="suffix">
                            <el-button
                              type="text"
                              size="small"
                              style="color: #1ec37f; font-weight: bold"
                              @click="
                                form.inputXtz =
                                  wallet.balance.toNumber() / 1000000 - 0.5;
                                form.outputWtz = calcXtzToWtz(form.inputXtz);
                              "
                              >USE MAX</el-button
                            >
                          </span>
                        </el-input>
                      </el-form-item>
                      <div
                        class="current-balance"
                        style="
                          border-radius: 22px;
                          background: #ffeecc;
                          padding: 12px 20px;
                        "
                      >
                        <el-row
                          type="flex"
                          align="middle"
                          justify="space-between"
                        >
                          <el-col
                            :span="8"
                            style="color: #8c8477; font-size: 12px"
                            >BALANCE</el-col
                          >
                          <el-col
                            :span="16"
                            style="
                              font-size: 12px;
                              color: #303133;
                              font-weight: 600;
                              text-align: right;
                            "
                            >{{
                              vueNumberFormat(
                                wallet.balance.toNumber() / 1000000
                              )
                            }}
                            ꜩ</el-col
                          >
                        </el-row>
                      </div>
                    </template>

                    <template v-if="mode === 'burn'">
                      <el-avatar
                        src="https://ipfs.fleek.co/ipfs/bafybeidwsid6fvv4vxbqja7er3b4exsht5r7umv6hpz7rc3ujg7xilhwv4"
                        shape="circle"
                        :size="38"
                        style="position: absolute; top: 0; right: 10px"
                      ></el-avatar>
                      <el-form-item
                        key="input-wtz"
                        :label="`1 WTZ = ${calcWtzToXtz(1)} XTZ`"
                        prop="inputWtz"
                        :rules="[
                          {
                            type: 'number',
                            required: true,
                            message: 'Enter an amount',
                            transform: (v) => Number(v),
                          },
                          {
                            type: 'number',
                            min: 0.000001,
                            message: 'Enter a valid amount (at least 0.000001)',
                            transform: (v) => Number(v),
                          },
                        ]"
                        style="margin-bottom: 24px"
                      >
                        <el-input
                          v-model="form.inputWtz"
                          label="WTZ Input"
                          @input="form.outputXtz = calcWtzToXtz(form.inputWtz)"
                        >
                          <span slot="suffix">
                            <el-button
                              type="text"
                              size="small"
                              style="color: #1ec37f; font-weight: bold"
                              @click="
                                form.inputWtz = wtz.balance;
                                form.outputXtz = calcWtzToXtz(form.inputWtz);
                              "
                              >USE MAX</el-button
                            >
                          </span>
                        </el-input>
                      </el-form-item>
                      <div
                        class="current-balance"
                        style="
                          border-radius: 22px;
                          background: #ffeecc;
                          padding: 12px 20px;
                        "
                      >
                        <el-row
                          type="flex"
                          align="middle"
                          justify="space-between"
                        >
                          <el-col
                            :span="8"
                            style="color: #8c8477; font-size: 12px"
                            >BALANCE</el-col
                          >
                          <el-col
                            :span="16"
                            style="
                              font-size: 12px;
                              color: #303133;
                              font-weight: 600;
                              text-align: right;
                            "
                            >{{ vueNumberFormat(wtz.balance) }} WTZ</el-col
                          >
                        </el-row>
                      </div>
                    </template>
                  </el-col>
                  <el-col :span="4" style="text-align: center">
                    <el-button
                      :class="mode"
                      type="info"
                      icon="fak fa-crunchy-swap"
                      style="border-radius: 10px; width: 40px; padding: 11px"
                      @click="switchMode"
                    ></el-button>
                  </el-col>
                  <el-col :span="10" style="position: relative">
                    <h3 style="margin: 0; margin-bottom: 8px">You Get</h3>

                    <template v-if="mode === 'mint'">
                      <el-avatar
                        src="https://ipfs.fleek.co/ipfs/bafybeidwsid6fvv4vxbqja7er3b4exsht5r7umv6hpz7rc3ujg7xilhwv4"
                        shape="circle"
                        :size="38"
                        style="position: absolute; top: 0; right: 10px"
                      ></el-avatar>
                      <el-form-item
                        label="Fee: 0.0%"
                        style="margin-bottom: 24px"
                        class="fee"
                      >
                        <el-input
                          v-model="form.outputWtz"
                          label="WTZ"
                          :disabled="true"
                        >
                          <span slot="suffix">WTZ</span>
                        </el-input>
                      </el-form-item>
                      <el-button
                        type="primary"
                        style="
                          border-radius: 12px;
                          font-weight: bold;
                          width: 100%;
                          padding: 12px 20px;
                          margin-left: 0;
                        "
                        @click="wtzWrap(form.inputXtz)"
                        >MINT WTZ</el-button
                      >
                    </template>

                    <template v-if="mode === 'burn'">
                      <el-avatar
                        shape="circle"
                        :size="38"
                        style="position: absolute; top: 0; right: 10px"
                        src="data:image/png;base64,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"
                      ></el-avatar>
                      <el-form-item
                        label="Fee: 0.1%"
                        style="margin-bottom: 24px"
                        class="fee"
                      >
                        <el-input
                          v-model="form.outputXtz"
                          label="XTZ"
                          :disabled="true"
                        >
                          <span slot="suffix">XTZ</span>
                        </el-input>
                      </el-form-item>
                      <el-button
                        type="primary"
                        style="
                          border-radius: 12px;
                          font-weight: bold;
                          width: 100%;
                          padding: 12px 20px;
                          margin-left: 0;
                        "
                        @click="wtzUnwrap(form.inputWtz)"
                        >REDEEM XTZ</el-button
                      >
                    </template>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>

            <h2 style="margin-top: 50px; margin-bottom: 30px">
              Recent WTZ Transactions
            </h2>
            <el-card class="box-card" shadow="always">
              <el-table
                v-loading="wtz.loading"
                :data="wtz.txs"
                :row-class-name="txRowClassName"
                style="width: 100%"
              >
                <el-table-column prop="level" label="Level" width="120">
                </el-table-column>
                <el-table-column label="Type" width="120" align="left">
                  <template slot-scope="scope">
                    <span v-if="scope.row.parameter.entrypoint === 'wrap'"
                      >Mint</span
                    >
                    <span
                      v-else-if="scope.row.parameter.entrypoint === 'unwrap'"
                      >Redeem</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="Sender">
                  <template slot-scope="scope">
                    <el-link
                      :href="`https://tzkt.io/${scope.row.sender.address}`"
                      target="_blank"
                      >{{
                        $async(
                          scope.row.sender.domain,
                          `tez-domain-${scope.row.sender.address}`
                        ) ||
                        `${scope.row.sender.address.substr(
                          0,
                          6
                        )}...${scope.row.sender.address.substr(-6)}`
                      }}
                      <i class="far fa-external-link fa-icon-right"></i
                    ></el-link>
                  </template>
                </el-table-column>
                <el-table-column label="Amount" align="right">
                  <template slot-scope="scope">
                    <span v-if="scope.row.parameter.entrypoint === 'wrap'">
                      {{
                        vueNumberFormat(
                          Number.parseInt(scope.row.amount) / Math.pow(10, 6)
                        )
                      }}
                      XTZ
                    </span>
                    <span
                      v-else-if="scope.row.parameter.entrypoint === 'unwrap'"
                    >
                      {{
                        vueNumberFormat(
                          Number.parseInt(scope.row.parameter.value.nat) /
                            Math.pow(10, 6)
                        )
                      }}
                      WTZ
                    </span>
                  </template>
                </el-table-column>

                <!-- applied, failed, backtracked, skipped -->
                <el-table-column label="Status" width="125" align="center">
                  <template slot-scope="scope">
                    <el-popover
                      v-if="scope.row.status == 'applied'"
                      placement="bottom"
                      width="100"
                      trigger="hover"
                      content="Applied"
                      popper-class="popover"
                    >
                      <span slot="reference" class="applied"
                        ><i class="far fa-check-double"></i
                      ></span>
                    </el-popover>
                    <el-popover
                      v-if="scope.row.status == 'backtracked'"
                      placement="bottom"
                      width="100"
                      trigger="hover"
                      content="Backtracked"
                      popper-class="popover"
                    >
                      <span slot="reference" class="backtracked"
                        ><i class="far fa-undo"></i
                      ></span>
                    </el-popover>
                    <el-popover
                      v-if="scope.row.status == 'skipped'"
                      placement="bottom"
                      width="100"
                      trigger="hover"
                      content="Skipped"
                      popper-class="popover"
                    >
                      <span slot="reference" class="skipped"
                        ><i class="far fa-redo"></i
                      ></span>
                    </el-popover>
                    <el-popover
                      v-if="scope.row.status == 'failed'"
                      placement="bottom"
                      width="100"
                      trigger="hover"
                      content="Failed"
                      popper-class="popover"
                    >
                      <span slot="reference" class="failed"
                        ><i class="far fa-xmark"></i
                      ></span>
                    </el-popover>
                  </template>
                </el-table-column>

                <el-table-column label="" width="110" align="right">
                  <template slot-scope="scope">
                    <el-link
                      :href="`https://tzkt.io/${scope.row.hash}`"
                      target="_blank"
                      >View Op <i class="far fa-external-link fa-icon-right"></i
                    ></el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content" style="height: 100%">
            <el-card
              v-if="showUsd === true"
              v-loading="wtz.loading"
              class="box-card"
              shadow="always"
              style="height: 100%"
            >
              <el-avatar
                shape="circle"
                icon="fas fa-sack-dollar"
                :size="48"
                style="background: #ffcf36; font-size: 24px"
              ></el-avatar>
              <div
                style="
                  font-size: 24px;
                  font-weight: 600;
                  margin-top: 14px;
                  margin-bottom: 8px;
                "
              >
                {{
                  vueNumberFormat(wtz.totalTvlTez * wtz.usdVwap, {
                    prefix: "$",
                    decimal: ".",
                    thousand: ",",
                    precision: 2,
                  })
                }}
              </div>
              <h2
                style="
                  color: #191b1f;
                  opacity: 0.4;
                  font-size: 14px;
                  margin-bottom: 0px;
                "
              >
                Total Wrapped Value USD
              </h2>
            </el-card>
            <el-card
              v-if="showUsd === false"
              v-loading="wtz.loading"
              class="box-card"
              shadow="always"
              style="height: 100%"
            >
              <el-avatar
                shape="circle"
                :size="48"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAABC1BMVEUAAABCfe5LcORAfetCffBDfe9CffBCfe9Cf/BBfe9Df/JBe+xDeu5Df/JCfvBCfO9Cfe9Cfe9DfvBDfvBBfe9BffA+eu9Df/JCfe8+eeVCfvFCfe9Cfe9Cfu5BffBCffBBfu8+fO9CffJEf/JEfe9CfvFDfu////9Ff+/8/f8+e+87eO9FgvdGg/rr8f5EgPRWjPFTifFAfO9Ghfz0+P5gk/I4d+5Hhv+vyPg3du7n7/1Ef/BIgvD5+v+hv/dOhvBomPNajvHP3vu50PpvnPPv9P7d6PzW5PyMsfbn7v3H2fvB1fp5pPTj7P1ml/KIrfWCqfWow/irxvi0zPmzyvmZufeStPaWt/Ywce7hqexUAAAAJnRSTlMA/QMTxv6QilFW0DQM9a9K8d7WwrYuB/nqHJnL4l4ooHMXQ9p0cw375J8AAAlzSURBVHja1VsHe9JAGE7CHqWD2ta21h2uGQQCJEZWyxbtcv//X+J3hMuJwh2XxEf9nhaoIO9737z1SUKiKIunRCH3LF1KHpzsyarc3js/SJbSr3OFBPnMH5LFFx9dZNPJ/T3LNQ3DardVkLZlGUbDNfb2y+ncxVH8HOi4EtnTM7nRMA1L9kVdiP86ZRmm2ZDP0rsJyiFO+KPc0xOrYbYpMhXKo202rJPTXJFoLDbdP8rsG67lY7MEf8Byjf30o9goKPCTPZRd4ydwLgmjIR/u4v8Zy+izZaPRBnQBAVs0rHJWiewLCsAnDZMxeIYaTKu8C18RDb5QMk1ADyWYwmGBUAiFX8wcE/hwFFKNnUxCUsIOfzcPtlcjCfjCS2IH8eFbBh+ebwfDOC1Kijh+Ie8ytC9kB/esIM7gyY5B8SMrYeeJ4PCVjEmsHwsFy8wIOIIiJUo85xePyBKNBi7+86R7DPjxMnCThAEX/3HeJPBxUjDzjwkDDv4BwY+ZQeMAGMQ7/vh1AP6Xb1D82HWQf85jkEgyxo+IhNdBMsFRQMlljF8jEpqC7JYUhYWfYdkf1a9rC6nrekgGKbmRAZiN+E/MlLwR3u4Pqr68G7acsCpImU8AaAP+ox1LVhkEqhUi3V5HReEYWDuPNjEo5lnlF/DeVy4X8PDUrGkopA6MfHGDAk5ZDohV0JlXiLyraeEdEdxgHf6uwSkASEOBDqoRCBwbu+sYFPexATgM6tVKZAJghIPiugjkZ0Bk19/FQEAlsbg6A6MRwNLA21gIpIJIoAQOqQLECYir4FBRfvFAK0XfFycg7gbZVRUcMWrQHyFgJpUVBWSZDhA/ATW1qgKlbEYjEEkFwOQFSwGIik0JXNuII9urQFGYIaDpGhGnH+SBuqP9JvqKIF4gAAFSBY9VRhW8bgVyPSKZcDwK/pnK7VUgt1ctpo0AkOQCeEy78maz126aP0mFSHONXP4szZmHuDWJXwWAwLgSTi5nHtsJ9otLBeSMFItA9bJLx0W/fpOQj8DzVxsxNECSkSI9dRkeoF13w2qg8t5m2+Cpb4PECSsI7f7DGyqfiBN0h2/Wy8MNxUc2Yk7OThJ+GeDMA3QqXicIw76nrxHte2sc4KsYn8kAbIBjgCaByInI7t/wx09tcArwjDoknIoR0mDO5uMPYfzcdHyG99YvjtXYCDjfCP5HXWXhk1x0AQRyYIF4CCB9BPA+vkbw2ek4BwTSZkwEwAH8d+n4uTZIA4FyXARUew7YGP+B4HMJlCELnBvxEEBOb4nfI/j8idl5QirsWbEQQM4HDI/xnW1X77K1V4BCIEciQN8aL/F1Lj4tB1ZOegaFIBYTDABcDB+noleQB+MggLyPYvg0DEpGDASQc3/p4zsC8NgLS1IyBgJIvx4T+6sikrKS0oEVgwY6U0DH41fFCMjWgXTejkwAeZ+wAyzsL0igfSLtRSaAvNkCf/YdTwiEKMDJt9SG50gEkH7bXGxbXd99vRvVNM8WigMJHiIRQHZnghXQnPrrhfd3HUdk1RadgD4k+0bLGfG7Xt3b3hklORoB5H0FfMJg+TueadsqoR3RCZEz6i7G3W02u0t4/DCv62hLJzyJQgBp/QlGnN+1Ov3Wh49vAwoTnyCXwHnERGQPYfCfWpqj2bbmeP2v1YBBXUNbJaKklQpNAP7udj+3wOtBVPi1vfqAMBjY29SCpGgxugnWBZiA3e/dOjoAI20Bh5DeCRh88dAWxUigHNOYB+m2dLQIQoCHyVB12LGXUUk2Uy/HfDeQG2nplSuLxOGcjO/eQf6YAbMGmPfL8SLnjsTkG4dLwH0m5SxZQAXeQ7Dy0YNU3J9WupUZVfh0qaUmmIl3qJwTmpQC2CjYIbn1Ogvf82oAeNm91RGtTXR6yp2UCk3LQWwyvMpNy9M13bPvIfJgKaojuqNN9lQmHZs/LZe2W5vSyTchUBn3Rq3RbFBZlKKWhqia/ECAN3gbVWaZLM0E3PANYQDSJS/vQAGUQI985M7hEEiTxamAQPLDOqeJH28GUSCqJRwHHuIvTi92VCEVqPaX6s+bVFB/7wk+maGQRfKcVZIA9hgvz4/OwAZCDLz6lwHdMKw+1Al+sK81XhKYdjj7xUeMwzJWQvTU69Gs93k4/NT7UPc0tLZiAIGbvo3YeVAhW/VCAtGP94UdkDXTUKRtebIkW3B6xtim4+5cdbBg+I0EcDlgb9MxNir5vqB7nqcTHYtqgG5Ugg3C3BiCAjz68tD70KGO/rsTThg+IKegEChkszoljl8b+On2ig7ytzAcMPPwfjE4sxS3gV2f+LmAZOG1iWjosSwAMRAc26uikeiRjEwLM9XAN5KKv3mIkYXwgQU9tRR0wPYkKAlNYuiAQHDEfaUj/tml74YpUQ+o0m35X72gT9676diMIHwBwEQUqMmRCVAXIMZ5cBCjElN4cRXgXfHABN26vUqOWOASLMDeqpfCq0AfbHBCpF9VaC1k16EVFQgS8L4QDYxXwhDZ6pQQGG0mkPLLAAj77JJ1lNT0YQa3K/iq9pngDzVWCFD8IBekhBg4fiKoXn9HIKRA6epnkoSqdQ1tvspTAEiBKxyM6yTVe9XTFwszW3O00ZTgNxkGWH+dqnhgCDHQP1z6YFOYlHQArFO7n1covoOYVUD8Gg8VugAhjti9mc4Hky7dJLkBfMFrPOI1CTmzLtQj/EMEXuG/up/6oH/mYRnjKpcIg9vBApaKf6Z5pWsMfOPsiHmZTcgP1Lv5Lye7015L0xESvcxGr/OJTtHt2v3H+WSCL/lNBp9nrY6jATznOh/nQqMYBU33HNTH1xw7Og5IxFmNQQSyumlKrhxifgw5QNNs/JJ7Wlsi+JxLrcIsmOA0AyUT3Gvdf/Zab0JS/u2Lzf7VbqKDuPEPAP/fv9yOGSSSrizHDH/sJuFa919scGiUEiItFpCRrFhbPIyMIin/T5OLf8n0zE3J8eC7+UKYRqPiqRGHEmTDyhQJvmir18s4Wr3yL6TQ3WaJzE4jih1k2TzGw4/S7ndoRWn3M0qFyB2Hu2UrbMOjkcwS+Cj9tkoWKIRo+TTKAB9P16myeyg3xJpeXfkwp8TYdysV0rjtV+WSkEGshrGfeRR753Exd7pV47NrnTzNHf2R3mspsZuG1m/TNKzU763fkO/NBrR+n2YTf7L9/Ogily6T5nfLb35vW4YBA8fN71lofhfTfaT2/3N88i3vneD2/2ch2/9/ABtem2hAUcJLAAAAAElFTkSuQmCC"
              ></el-avatar>
              <div
                style="
                  font-size: 24px;
                  font-weight: 600;
                  margin-top: 14px;
                  margin-bottom: 8px;
                "
              >
                {{ vueNumberFormat(wtz.totalTvlTez) }} ꜩ
              </div>
              <h2
                style="
                  color: #191b1f;
                  opacity: 0.4;
                  font-size: 14px;
                  margin-bottom: 0px;
                "
              >
                Total Wrapped Value XTZ
              </h2>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
// import NavWallet from "./NavWallet.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import { BigNumber } from "bignumber.js";
import NavMenu from "./NavMenu.vue";

export default {
  name: "WtzMain",
  components: {
    // NavWallet,
    NavMenu,
  },
  data() {
    return {
      form: {
        inputXtz: "",
        inputWtz: "",
        outputXtz: "",
        outputWtz: "",
      },
      mode: "mint",
    };
  },
  computed: {
    ...mapState(["wallet", "wtz"]),
    ...mapGetters(["getShowUsd"]),
    showUsd() {
      return this.getShowUsd;
    },
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions(["loadWtzData", "wtzWrap", "wtzUnwrap"]),

    refresh() {
      this.loadWtzData();
    },

    txRowClassName({ row }) {
      return `row-${row.status}`;
    },

    calcXtzToWtz(xtzIn) {
      return BigNumber(xtzIn)
        .times(this.wtz.swapRatio)
        .div(this.wtz.swapRatioPrecision)
        .toNumber()
        .toFixed(6);
    },

    calcWtzToXtz(wtzIn) {
      const fee = 0.001;
      return BigNumber(wtzIn)
        .times(this.wtz.swapRatioPrecision)
        .div(this.wtz.swapRatio)
        .times(1 - fee)
        .toNumber()
        .toFixed(6);
    },

    switchMode() {
      this.mode = this.mode === "mint" ? "burn" : "mint";
      if (Object.prototype.hasOwnProperty.call(this.$refs, "form")) {
        this.$refs.form.resetFields();
      }
      this.inputXtz = "";
      this.inputWtz = "";
      this.outputXtz = "";
      this.outputWtz = "";
    },
  },
};
</script>

<style lang="scss">
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#wtz {
  position: relative;
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;

  .el-form-item__label {
    color: #a3a4a5;
  }
  .el-input .el-input__inner {
    border-radius: 10px;
  }

  .el-input.is-disabled .el-input__inner {
    color: #191b1f;
    border-color: #f6f6f6;
  }
  .el-input.is-disabled .el-input__suffix {
    color: #191b1f;
    font-weight: bold;
  }

  .fee {
    .el-form-item__label {
      text-transform: none;
    }
  }

  .applied {
    color: $--color-success;
  }
  .failed {
    color: $--color-danger;
  }
  .skipped,
  .backtracked {
    color: $--color-warning;
  }
  .row-failed {
    background: $--color-danger-lighter;
  }
  .row-skipped,
  .row-backtracked {
    background: $--color-warning-lighter;
  }
}
</style>
