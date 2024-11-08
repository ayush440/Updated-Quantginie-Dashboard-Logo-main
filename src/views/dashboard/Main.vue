<template>
  <div class="relative w-full bg-third">
    <div class="p-4 flex flex-col border border-secondary bg-white dark:bg-[#1F242A]">
      <div class="">
        <Infographics />
      </div>
      <div class="mt-4 relative">
        <div class="data-table">
          <div class="grid grid-cols-1 gap-4">
            <div class="md:px-5">
              <div class="flex justify-between mx-2">
                <!-- <h1 class="text-2xl p-1 mt-4 font-bold">
                  {{ isTabActive === 'Live' ? 'Positions' : 'Paper Positions' }}
                </h1> -->
                <!-- <RouterLink
                  to="/positions"
                  class="flex items-center cursor-pointer px-2 rounded-lg hover:bg-third"
                >
                  <ZoomIcon class="cursor-pointer w-5 h-5" />
                </RouterLink> -->
              </div>
              <div class="">
              <positionTable />
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import router from '@/router'
import { useProfileStore } from '@/stores/matrix/profile'
import { useBrokersStore } from '@/stores/matrix/broker'
import { useOrdersStore } from '@/stores/matrix/order'
import { usePositionsStore } from '@/stores/matrix/position'

import Infographics from './content/infographics.vue'
import positionTable from './content/positionData/Main.vue'

import { useManualOrdersStore } from '@/stores/groups/manualOrders'
const manualOrdersStore = useManualOrdersStore()

const positionsStore = usePositionsStore()
const profileStore = useProfileStore()
const brokersStore = useBrokersStore()
const ordersStore = useOrdersStore()

const { isTabActive } = storeToRefs(positionsStore)
const { profile } = storeToRefs(profileStore)
const { brokers } = storeToRefs(brokersStore)

interface Broker {
  id: number
  broker_name: string
  broker_token_date: string
  token_status: string
  message: string
  updated_at: string
}

interface BrokerArray extends Array<Broker> {}

const brokersData = computed<BrokerArray>(() => brokers.value)

const totalOrders = computed(() => {
  let order = ordersStore.totalOrders
  let manualOrder = manualOrdersStore.totalManualOrders
  if (order || manualOrder) {
    return order + manualOrder
  }
  return 0
})

var brokersToken = computed(() => {
  const totalBrokers = brokersData.value.length
  if (totalBrokers > 0) {
    const today = new Date().toISOString().split('T')[0]
    const tokensGeneratedToday = brokersData.value.filter(
      (broker: any) =>
        broker.broker_token_date.split('T')[0] === today && broker.token_status === 'success'
    ).length

    let message = `Connected (${tokensGeneratedToday}/${totalBrokers})`
    let color = tokensGeneratedToday > 0 ? 'text-emerald-500' : 'text-rose-600'

    // Special case for a single broker
    if (totalBrokers === 1) {
      message = tokensGeneratedToday === 1 ? 'Connected' : 'Not Connected'
    }
    return { message, color }
  } else {
    return { message: 'No Broker', color: 'text-slate-500' }
  }
})

function navigate() {
  router.push({ name: 'positions' })
}
</script>

<style scoped lang="scss">
.ord_pos_div {
  @apply overflow-scroll shadow-inner shadow-primary w-full h-[58vh];
  border-radius: 0px 0px 8px 8px;
}

.ord_pos_div::-webkit-scrollbar {
  width: 2px;
  height: 2px;
  overflow: hidden;
}

.ord_pos_div ::-webkit-scrollbar {
  width: 2px;
}

.card{
  box-shadow: 
    -5px -5px 15px rgba(255, 255, 255, 0.1), /* top-left white shadow */
    10px 10px 20px rgba(0, 0, 0, 0.7);      /* bottom-right black shadow */
}
</style>
