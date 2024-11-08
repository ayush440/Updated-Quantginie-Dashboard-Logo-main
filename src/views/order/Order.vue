<template>
  <div class="w-full h-full md:h-full bg-third dark:bg-secondary px-6 mt-4 ">

    <div class=" mt-0 mx-0  flex flex-col justify-center border border-secondary-bold bg-secondary  overflow-hidden rounded-3xl card">
      <div class="flex flex-wrap sm:flex-nowrap justify-end sm:justify-between items-center px-1 sm:px-4 h-14">
        <div class="flex sm:w-auto justify-between items-center">
          <div class="font-semibold text-gray-700 dark:text-tableText mr-1 sm:mr-2">
            {{ mergedOrders.length }} Orders
          </div>

        </div>
      </div>

      <div class="hidden sm:block">
        <div class="table-container text-nowrap">
          <table class="py-4">
            <thead>
              <tr class="text-start card">
                <th class="text-center whitespace-nowrap">Time</th>
                <th class="text-center whitespace-nowrap">Broker</th>
                <th class="text-center whitespace-nowrap">Strategy</th>
                <th class="text-center whitespace-nowrap">Script</th>
                <th class="text-center whitespace-nowrap">Quantity</th>
                <th class="text-center whitespace-nowrap">Price</th>
                <th class="text-center whitespace-nowrap">Status</th>
                <th class="text-center whitespace-nowrap">Product Type</th>
              </tr>
            </thead>

            <tbody>
              <template v-if="(showTableData && orders.length > 0) || (showManualTableData && manualOrders.length > 0)">
                <orderRow v-if="showTableData && mergedOrders.length > 0" v-for="(order, i) in mergedOrders" :item="order" :index="i" />
              </template>
              
              <div v-else-if="!showTableData || !showManualTableData"
                class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center">
                <LoadingIcon icon="puff" class="w-8 h-8" />
              </div>

              <div v-else class="w-full my-8 text-white">
                <div class="mx-auto my-6" style="height: 200px; width: 185px">
                    <div class="text-center font-semibold text-lg">
                      Orders Not Found!!
                    </div>
                </div>
              </div>
              
            </tbody>
          </table>

        </div>
      </div>






      <!-- for mobile device  -->    

      <div class="visible sm:hidden" >
        <div class="flex justify-between font-bold text-sm bg-third text-tabletext dark:bg-primary py-4 px-3 shadow dark:shadow-tabletext">
          <div> Price </div>
          <div class="">Quantity</div>
          <div>Status</div>
        </div>

        <div class="mobile-device-table">
          <template v-if="(showTableData && orders.length > 0) || (showManualTableData && manualOrders.length > 0)">
            <orderRow v-if="showTableData && mergedOrders.length > 0" v-for="(order, i) in mergedOrders" :item="order" :index="i" />
          </template>
          
          <div v-else-if="!showTableData || !showManualTableData"
            class="flex">
            <LoadingIcon icon="puff" class="w-8 h-8" />
          </div>

          <div v-else class="flex flex-col items-center mt-8" >
            <div class="text-center">Orders not found!!</div>
          </div>
        </div>

      </div>


    </div>

  </div>
</template>

<script setup lang="ts">
import { images } from '@/assets/img'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useOrdersStore } from '@/stores/matrix/order'
import { useManualOrdersStore } from '@/stores/groups/manualOrders'
  
import orderRow from './orderRow.vue'
const ordersStore = useOrdersStore()
const manualOrdersStore = useManualOrdersStore()


// define interface to ignore type warning error
interface Order {
  id: number
  serialNo:string
  order_id: string
  user_id: number
  broker_id: number

  strategy_id: number


  user: {
    id: number
    name: string
  }
  broker: {
    id: number
    broker_name: string
  }
  tradingsymbol: string
  quantity: number
  product: string
  exchange: string
  status: string
  status_message: string
  transaction_type: string
  average_price: number
  price: number
  order_type: string
  created_at: string
  updated_at: string
  strategy: {
    id: number
    name: string
    script: string
    image_url: string
    color: string
  }
}

const orders = computed<Order[]>(() => {
  return ordersStore.orders.map((order:Order, index: number) => ({
    ...order,
    serialNo: `order-${index}`
  }))
})

const manualOrders = computed<Order[]>(() => {
  return manualOrdersStore.manualOrders.map((manualOrder:Order, index: number) => ({
    ...manualOrder,
    serialNo: `manualOrder-${index}`
  }))
})

const mergedOrders = computed<Order[]>(() => {
  const allOrders: Order[] = [...orders.value, ...manualOrders.value];
  if(!allOrders.length) {
    return [];
  }
  // Sort orders by updated_at in descending order
  return allOrders.sort((a, b) => { 
    const dateA = new Date(a.updated_at).getTime();
    const dateB = new Date(b.updated_at).getTime();
    return dateB - dateA;
  });
});

const showTableData = computed<boolean>(() => {
    const state = ordersStore.state[ordersStore.endpoint];
    return state && state.loading === false;
});

const showManualTableData = computed<boolean>(() => { 
    const state = manualOrdersStore.state[manualOrdersStore.endpoint];
    return state && state.loading === false;
})

</script>


<style scoped>
.mobile-device-table{
  @apply h-[calc(100vh-209px)] w-full overflow-scroll;
}

.card{
  border: white;
  box-shadow: 
    -5px -5px 15px rgba(255, 255, 255, 0.1), /* top-left white shadow */
    10px 10px 20px rgba(0, 0, 0, 0.7);      /* bottom-right black shadow */
}
</style>