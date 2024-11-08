<template>
    <div class="w-full h-full px-0 xs:px-3 lg:px-6 mt-4">
      <div class="flex flex-col justify-center border border-[#1F242A] bg-[#1F242A]  overflow-hidden rounded-3xl card">
        <div class="flex flex-wrap sm:flex-nowrap justify-end sm:justify-between items-center py-4 sm:px-4 ">
          <div class="flex sm:w-auto justify-between items-center px-4">
            <div class="font-semibold text-white dark:text-tableText mr-1 sm:mr-2">
            {{ matrixJoiners.length }} Strategy Joined
            </div>
          </div>
        </div>

        <div class="hidden sm:block">
          <div class="table-container text-nowrap">
            <table class="py-4 bg-[#1F242A]">
              <thead style="background-color: #1F242A;">
                <tr class="text-start card">
                  <!-- <th class="text-center whitespace-nowrap">Joiner Id</th> -->
                  <th class="text-center whitespace-nowrap">Strategy</th>
                  <th class="text-center whitespace-nowrap">Broker</th>
                  <!-- <th class="text-center whitespace-nowrap">User</th> -->
                  <th class="text-center whitespace-nowrap">Lot Size</th>
                  <th class="text-center whitespace-nowrap">ReEntry</th>
                  <th class="text-center whitespace-nowrap">ReEntry Triggered</th>
                  <th class="text-center whitespace-nowrap">Active</th>
                  <th class="text-center whitespace-nowrap">Joined At</th>
                  <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
              </thead>

              <tbody class="">

                <matrixJoinerRow v-if="matrixJoiners.length > 0" v-for="matrixJoiner, i in matrixJoiners" :key="i"
                  :item="matrixJoiner" :index="i"
                />

                <div v-else-if="!showTableData"
                  class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center">
                  <LoadingIcon icon="puff" class="w-8 h-8" />
                </div>

                <div v-else class="w-full my-8 text-white">
                  <div class="mx-auto my-6" style="height: 200px; width: 185px">
                      <div class="text-center font-semibold text-lg">
                        Data Not Found!!
                      </div>
                  </div>
                </div>
                
              </tbody>
            </table>

          </div>
        </div>






        <!-- for mobile device  -->    
        <div class="visible sm:hidden">
          <div class="flex justify-between font-bold text-sm bg-third text-tabletext dark:bg-[#1F242A] py-4 px-3 shadow dark:shadow-tabletext card">
              <div class="min-w-[100px]">Strategy</div>
              <div>Lot Size</div>
              <div class="">Active</div>
          </div>

          <div class="mobile-device-table">
            <matrixJoinerRow v-if="matrixJoiners.length > 0" v-for="matrixJoiner, i in matrixJoiners" :key="i"
              :item="matrixJoiner" :index="i"
            />

            <div v-else-if="!showTableData" class="flex">
              <LoadingIcon icon="puff" class="w-8 h-8" />
            </div>

            <div v-else class="flex flex-col items-center mt-8" >
              <div class="text-center">Joiners not found!!</div>
            </div>
          </div>
        </div>


      </div>
    </div>
  <AddEditMatrixJoiner />
  <DeleteMatrixJoiner />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useMatrixJoinersStore } from '@/stores/matrix/matrixJoiner'


import AddEditMatrixJoiner from './addEditMatrixJoiner.vue'
import DeleteMatrixJoiner from './deleteMatrixJoiner.vue'
import matrixJoinerRow from './matrixJoinerRow.vue'
const matrixJoinersStore = useMatrixJoinersStore()



// define interface to ignore type warning error
interface MatrixJoiner {
  id: number
  strategy_id: number
  broker_id: number
  broker: any
  user: any
  strategy: any
  quantity: number
  re_entry: number
  re_entry_triggered: number
  is_active: boolean
  created_at: string
}
const matrixJoiners = computed<MatrixJoiner[]>(() => {
  return matrixJoinersStore.matrixJoiners.sort((a: any, b: any) => b.id - a.id)
})

const showTableData = computed<boolean>(() => {
    const state = matrixJoinersStore.state[matrixJoinersStore.endpoint];
    return state && state.loading === false;
});


</script>



<style scoped>
.mobile-device-table{
  @apply h-[100vh] w-full overflow-scroll;
}

.card{
  box-shadow: 
    -5px -5px 15px rgba(255, 255, 255, 0.1), /* top-left white shadow */
    10px 10px 20px rgba(0, 0, 0, 0.7);      /* bottom-right black shadow */
}

</style>