<template>
  <div v-if="position"
    class="intro-x relative my-2"
    :class="{
      'bg-gray-100': isEven(index || 0),
      'shadow-md dark:shadow-slate-600': fullDetails,
      'shadow-sm dark:shadow-slate-600': !fullDetails
    }"
  >
    <!-- Header for collapsed view -->
    <div class="px-4 " :class="{ 'bg-secondary-dark font-semibold': fullDetails }">
      <div @click="fullDetails = !fullDetails" class="py-2 flex justify-between items-center cursor-pointer space-x-4">
        <!-- Strategy name -->
        <div v-if="position?.strategy" class="flex items-center w-[200px]">
          <img v-if="position?.broker" class="shadow-none h-4 w-4 mr-2" :src="`${images[position.broker.broker_name]}`" alt="broker" />
          {{ position.strategy.name }}
        </div>

        <!-- Quantity and Buy/Sell type -->
        <div
          class="min-w-[60px] text-center"
        
        >
          {{ position.quantity }}
        </div>

        <!-- Side (Buy/Sell) and Time -->
        <div class=" min-w-[60px] text-center">
          <span :class="pnl < 0 ? 'text-red-400' : pnl > 0 ? 'text-green-400' : ''">{{ position.side }}</span>
        </div>

        <!-- Time -->
        <div class="min-w-[80px] text-center">
         
            <span :class="pnl < 0 ? 'text-red-400' : pnl > 0 ? 'text-green-400' : ''">
              {{ pnl > 0 ? '+' : '' }}{{ pnl? pnl.toFixed(2) : 0.00 }}
            </span> 
          
          <span>
            <RightArrowIcon class="w-[12px] h-[12px] inline ml-1 transform transition" :class="{ 'rotate-[-90deg]': fullDetails, 'rotate-90': !fullDetails }" />
          </span>
        </div>
      </div>
    </div>

    <!-- Expanded details when toggled -->
    <div v-if="fullDetails" class="p-2 bg-secondary-dark flex">
      <div class="flex w-full h-fit justify-between text-center text-xs xs:text-sm overflow-hidden bg-secondary border-t border-dashed dark:border-slate-600 p-2 pl-4 rounded-lg">
        <!-- Broker Info -->
        <div class="flex flex-col mb-0">
          <div class="font-semibold">Broker</div>
          <div v-if="position.broker" class="flex items-center capitalize">
            {{ `${position.broker.broker_name} - ${position.broker.broker_userid}` }}
          </div>
          <div v-else>_</div>
        </div>

        <!-- Buy Price -->
        <div class="flex flex-col mb-0">
          <div class="font-semibold">Buy Price</div>
          <!-- BUY Price updated  -->
          <div v-if="position.side === 'BUY'">
              <span>{{ position.created_at.replace('Z', '').replace('T', ' ') }}</span>
              <span> ₹{{ position.buy_price }}</span>
          </div>
          <div v-else-if="position.status === 'OPEN' || position.status === 'CLOSING'">
              _
          </div>
          <div v-else>
              <span>{{ position.updated_at.replace('Z', '').replace('T', ' ') }}</span>
              <span> ₹{{ position.buy_price }}</span>
          </div>
        </div>

        <!-- Sell Price -->
        <div class="flex flex-col mb-0">
          <div class="font-semibold">Sell Price</div>
          <!-- Sell Price updated -->
          <div v-if="position.side === 'SELL'">
              <span>{{ position.created_at.replace('Z', '').replace('T', ' ') }}</span>
              <span> ₹{{ position.sell_price }}</span>
          </div>
          <div v-else-if="position.status === 'OPEN' || position.status === 'CLOSING'">
              _
          </div>
          <div v-else>
              <span>{{ position.updated_at.replace('Z', '').replace('T', ' ') }}</span>
              <span> ₹{{ position.sell_price }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center pt-1">
          <button class="sqoff-btn text-xs  flex items-center py-1 px-2 rounded-xl dark:border-[#4FBAF0]" @click="deleteSqOff(position)" v-if="position.status === 'OPEN'">
            <LoadIcon class="w-[14px] h-[14px] mr-[2px]" /> Square. Off
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { images } from '@/assets/img'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { usePositionsStore } from '@/stores/matrix/position'
import { useManualPositionsStore } from '@/stores/groups/manualPosition'
import { useTickerStore } from '@/stores/matrix/ticker/ticker'

const positionsStore = usePositionsStore()
const manualPositionsStore = useManualPositionsStore()
const tickerStore = useTickerStore()

const { showSqOffModal, dataForSqOff } = storeToRefs(positionsStore)
  const { manualDataForSqOff, showManualSqOffModal } = storeToRefs(manualPositionsStore)
  

interface Position {
  id: number
  tradingsymbol: string
  strategy_id: number
  broker_id: number
  broker: {
    id: number
    broker_name: string
    broker_userid: string
  }
  strategy: {
    id: number
    name: string
  }
  quantity: number
  instrument_token: number
  side: string
  buy_price: number
  sell_price: number
  last_price: number
  created_at: string
  updated_at: string
  exchange: string
  status: string
}

const props = defineProps({
  item: Object,
  index: Number // Adding index prop to track position
})

const fullDetails = ref(false)

const position = computed(() => {
  const position = props.item as Position
  return position 
})

const last_price = computed(() => {
    let token = (position.value.instrument_token).toString()
    const newTick = tickerStore.getLastPrice(token);
    return newTick || position.value.last_price;
});

const pnl = computed(() => {
    let result: number = 0

    if (position.value.status == "OPEN") {
        if (position.value.side == "BUY") {
          if (position.value.buy_price != 0 && last_price.value) {

              result = ((last_price.value - position.value.buy_price) * position.value.quantity)
          } else {
              result = 0
          }

        } else if (position.value.side == "SELL" && last_price.value) {
          if (position.value.sell_price != 0) {
              result = ((position.value.sell_price - last_price.value) * position.value.quantity)
          } else {
              result = 0
          }
          } else {
          result = 0
          }
      } else if (position.value.status == "CLOSED") {
          if (position.value.sell_price != 0 && position.value.buy_price != 0) {
              result = ((position.value.sell_price * position.value.quantity) - (position.value.buy_price * position.value.quantity))
          } else {
              result = 0
          }
      }
      return result;
})


// const pnl = computed(() => {
//   let result = 0
//   if (position.value.status === 'OPEN') {
//     result = (position.value.side === 'BUY' ? position.value.buy_price : position.value.sell_price) - position.value.buy_price
//   } else {
//     result = position.value.sell_price - position.value.buy_price
//   }
//   return result
// })


const deleteSqOff = (data: any) => {

  if(data.serialNo.startsWith("manualPosition")){
    showManualSqOffModal.value = true;
    manualDataForSqOff.value.position_id = data.id;

  } else if(data.serialNo.startsWith("position")){
    showSqOffModal.value = true;
    dataForSqOff.value.strategy_id = data.strategy_id;
    dataForSqOff.value.broker_id = data.broker_id;
    dataForSqOff.value.position_id = data.id;
  }
}

// Function to check if row is even
const isEven = (index: number) => index % 2 === 0
</script>

<style scoped>
.intro-x {
  @apply text-sm;
}

.bg-gray-100 {
  background-color: #f5f5f5;
}
.dark .bg-gray-100 {
  background-color: #f5f5f509;
}

.sqoff-btn {
  box-shadow: 4px 4px 12px 0px #000000,
              -4px -4px 11px 0px #FFFFFF33,
              9px 0px 18px 0px #0000005C inset;

  border: 3px solid #2FAEFE;  
  background: #0F8EDF;

}
</style>
