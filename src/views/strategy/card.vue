<template>
    <!-- Card layout -->
    <div class="card w-auto h-auto rounded-xl m-2 border border-black">
        <div class="p-2">
          <div class="bg-[#30437C]  text-lg text-white font-semibold text-center p-2.5 rounded-xl">{{  data.script }}</div>

          <div class="flex items-center justify-center m-1 text-xl font-semibold text-nowrap" >
            <component
              v-if="data.image_url"
              :is = "data.image_url"
              class="h-4 w-4"
              :style="{ color: data.color, strokeWidth: 2.5 }"
            />
            &nbsp;{{ data.name }}
          </div>
            
          <div class="flex items-center justify-center m-1">
             <chart :data = "groupedStrategy"/>
          </div>

          <div class="flex items-center justify-between font-semibold text-lg px-2">
            <div class="px-2">Total PNL: 
              <span v-if="groupedStrategy?.pnl" :class="groupedStrategy?.pnl >= 0 ? 'text-green-500' : 'text-red-500'">₹ {{ groupedStrategy?.pnl.toFixed(2) }}</span>
              <span v-else class="text-green-500"> 0.00 </span>
            </div>
            <div class="flex items-center"> 
              <InfoCircleIcon  @click="showMessageModal" class="w-6 h-6 mr-1 cursor-pointer rounded-full hover:bg-gray-300 dark:hover:bg-gray-400" />
              <span class="border-[#F93C65] border text-[#F93C65] px-2 rounded-md">{{ data.risk }}</span>
            </div>
          </div>
        </div>

        <div class="bg-[#11011E26] py-2 text-sm text-center font-semibold uppercase">
          Required CAPITAL : ₹ {{ data.capital_required }} Per lot  
        </div>

        <div class="flex justify-between px-2 mt-4 mb-1">
          <button @click="showJoinModal" class="card-btn">Subscribe</button>
          <router-link @click="gotoinfo" :to="{ name: 'Strategy Details' }" class="card-btn">More Info</router-link>
        </div>
      </div>
      
</template>



<script setup lang="ts">
 import { images } from "@/assets/img";
 import { computed} from "vue";
 import  router  from "@/router/index";
 import { useMatrixJoinersStore } from '@/stores/matrix/matrixJoiner'
 import { useStrategiesStore } from '@/stores/matrix/strategy'
 import { useCardPositionsStore } from "@/stores/matrix/cardPosition";
 import { storeToRefs } from "pinia";
 import chart from "./chart.vue";
 
 
 const matrixJoinersStore = useMatrixJoinersStore();
 const strategiesStore = useStrategiesStore();
 const cardPositionsStore = useCardPositionsStore()
const { showMessage, message, strategyName } = storeToRefs(strategiesStore)
 const { showAddEditModal,joinStrategyId } = storeToRefs(matrixJoinersStore)

 const { mainCardPositions } = storeToRefs(cardPositionsStore) 

 const props: any = defineProps({
   item : Object,
   isActive: Boolean
 })

 const data : any = computed(() => {
   return props.item
 })
 
 function gotoinfo(){
    strategyName.value = data.value.id
    // change beacause of socket error sometime it not work in function call
    // router.push({ name: 'Strategy Details' });
 }

 const groupedStrategy = computed(() => {
   try{
    let temp = mainCardPositions.value[data.value.id] || {};
    return temp
   } catch (err) {
     return {};
   }
 })
 
 function showJoinModal() {
     joinStrategyId.value = data.value.id
     showAddEditModal.value = true;
 }

 function showMessageModal() {
     showMessage.value = true
     message.value = data.value.message
 }
 
 
</script>
 
<style scoped>
.card{
  @apply sm:min-w-[300px];
}
.card{
  border: white;
  box-shadow: 
    -5px -5px 15px rgba(255, 255, 255, 0.1), /* top-left white shadow */
    10px 10px 20px rgba(0, 0, 0, 0.7);      /* bottom-right black shadow */
}
.card-btn{
  @apply m-1 max-h-[3rem] px-4 sm:px-7 py-1 border border-[#30437C] rounded-lg font-bold  text-[#30437C] hover:text-white dark:hover:text-white dark:text-gray-300 hover:bg-[#30437C] focus:outline-none focus:border-gray-400 focus:ring focus:ring-gray-200;
}
</style>