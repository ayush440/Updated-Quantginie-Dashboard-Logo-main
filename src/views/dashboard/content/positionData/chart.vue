<template>
  <div class="p-4 sm:p-6 bg-white dark:bg-[#1F242A] shadow-lg rounded-lg">
    <!-- Header with Toggle Buttons -->
    <div class="flex justify-between items-start mb-4 gap-8">
      <div class="space-y-4">
        <h2 class="text-base sm:text-lg font-semibold text-black dark:text-[#656A70]">
          Today's Profit
        </h2>
        <div class="text-4xl font-bold text-[#30437C] dark:text-white" 
        :class="totalPNL >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ `₹${totalPNL.toLocaleString()}` }}
        </div>
        <!-- <div class="flex gap-x-2">
        <button 
          :class="['px-3 py-1 rounded-lg font-bold sm:text-lg', { 'bg-[#30437C] text-white': isTabActive === 'Live', 'bg-gray-200 text-gray-600': isTabActive !== 'Live' }]" 
          @click="toggle('Live')">
          Live
        </button>
        <button 
          :class="['px-3 py-1 rounded-lg font-bold sm:text-lg', { 'bg-[#30437C] text-white': isTabActive === 'Paper', 'bg-gray-200 text-gray-600': isTabActive !== 'Paper' }]" 
          @click="toggle('Paper')">
          Paper
        </button>
      </div> -->
      </div>
      <div class="">
        <img v-if="totalPNL >= 0" :src="images['demoGraphGreen']" alt="" class="w-[90%]"/>
        <img v-else :src="images['demoGraphRed']" alt="" class="rotateY w-[90%]"/>
      </div>
    </div>

    <!-- Strategy List Section -->
    <div class="space-y-3 flex flex-col items-center justify-center">
      <div
        v-for="(strategy, index) in chartData.labels"
        :key="index"
        class="flex justify-between py-3 px-4 shadow-custom rounded-xl mt-8 w-full"
      >
        <span class="text-sm text-gray-700 dark:text-white">{{ strategy }}</span>
        <span class="font-bold" :class="strategyPNL[index] >= 0 ? 'text-[#14EC37]' : 'text-[#F83232]'">
          {{ `₹${strategyPNL[index].toFixed(2)} ` }}
          <span v-if="strategyPNL[index] >= 0">▲</span>
          <span v-else>▼</span>
        </span>
      </div>
      <RouterLink to="/positions" class="pt-6">
        <button class="card py-2 px-8 rounded-xl text-black dark:text-white">View All</button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { images } from '@/assets/img/index';
import { ref, computed } from 'vue'
import { usePositionsStore } from '@/stores/matrix/position'
import { usePaperPositionsStore } from '@/stores/matrix/paperPositions'
import { storeToRefs } from 'pinia'

// Store setup
const positionsStore = usePositionsStore()
const paperPositionsStore = usePaperPositionsStore()
const { strategiesPositions, isTabActive } = storeToRefs(positionsStore)
const { mainPaperPositions } = storeToRefs(paperPositionsStore)

// Refs and state
const totalPNL = ref(0)

// Toggle function
const toggle = (tab: string) => {
  isTabActive.value = tab
}

// Chart Data
const chartData = computed(() => {
  const data =
    isTabActive.value === 'Live'
      ? Object.values(positionsStore.strategiesPositions || {})
      : Object.values(paperPositionsStore.mainPaperPositions || {})

  let chartValue = {
    labels: data.map((strategy: any) => strategy.name),
    datasets: [
      {
        data: data.map((strategy: any) => strategy.positions.length),
        backgroundColor: data.map((strategy: any) => strategy.color)
      }
    ]
  }

  // Update Total Profit
  totalPNL.value = data.reduce((total: number, strategy: any) => total + parseFloat(strategy.pnl), 0)

  return chartValue
})

// Strategy PNL (Profit and Loss)
const strategyPNL = computed(() => {
  const data =
    isTabActive.value === 'Live'
      ? Object.values(positionsStore.strategiesPositions || {})
      : Object.values(paperPositionsStore.mainPaperPositions || {})

  return data.map((strategy: any) => parseFloat(strategy.pnl))
})
</script>

<style scoped>
.card {
  box-shadow:
    -5px -5px 15px rgba(255, 255, 255, 0.1),
    /* top-left white shadow */ 10px 10px 20px rgba(0, 0, 0, 0.7); /* bottom-right black shadow */
}

.shadow-custom {
  box-shadow: 
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),  /* top-left white inner shadow */
    inset 5px 5px 15px rgba(0, 0, 0, 0.7);  /* bottom-right black inner shadow */
}

.rotateY {
  transform: rotateY(180deg);
}
</style>
