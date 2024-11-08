
<template>
  <div class="w-[100%] h-full bg-third dark:bg-secondary px-0 xs:px-3 lg:px-6 mt-4 ">

    <div class="flex flex-col justify-center border border-secondary bg-secondary overflow-hidden rounded-3xl card">
      <div class="flex justify-between items-center px-1 sm:px-4 h-14">
        <div class="flex items-center">
          <button class="add-new-btn font-semibold" @click="showAddEditModal = true"> Add New Broker </button>
          <div v-if="!showUpdatingData" class="col-span-6 sm:col-span-3 xl:col-span-2 flex items-center">
              <LoadingIcon icon="puff" class="w-6 h-6" />
            </div>
        </div>
        
        <div class="flex sm:w-auto justify-between items-center">
          <div class="font-semibold text-gray-700 dark:text-tableText mr-1 sm:mr-2">
            <span>{{ brokers.length }}</span> Brokers
          </div>
        </div>
      </div>

      <div class="hidden sm:block">
        <div class="table-container text-nowrap">

          <table class="py-4">
            <thead>
              <tr class="text-start card">
                <th class="text-center whitespace-nowrap">Broker</th>
                <th class="text-center whitespace-nowrap">Broker UserId</th>
                <th class="text-center whitespace-nowrap">Token Date</th>
                <th class="text-center whitespace-nowrap">Active</th>
                <th class="text-center whitespace-nowrap">Connect</th>
                <th class="text-center whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>

            <tbody class="">
              <brokersRow v-if="showBrokersTable && brokers.length > 0" v-for="broker, i in brokers" :key="i"
                        :item="broker" :index="i"/>

              <div v-else-if="!showBrokersTable"
                  class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center my-4">
                  <LoadingIcon icon="puff" class="w-8 h-8" />
              </div>

              <div v-else class="w-full my-8 text-white">
                <div class="mx-auto my-6" style="height: 200px; width: 185px">
                    <div class="text-center font-semibold text-lg">
                      Brokers Not Found!!
                    </div>
                </div>
              </div>
            </tbody>
          </table>

        </div>
      </div>






      <!-- for mobile device  -->    

      <div class="visible sm:hidden">
          <div class="grid grid-cols-2 gap-1 font-bold bg-third text-tableText dark:bg-primary py-3 mb-1 px-4 shadow dark:shadow-tableText card">
            <div class="text-center">Broker</div>
            <div class="text-end">Active</div>
          </div>

          <div class="mobile-device-table">
            <brokersRow v-if="showBrokersTable && brokers.length > 0" v-for="broker, i in brokers" :key="i"
              :item="broker" :index="i" />

            <div v-else-if="!showBrokersTable"
                class="flex">
                <LoadingIcon icon="puff" class="w-8 h-8" />
            </div>

            
            <div v-else class="w-full my-8 text-white">
                <div class="mx-auto my-6 w-[150px]">
                    <img  :src="notFound" alt="" />
                    <div class="text-center font-semibold text-lg">
                      Brokers Not Found!!
                    </div>
                </div>
            </div>
          </div>
          
      </div>


    </div>
    
  </div>

  <AddEdit />
  <DeleteBrokerModal />

  <ordersKite v-if="showBrokerName == 'zerodha'"/>
  <ordersAlice v-else-if="showBrokerName == 'alice'" />
  <ordersAngel v-else-if="showBrokerName == 'angel'" />
  <ordersIIFL v-else-if="showBrokerName == 'iifl'" />
  <ordersMhTrade v-else-if="showBrokerName == 'mhtrade'" />
  <ordersUpstox v-else-if="showBrokerName == 'upstox'" />
  <ordersShoonya v-else-if="showBrokerName == 'shoonya'" />
  <ordersDhan v-else-if="showBrokerName == 'dhan'" />
  <ordersSwastika v-else-if="showBrokerName == 'swastika'" />
  <ordersGopocket v-else-if="showBrokerName == 'gopocket'"/>
  <ordersMoswal v-else-if="showBrokerName == 'moswal'" />

</template>

<script setup lang="ts">
import notFound from '@/assets/svgs/cart.svg';
import { ref,watch, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useBrokersStore } from '@/stores/matrix/broker'
import AddEdit from './addEdit.vue'
import DeleteBrokerModal from './deleteBrokerModal.vue'
import  brokersRow from './brokersRow.vue'

import ordersKite from './order-position/ordersKite.vue'
import ordersAlice from './order-position/ordersAlice.vue'
import ordersAngel  from './order-position/ordersAngel.vue'
import ordersIIFL from './order-position/ordersIIFL.vue'
import ordersMhTrade from './order-position/ordersMhTrade.vue'
import ordersUpstox from './order-position/ordersUpstox.vue'
import ordersShoonya from './order-position/ordersShoonya.vue'
import ordersDhan from './order-position/ordersDhan.vue'
import ordersSwastika from './order-position/ordersSwastika.vue'
import ordersGopocket from './order-position/ordersGopocket.vue'
import ordersMoswal from './order-position/ordersMoswal.vue'

import brokerPosSqoffModal from './order-position/brokerPosSqoffModal.vue'

const brokersStore = useBrokersStore()
const { showAddEditModal, showBrokerName } = storeToRefs(brokersStore)

// define interface to ignore type warning error
interface Broker {
  id: number
  broker_name: string
  user_id: number
  user_name: string
  broker_token_date: string
  is_disabled: boolean
  is_active: boolean
  updated_at: string
  message: string
  token_status: string

}
const brokers = computed<Broker[]>(() => {
  return brokersStore.brokers
})


const showBrokersTable = computed<boolean>(() => {
    const state = brokersStore.state[brokersStore.endpoint];
    return state && state.loading === false;
});

const showUpdatingData = computed<boolean>(() => {
    const state = brokersStore.state[brokersStore.endpoint];
    return state && state.updating === false;
});

</script>

<style scoped>
.mobile-device-table{
  @apply h-[calc(100vh-209px)] w-full overflow-scroll;
}
.card{
box-shadow: 
  -5px -5px 15px rgba(255, 255, 255, 0.1), /* top-left white shadow */
  10px 10px 20px rgba(0, 0, 0, 0.7);      /* bottom-right black shadow */
}
</style>