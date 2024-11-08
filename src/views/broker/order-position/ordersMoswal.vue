<template>
    <Modal1 size="5xl" :show="showMoswalModal" @close ="closeModel" :showHeader="false">
  
      <template #body>
        <div class="flex px-3 py-2 text-lg font-medium justify-between ">
          <div>Moswal ({{ typeofdata }})</div>
          <div class="flex">
              <div
                class="hidden border-b border-[#7c8188] text-[#7c8188] md:flex nav-link-tabs justify-start text-center "
              >
                <div
                  @click="changebutton('Orders')"
                  class="py-4 px-4 border-b-2 flex items-center cursor-pointer  "
                  :class="{ 'border-b-2 border-primary dark:text-white dark:border-white': showOrdersbol, 'dark:border-[#7c8188]':  !showOrdersbol }"
                >
                  <FilesIcon class="w-4 h-4 mr-2" /> Orders
                </div>
                <div
                  @click="changebutton('Positions')"
                  class="py-4  px-4 border-b-2 flex items-center cursor-pointer"
                  :class="{ 'border-b-2 border-primary dark:text-white dark:border-white': showPositionsbol, 'dark:border-[#7c8188]':  !showPositionsbol }"
                >
                  <FilesIcon class="w-4 h-4 mr-2" /> Positions
                </div>
              </div>
    
          </div>
        </div>
        <!-- BEGIN: Validation Form -->
        <div class="table-container-modal text-nowrap intro-y">
          <table class="-mt-2 dark:text-white" v-if="showOrdersbol">
            <thead>
                <tr class="text-start">
                  <th class="text-center whitespace-nowrap">TIME</th>
                  <th class="text-center whitespace-nowrap">TICKER</th>
                  <th class="text-center whitespace-nowrap">SIDE</th>
                  <th class="text-center whitespace-nowrap">ORDER TYPE</th>
                  <th class="text-center whitespace-nowrap">PRICE</th>
                  <!-- <th class="text-center whitespace-nowrap">AVG PRICE</th> -->
                  <th class="text-center whitespace-nowrap">QTY</th>
                  <th class="text-center whitespace-nowrap">STATUS</th>
                </tr>
            </thead>
            <tbody>
                <tr
                  v-if="showTableData && orders && orders.length > 0"
                  v-for="(order, i) in orders"
                  :key="i" :class="{ 'bg-white bg-opacity-5': isEven(i || 0) }"
                >
                  <td>{{ order.recordinserttime }}</td>
                  <td>{{ order.symbol }} ({{ order.exchange }})</td>
                  <td> {{ order.buyorsell }}</td>
                  <td>{{ order.ordertype }} ({{ order.producttype }})</td>
                  <td>{{ order.price }}</td>
                  <!-- <td>{{ order.prc }}</td> -->
                  <td>{{ order.orderqty }}</td>
                  <td>{{ order.orderstatus }}</td>
              </tr>
  
              <div v-else-if="!showTableData" class="col-span-6 sm:col-span-3 xl:col-span-2 ml-2 flex items-center">
                <LoadingIcon icon="puff" class="w-8 h-8" />
              </div>
  
              <tr v-else>
                <td
                  colspan="7"
                  style="text-align: center; background: transparent"
                  class="text-center"
                >
                  <!-- <div style="height: 170px; width: 185px; margin: auto">
                    <img
                      src="../../assets/svgs/no-orders.svg"
                      alt=""
                      srcset=""
                      style="box-shadow: none"
                    />
                  </div> -->
                  <div>No orders</div>
                </td>
              </tr>
            </tbody>
          </table>
         
          <table class="w-full table table-report -mt-2 dark:text-white" v-if="showPositionsbol">
            <thead>
              <tr class="text-start">
                <th class="text-center whitespace-nowrap">TRADING SYMBOL	</th>
                <th class="text-center whitespace-nowrap">PRODUCT	</th>
                <th class="text-center whitespace-nowrap">QUANTITY</th>
                <th class="text-center whitespace-nowrap">LTP</th>
                <th class="text-center whitespace-nowrap">PNL</th>
                <th class="text-center whitespace-nowrap">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="positions && positions.length > 0"
                v-for="(order, i) in positions"
                :key="i" :class="{ 'bg-white bg-opacity-5': isEven(i || 0) }"
              >
                <td>{{ order.symbol }}</td>
                <td>{{ order.productname}}</td>
                <td>
                  <span v-if="order.buyquantity && order.sellquantity">0</span>
                  <span v-else-if="order.buyquantity">{{ order.buyquantity }}</span>
                  <span v-else-if="order.sellquantity">{{ order.sellquantity }}</span>
                  <span v-else>0</span>
                </td>
                <td>{{ order.LTP }}</td>
                <td>{{ order.actualbookedprofitloss }}</td>
                <td class="table-report__action" >
                    <div v-if="(order.buyquantity - order.sellquantity)" class="flex justify-center items-center">
                        <a class="flex items-center text-danger whitespace-nowrap" @click="openSqOffModal(order)"  href="javascript:;">
                            <DeleteIcon class="w-4 h-4 mr-1" /> Sq. Off
                        </a>
                    </div>
                </td>
              </tr>
  
              <tr v-else>
                <td
                  colspan="6"
                  style="text-align: center; background: transparent"
                  class="text-center"
                >
                  <!-- <div style="height: 170px; width: 185px; margin: auto">
                    <img
                      src="../../assets/svgs/no-orders.svg"
                      alt=""
                      srcset=""
                      style="box-shadow: none"
                    />
                  </div> -->
                  <div><img src="/images/cart.svg" alt=""></div>
                </td>
              </tr>
            </tbody>
          </table>
  
          
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end items-end">
          <button type="button" class="btn-close" @click="closeModel">Close</button>
        </div>
      </template>
    </Modal1>
  </template>
  
  <script setup lang="ts">
  import { useBrokersStore } from "@/stores/matrix/broker";
  import { storeToRefs } from "pinia";
  import { toRefs, computed, reactive, watch, ref, watchEffect } from "vue";
  let showOrdersbol = ref(true);
  let typeofdata = ref("Orders")
  let showPositionsbol = ref(false);
  const brokersStore = useBrokersStore();
  
  const { showOrderPositionModal, brokerOrders,showSqOffModal, brokerPositions,brokerPosSqOffData,showBrokerName } = storeToRefs(brokersStore);
  
  function closeModel() {
    showOrderPositionModal.value = false
    brokerOrders.value = {};
    brokerPositions.value = {};
    showOrdersbol.value = true
    showPositionsbol.value = false
    showBrokerName.value = ""
  }
  function changebutton(data: string) {
    if (data == "Orders") {
      showOrdersbol.value = true;
      showPositionsbol.value = false;
      typeofdata.value = "Orders"
    }else if(data == "Positions"){
      showOrdersbol.value = false;
      showPositionsbol.value = true;
      typeofdata.value = "Positions"
    }
  }
  
  const showMoswalModal = ref<boolean>(false)
  watchEffect(() => {
    showMoswalModal.value = showOrderPositionModal.value && showBrokerName.value === "moswal"
  })
  

  const orders = computed(() => {
      let order 
      if (brokerOrders.value){
        order = brokerOrders.value;
      }else{
        order = []
      }
      return Array.isArray(order) ? order : []
  });

  const positions = computed(() => {
    let pos
    if (brokerPositions.value){
      pos = brokerPositions.value;
    }else{
      pos = []
    } 
    return Array.isArray(pos) ? pos : []
  });
  
  
  const showTableData = computed<boolean>(() => {
      const state = brokersStore.state['getBrokerOrders'];
      return state && state.loading === false;
  });

  
  function openSqOffModal(posData: any) {
      if (posData.sellquantity){
          brokerPosSqOffData.value.transaction_type = "SELL"
          brokerPosSqOffData.value.quantity = posData.sellquantity
      } else if(posData.buyquantity){
          brokerPosSqOffData.value.transaction_type = "BUY"
          brokerPosSqOffData.value.quantity = posData.buyquantity
      }

      brokerPosSqOffData.value.exchange = posData.exchange
      brokerPosSqOffData.value.tradingsymbol = posData.symbol
      brokerPosSqOffData.value.product = posData.productname
      brokerPosSqOffData.value.instrument_token = typeof posData.symboltoken === "string" ? posData.symboltoken : String(posData.symboltoken)

      showSqOffModal.value = true;
  }
  
  
  const isEven = (index: number) => index % 2 === 0

  </script>
  
  
  <style >
  
  
  
  </style>