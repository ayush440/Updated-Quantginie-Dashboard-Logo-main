
<template>

  <div class="w-full h-full md:h-full bg-third dark:bg-secondary px-0 xs:px-3 lg:px-6 mt-4 ">
    <div class="flex flex-col mx-0 mt-0 rounded-3xl overflow-hidden card">
      <div v-if="showTableData && dropdownOptions.length" class="flex justify-between items-center w-full mt-2 mb-2 px-2 md:hidden" style="z-index: 100">

        <div class="w-2/3"> 
          <SingleSelect v-model="selectedPlan" iconShow placeholder="Select a Plan" >
            <option v-for="option in dropdownOptions" :icon="option.icon" :key="option.value" :value="option.id">{{ option.label }}</option>
          </SingleSelect>
        </div>

        <div class="font-semibold text-gray-700 dark:text-tableText mr-1 sm:mr-2">
          {{ filteredStrategies.length }}  Strategies
        </div>

      </div>

      <div class="min-h-[50vh] bg-secondary">
        <div v-if="showTableData && reorderedPlans.length">
          <div class="unselectable flex pl-2 border-b border-black dark:border-none">
            <div class="flex flex-wrap overflow-auto font-semibold text-sm lg:text-base xl:text-lg border-b border-secondary">
              <div
                class="px-2 pt-2 pb-[1px] text-black dark:text-tableText w-[100%] hidden md:flex"
              >
                <!-- <div></div> -->
                  <div class="py-1 rounded-t px-3 flex items-center cursor-pointer"
                    :fullWidth="false"
                    :class="[ 'capitalize',
                      'text-nowrap',
                      // 'border-b-[3px]',
                      selectedPlan === plan.id ? 'bg-secondary border-primary'  : 'border-secondary text-[#7c8188]',
                      selectedPlan !== plan.id ? 'deactived' : '',
                      plan.name === your_plan ? 'font-bold' : '',
                    ]"
                    v-for="plan, index in reorderedPlans"
                    :key="plan.id"
                    @click="setSelectedPlan(plan.id)"
                  >
                      <component :is="plan.icon" class="w-4 h-4 mr-1" /> {{ plan.name }}
                  </div>
              </div>
            </div>
          </div>
          
          <!-- BEGIN: Page Layout -->
          <!-- for table  -->
          <template class="block">
            <div class="pt-2 px-[1px] rounded-lg flex flex-col justify-center border border-secondary bg-secondary">
              <div class="min-h-[50vh] h-[calc(100vh-164px)] md:h-[calc(100vh-160px)] xl:h-[calc(100vh-180px)] ml-[2px] w-[100%] overflow-auto text-nowrap pb-2 mb-1">

                <div v-if="filteredStrategies && filteredStrategies.length > 0" class="grid"
                  :class="[false ? 'grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4']"
                >
                  <card  v-for="(data, index) in filteredStrategies" :item="data" :key = "index" :isActive="activePlan"/>
                </div>

                <div v-else class="flex flex-col items-center mt-8" >
                  <div class="text-center">Strategies not found!!</div>
                </div>

              </div>
            </div>
          </template>


          <!-- END: Page Layout -->
        </div>
        <div v-else-if="!showTableData"
              class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center">
              <LoadingIcon icon="puff" class="w-8 h-8" />
        </div>
        <div v-else>
          <div class="w-full h-full mt-8 my-4 flex flex-col justify-center items-center">
            <div class="text-center text-xl z-10">Data Not Found</div>
          </div>
        </div>

      </div>
  
    </div>
  </div>



  <AddMatrixJoiner />
  <Message />
</template>

<script setup lang="ts">
import { ref, computed, onMounted,watchEffect } from "vue";
import { storeToRefs } from "pinia";
import strategyVue from "./strategy.vue";
import AddMatrixJoiner from ".././matrixJoiner/addEditMatrixJoiner.vue";
import Message from './message.vue'
import card from "./card.vue";
import { useStrategiesStore } from '@/stores/matrix/strategy'
import { useProfileStore } from "@/stores/matrix/profile"; // Import your store
const strategiesStore = useStrategiesStore();
const profileStore = useProfileStore();

let your_plan: any = computed(() => {
  return profileStore.profile.plan_name;
});

const { strategies, plans } = storeToRefs(strategiesStore);
let filteredStrategies: any = [];
let activePlan = false;
let filteredPlans = ref<Array<{ key: string, value: string }>>([]);


watchEffect(() => {
  if (plans.value && plans.value.length > 0) {
    filteredPlans.value = plans.value
  }
})

const dropdownOptions = computed<any>(() => {
  if (plans.value.length > 0) {
    return plans.value.map((plan: any) => {
      return {
        id: plan.id,
        label: `${plan.name}`,
        icon: plan.icon
      };
    });
  }
  return []
})

let selectedPlan = ref(0);

watchEffect(() => {
  if (plans.value.length > 0 && your_plan.value) {
    selectedPlan.value= plans.value.filter((plan: any) => plan.name == your_plan.value)[0].id;
  }
})



filteredStrategies = computed(() => {
  const selectedPlanData = plans.value.find(
    (plan: any) => plan.id.toString() === selectedPlan.value.toString()
  );
  if (selectedPlanData && selectedPlanData.name === your_plan.value) {
    activePlan = true;
  } else {
    activePlan = false;
  }
  if (selectedPlanData && selectedPlanData.strategies) {
    return strategies.value.filter((strategy: any) =>{
      return selectedPlanData.strategies.hasOwnProperty(strategy.id.toString())
    })
  } else {
    return [];
  }
});


let reorderedPlans: any=[];
reorderedPlans = computed(() => {
  if (filteredPlans.value && filteredPlans.value.length === 0) {
    return [];
  } else {
    const centerPlanIndex = Math.floor(filteredPlans.value.length / 2);
    let plansCopy = [...filteredPlans.value] || filteredPlans.value;

    const yourPlanIndex = plansCopy.findIndex((plan: any) => plan.name === your_plan.value);
    if (yourPlanIndex !== -1) {
      const [yourPlan] = plansCopy.splice(yourPlanIndex, 1);
      plansCopy.splice(centerPlanIndex, 0, yourPlan);
    }

    return plansCopy;
  }
});

const showTableData = computed<boolean>(() => {
    const state = strategiesStore.state[strategiesStore.endpoint];
    return state && state.loading === false;
});


const setSelectedPlan = (plan: any) => {
  selectedPlan.value = plan;
};
</script>

<style >
.deactived{    --tw-border-opacity: 1;
    border-bottom-color:rgb(var(--color-primary) / 0) !important;}
.actived{    --tw-border-opacity: 1;
    border-bottom-color: rgb(var(--color-primary) / var(--tw-border-opacity)) !important;
    font-weight: 500;
    --tw-text-opacity: 1;
}

.mobile-device-table{
  @apply h-[calc(100vh-194px)] w-full overflow-scroll;
}
.card{
  border: white;
  box-shadow: 
    -5px -5px 15px rgba(255, 255, 255, 0.1), /* top-left white shadow */
    10px 10px 20px rgba(0, 0, 0, 0.7);      /* bottom-right black shadow */
}
</style>