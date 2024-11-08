<template>
    <div class="w-full px-[2px]">

      <div class="hidden sm:block">
        <div class="table-container text-nowrap ">
          <table class="mb-2 pb-5">
            <thead>
              <tr >
                <th class="stg-name whitespace-nowrap">Strategy</th>
                <th v-if="profile && profile.user_role !== 'Paper'"  class="whitespace-nowrap">Broker</th>
                <th class="whitespace-nowrap">Script</th>
                <th class="whitespace-nowrap">Product</th>
                <th class="whitespace-nowrap">Side</th>
                <th class="whitespace-nowrap">Quantity</th>
                <th class="whitespace-nowrap">Buy Price</th>
                <th class="whitespace-nowrap">Sell Price</th>
                <th class="whitespace-nowrap">Position Status</th>
                <th class="whitespace-nowrap">P&L</th>
              </tr>
            </thead>
    
            <tbody >
              <template v-if="profile && profile.user_role !== 'Paper'">
                <template v-if="(showTableData && positions.length > 0) || (showManualTableData && manualPositions.length > 0)">
                  <positionRow v-if="showTableData && mergedPositions.length > 0" v-for="position in mergedPositions" :item="position" />
                </template>
                <div v-else-if="!showTableData || !showManualTableData"
                    class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center">
                    <LoadingIcon icon="puff" class="w-8 h-8" />
                </div>
      
                <tr v-else>
                    <td class="text-center">
                        Data not found!!
                    </td>
                </tr>
              </template>

              <template v-else>
                <paperTradeRow v-if="showPaperPositions && paperPositions.length > 0" v-for="position in paperPositions" :item="position" />

                  <div v-else-if="!showPaperPositions"
                      class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center">
                      <LoadingIcon icon="puff" class="w-8 h-8" />
                  </div>
        
                  <tr v-else>
                      <td class="text-center ">
                          Data not found!!
                      </td>
                  </tr>
              </template> 
            </tbody>
          </table>
        </div>
      </div>


      <!-- for mobile device  -->    
      <div class="visible sm:hidden">
        <div class="flex justify-between font-bold bg-third text-tabletext dark:bg-primary py-3 px-4 shadow dark:shadow-tabletext">
            <div>Trading Symbol	</div>
            <div class="">Quantity</div>
            <div>P&L</div>
        </div>

        <div class="mobile-device-table">
          <template v-if="profile && profile.user_role !== 'Paper'">
            <template v-if="(showTableData && positions.length > 0) || (showManualTableData && manualPositions.length > 0)">
              <positionRow v-if="showTableData && mergedPositions.length > 0" v-for="position in mergedPositions" :item="position" />
            </template>
            <div v-else-if="!showTableData || !showManualTableData"
              class="flex my-4">
              <LoadingIcon icon="puff" class="w-8 h-8" />
            </div>

            <div v-else class="flex flex-col items-center mt-8" >
              <div class="text-center">Data not found!!</div>
            </div>
          </template>

          <template v-else>
              <paperTradeRow v-if="showPaperPositions && paperPositions.length > 0" v-for="position in paperPositions" :item="position" />

                <div v-else-if="!showPaperPositions"
                  class="flex my-4">
                  <LoadingIcon icon="puff" class="w-8 h-8" />
                </div>
      
                <div v-else class="flex flex-col items-center mt-8" >
                  <div class="text-center">Data not found!!</div>
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
  import paperTradeRow  from './paperTradeRow.vue'

  import sqOffPosition from '../../../position/sqOffPosition.vue'
  import sqoffManual  from '../../../position//sqoffManual.vue'

  import { usePaperPositionsStore } from "@/stores/matrix/paperPositions";
  const paperPositionsStore = usePaperPositionsStore();
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  
  const positionsStore = usePositionsStore()
  const manualPositionsStore = useManualPositionsStore()
  
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
    // pnl: number
  }
  
  
  const positions = computed<Position[]>(() => {
    return positionsStore.positions.map((pos:Position, index: number) => ({
      ...pos,
      serialNo: `position-${index}`
    }));
  })

  const manualPositions = computed<Position[]>(() => {
    return manualPositionsStore.manualPositions.map((pos: Position, index: number) => ({
      ...pos,
      serialNo: `manualPosition-${index}`
    }));
  })

  const mergedPositions = computed<Position[]>(() => {
    const allPositions: Position[] = [...positions.value, ...manualPositions.value];
    if(!allPositions.length) {
      return [];
    }
    // Sort positions by updated_at in descending order
    return allPositions.sort((a, b) => {
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      return dateB - dateA;
    });

  });


  const showTableData = computed<boolean>(() => {
      const state = positionsStore.state[positionsStore.endpoint];
      return state && state.loading === false;
  });
  
  const showManualTableData = computed<boolean>(() => {
      const state = manualPositionsStore.state[manualPositionsStore.endpoint];
      return state && state.loading === false;
  })


  const paperPositions = computed<Position[]>(() => {
    const allPositions: Position[] = paperPositionsStore.paperPositions;
    if(!allPositions.length) {
      return [];
    }
    return allPositions.sort((a, b) => {
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      return dateB - dateA;
    });
  })

  const showPaperPositions = computed<boolean>(() => {
    const state = paperPositionsStore.state[paperPositionsStore.endpoint];
    return state && state.loading === false;
  });

</script>
  

<style scoped lang="scss">

.intro-y::-webkit-scrollbar {
  height: 2px;
}
.table-container {
  @apply h-[48vh] lg:h-[50vh] xl:h-[calc(100vh-310px)] 2xl:h-[calc(100vh-350px)] w-full overflow-y-scroll;
}

.mobile-device-table{
  @apply h-[calc(100vh-200px)] w-full overflow-scroll;
}

</style>

