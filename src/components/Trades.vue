<template>
  <div>
    <el-empty v-if="map === null" description="描述文字">
      绑定微信之后即可支付。
    </el-empty>
    <el-card v-else shadow="never">
      <el-dialog
        v-if="order"
        title="请用微信扫码充值"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose"
      >
        <el-descriptions
          :column="2"
          size="medium"
          :title="'【' + order.description + '】'"
        >
          <el-descriptions-item label="充值额">
            ¥ {{ money(order.amount) }}
          </el-descriptions-item>
          <el-descriptions-item label="订单号">
            {{ order.order_no }}
          </el-descriptions-item>

          <el-descriptions-item label="微信扫二维码">
            value="order.url" :size="200" level="H" />
          </el-descriptions-item>
        </el-descriptions>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <waterfall v-if="map" :options="{}" ref="waterfall">
        <!-- slice Control number of items -->
        <waterfall-item v-for="trade in map" :key="trade.id">
          <el-col style="width: 280px">
            <div>
              <div
                v-if="selected.id !== trade[1].id"
                class="grid-content"
                @click="onSelected(trade[1])"
              >
                <el-descriptions :title="trade[1].description">
                  <el-descriptions-item label="充值额">
                    ¥ {{ money(trade[1].amount) }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <div v-else class="grid-selected">
                <el-descriptions :title="trade[1].description">
                  <el-descriptions-item label="充值额">
                    ¥ {{ money(trade[1].amount) }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <br />
            </div>
          </el-col>
        </waterfall-item>
      </waterfall>

      <el-button
        v-if="selected === null"
        type="success"
        style="width: 100%"
        disabled
      >
        等待选择
      </el-button>
      <el-button v-else type="success" style="width: 100%" @click="pay">
        充值： ¥ {{ money(selected.amount) }}
      </el-button>
    </el-card>
    <br />
  </div>
</template>

<script>
import { getTrades, transactions } from '@/api/v1/trade'

import QrcodeVue from 'qrcode.vue'
import { Waterfall, WaterfallItem } from 'vue2-waterfall'
export default {
  name: 'Pay',
  components: {
    Waterfall,
    WaterfallItem,
    QrcodeVue
  },
  data() {
    return {
      selected: null,
      map: null,
      dialogVisible: false,
      order: null
    }
  },
  computed: {
    trade() {
      return null
    }
  },
  created() {
    const self = this
    getTrades().then(res => {
      if (res.data.length !== 0) {
        self.map = new Map()
        res.data.forEach(item => {
          self.map.set(item.id, item)
          if (self.selected === null) {
            self.selected = item
          }
        })
      }
    })
  },
  methods: {
    onSelected(trade) {
      const self = this
      self.selected = trade
    },
    pay() {
      const self = this
      transactions(self.selected.id).then(res => {
        const data = res.data
        self.dialogVisible = true
        self.order = data
        // console.error(data)
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    money(amount) {
      const data = JSON.parse(amount)
      return (data.total / 100).toFixed(2)
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-content {
  cursor: pointer;
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  border-color: lightgray;
  height: 120px;
  width: 240px;
  padding: 20px;
}
.grid-selected {
  cursor: pointer;
  border-radius: 4px;
  border-style: solid;
  border-width: 2px;
  border-color: green;
  height: 120px;
  width: 240px;
  padding: 20px;
}
</style>
