<template>
    <div class="w-full h-full md:h-full bg-third dark:bg-secondary px-6 mt-4 ">
      <div class="flex flex-col justify-center border border-secondary bg-secondary  overflow-hidden rounded-3xl card " >
        <div class="flex items-center flex-wrap lg:px-2 lg:pt-2">
          <div v-if="showTableData" class="min-w-56 lg:min-w-72">
            <SingleSelect1  id="stg_id" v-model="strategyName" :options="strategies"
              name="stg_id" placeholder="Select a Strategy" iconShow
            >
              <!-- <option v-for="strategy in strategies" :key="strategy.id" :value="strategy.id" :icon="strategy.icon">
                {{ strategy.name }}
              </option> -->
            </SingleSelect1>
          </div>
          <div class="date-picker ml-1">
            <input ref="datepicker" type="text" class="input-date" placeholder="Select a date range" />
          </div>
          <div class="ml-1">
            <button type="button" @click="fetchData(); showFilter = true" class="btn btn-primary">Search</button>
          </div>

        </div>
        <div class=" flex flex-col justify-center border border-secondary bg-secondary rounded-b-3xl">
          <div class="table-container text-nowrap">
            <table class="py-4">
              <thead>
                <tr class="text-start card">
                  <th class="text-center whitespace-nowrap">Date</th>
                  <th class="text-center whitespace-nowrap">Script</th>
                  <th class="text-center whitespace-nowrap">Qty</th>
                  <th class="text-center whitespace-nowrap">Buy Price</th>
                  <th class="text-center whitespace-nowrap">Quantity</th>
                  <th class="text-center whitespace-nowrap">Sell Price</th>
                  <th class="text-center whitespace-nowrap">Pnl</th>
                  <th class="text-center whitespace-nowrap">Status</th>
                </tr>
              </thead>
      
              <tbody>
                <!-- This is not completed -->
                <template v-if="strartegyDetails && strartegyDetails.length">
                  <sdRows v-for="(data, i) in strartegyDetails" :key="data.id" :item="data" :index="i" />
                </template>
                <div v-else class="w-full my-8 text-white">
                  <div class="mx-auto my-6" style="height: 200px; width: 185px">
                      <div class="text-center font-semibold text-lg">
                        Details Not Found!!
                      </div>
                  </div>
                </div>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  </div>
    
  </template>
  
  <script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import Litepicker from 'litepicker';
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { makeRequest } from '@/request/request'
  import { useOrdersStore } from '@/stores/matrix/order'
  import { useStrategiesStore } from '@/stores/matrix/strategy';
  import sdRows from './sdRows.vue'
  const ordersStore = useOrdersStore()
  const strategiesStore = useStrategiesStore()

  const { strategyName } = storeToRefs(strategiesStore)

  // define interface to ignore type warning error
  interface Order {
    id: number
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

  const showFilter = ref<boolean>(false)
  const startDate = ref<string>('')
  const endDate = ref<string>('')
  const strartegyDetails = ref<any>([])

  const orders = computed<Order[]>(() => {
    return ordersStore.orders || []
  })

  const strategies = computed(() => {
    if(strategiesStore.strategies && strategiesStore.strategies.length > 0) {
      strategiesStore.strategies.forEach((strategy: any) => {
        strategy.value = strategy.id;
        strategy.label = strategy.name  + "- " + strategy.script;
        strategy.icon = strategy.image_url;
        strategy.color = strategy.color;
      })

      return strategiesStore.strategies
    }

    return []
  })


  const showTableData = computed<boolean>(() => {
      const state = ordersStore.state[ordersStore.endpoint];
      return state && state.loading === false;
  });

  // Define the ref for the datepicker input
const datepicker = ref<HTMLInputElement | null>(null);
const selectedDate = ref<string>('');
  const isMobile = window.innerWidth <= 768;


onMounted(() => {
  if (datepicker.value) {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const picker = new Litepicker({
      element: datepicker.value,
      singleMode: false,
      numberOfMonths: isMobile ? 1 : 2,
      numberOfColumns: isMobile ? 1 : 2,
      format: 'YYYY-MM-DD',
      setup: (picker) => {
        picker.on('selected', (startDate, endDate) => {
          selectedDate.value = `${startDate.format('YYYY-MM-DD')} to ${endDate.format('YYYY-MM-DD')}`;
        });
      }
    });

    showFilter.value = true
    selectedDate.value = `${oneMonthAgo.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`;
    
    if(strategyName.value){
      showFilter.value = true
      datepicker.value.value = selectedDate.value;
      fetchData()
    }
  }
});

onUnmounted(() => {
  if (datepicker.value) {
    datepicker.value = null;
  }
  strategyName.value = '';
  strartegyDetails.value = [];
});

  

const fetchData = async () => {
  let startDate = new Date(selectedDate.value.split(" to ")[0]).toISOString();
  let endDate = new Date(selectedDate.value.split(" to ")[1]).toISOString();
  if (showFilter.value) {
    let data = {
      "id": parseInt(strategyName.value),
      "start_date": startDate,
      "end_date": endDate
    };
    try {
      const response = await makeRequest("strategy_details", "POST", data, {}, {});
      strartegyDetails.value = response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // showFilter.value = false;
    }
  }
};
</script>

<style lang="css" scoped>
.input-date {
  @apply bg-secondary-light px-2 py-1 box-border border border-primary dark:border-gray-400 rounded focus:outline-1 focus:outline-primary;
}
.card{
  border: white;
  box-shadow: 
    -5px -5px 15px rgba(255, 255, 255, 0.1), /* top-left white shadow */
    10px 10px 20px rgba(0, 0, 0, 0.7);      /* bottom-right black shadow */
}
</style>
  