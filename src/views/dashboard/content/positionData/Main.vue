<template>
  <div class="w-full mt-2 grid grid-cols-1 xl:grid-cols-5 xl:gap-4">
    <div class="sub-container text-nowrap col-span-2 rounded-3xl card ">
      <div class="pb-2 mt-2">
        <chart />
      </div>
    </div>

    <!-- for mobile device  -->
    <div class="col-span-3 rounded-3xl card mt-6 xl:mt-0">
      <div class="flex flex-col space-y-10 text-black dark:text-white">
        <div class="flex items-center justify-between mt-4 p-4">
          <h1 class="text-[23px]">
            {{ profile && profile.user_role !== 'Paper' ? 'Positions' : 'Paper Positions'}}
          </h1>

          <RouterLink
            to="/positions"
            class="flex items-center cursor-pointer px-2 rounded-lg"
          >
            <button class="card py-2 px-8 rounded-xl text-black dark:text-white">View All</button>
          </RouterLink>
        </div>
        <div class="flex justify-between card py-4 px-4">
          <div class="w-[174px]">STRATEGY NAME</div>
          <div>QTY</div>
          <div class="">TYPE</div>
          <div>PNL</div>
        </div>
      </div>

      <div class="sub-container2">
        <!-- profile && profile.user_role !== 'Paper' -->
        <!-- isTabActive === 'Live' -->

        <template v-if="profile && profile.user_role !== 'Paper'">
          <template
            v-if="
              (showTableData && positions.length > 0) ||
              (showManualTableData && manualPositions.length > 0)
            "
          >
            <positionRow
              v-if="showTableData && mergedPositions.length > 0"
              v-for="(position, index) in mergedPositions"
              :item="position"
              :index="index"
              :key="position.id"
            />
          </template>
          
          <div v-else-if="!showTableData || !showManualTableData" class="flex my-4 h-56">
            <LoadingIcon icon="puff" class="w-8 h-8" />
          </div>

          <!-- <positionRow v-if="showTableData && positions.length > 0" v-for="position in positions" :item="position" />
            <div v-else-if="!showTableData"
              class="flex my-4">
              <LoadingIcon icon="puff" class="w-8 h-8" />
            </div> -->

          <div v-else class="flex flex-col items-center my-8 text-white">
            <div class="mx-auto my-6" style="height: 200px; width: 185px">
                <img  src="/images/cart.svg" alt="" />
                <div class="text-center font-semibold text-lg">
                  Data Not Found!!
                </div>
            </div>
          </div>
        </template>

        <template v-else>
          <paperTradeRow
            v-if="showPaperPositions && paperPositions.length > 0"
            v-for="(position, index) in paperPositions"
            :item="position"
            :index="index"
          />

          <div v-else-if="!showPaperPositions" class="flex my-4 h-56">
            <LoadingIcon icon="puff" class="w-8 h-8" />
          </div>

          <div v-else class="flex flex-col items-center my-8 text-white">
            <div class="mx-auto my-6" style="height: 200px; width: 185px">
                <img  src="/images/cart.svg" alt="" />
                <div class="text-center font-semibold text-lg">
                  Data Not Found!!
                </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <sqOffPosition />
  <sqoffManual />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { usePositionsStore } from '@/stores/matrix/position'
import { useManualPositionsStore } from '@/stores/groups/manualPosition'
import { useProfileStore } from '@/stores/matrix/profile'
import positionRow from './positionRow.vue'
import paperTradeRow from './paperTradeRow.vue'
import chart from './chart.vue'

import sqOffPosition from '../../../position/sqOffPosition.vue'
import sqoffManual  from '../../../position/sqoffManual.vue'

import { usePaperPositionsStore } from '@/stores/matrix/paperPositions'
const paperPositionsStore = usePaperPositionsStore()
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const positionsStore = usePositionsStore()
const manualPositionsStore = useManualPositionsStore()

const { isTabActive } = storeToRefs(positionsStore)

// define interface to ignore type warning error
interface Position {
  id: number
  tradingsymbol: string
  strategy_id: number
  broker_id: number
  broker: {
    id: number
    broker_name: string
  }
  user: {
    id: number
    name: string
  }
  strategy: {
    id: number
    name: string
    script: string
    color: string
    image_url: string
  }
  product: string
  quantity: number
  side: string
  buy_price: number
  sell_price: number
  created_at: string
  updated_at: string
  exchange: string
  status: string
  pnl: number
}

const positions = computed<Position[]>(() => {
  return positionsStore.positions.map((pos: Position, index: number) => ({
    ...pos,
    serialNo: `position-${index}`
  }))
})

const manualPositions = computed<Position[]>(() => {
  return manualPositionsStore.manualPositions.map((pos: Position, index: number) => ({
    ...pos,
    serialNo: `manualPosition-${index}`
  }))
})

const mergedPositions = computed<Position[]>(() => {
  const allPositions: Position[] = [...positions.value, ...manualPositions.value]
  if (!allPositions.length) {
    return []
  }
  // Sort positions by updated_at in descending order
  return allPositions.sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime()
    const dateB = new Date(b.updated_at).getTime()
    return dateB - dateA
  })
})

const showTableData = computed<boolean>(() => {
  const state = positionsStore.state[positionsStore.endpoint]
  return state && state.loading === false
})

const showManualTableData = computed<boolean>(() => {
  const state = manualPositionsStore.state[manualPositionsStore.endpoint]
  return state && state.loading === false
})

const paperPositions = computed<Position[]>(() => {
  const allPositions: Position[] = paperPositionsStore.paperPositions
  if (!allPositions.length) {
    return []
  }
  return allPositions.sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime()
    const dateB = new Date(b.updated_at).getTime()
    return dateB - dateA
  })
})

const showPaperPositions = computed<boolean>(() => {
  const state = paperPositionsStore.state[paperPositionsStore.endpoint]
  return state && state.loading === false
})

// console.log(positions.value); 
// console.log(manualPositions.value); 
// console.log(mergedPositions.value);
</script>

<style scoped lang="scss">
.intro-y::-webkit-scrollbar {
  height: 2px;
}

.sub-container {
  @apply xl:h-[calc(100vh-310px)] 2xl:h-[calc(100vh-380px)] w-full overflow-y-scroll;
}
.sub-container2 {
  @apply xl:min-h-[calc(100vh-500px)] xl:max-h-[calc(100vh-350px)] 2xl:min-h-[calc(100vh-560px)] 2xl:max-h-[calc(100vh-380px)]  w-full overflow-y-scroll;
}

.card {
  box-shadow:
    -5px -5px 15px rgba(255, 255, 255, 0.1),
    /* top-left white shadow */ 10px 10px 20px rgba(0, 0, 0, 0.7); /* bottom-right black shadow */
}
</style>
