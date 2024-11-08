<template>
  <div
    class="dashboard relative text-white md:p-4"
  >
    <!-- Header Section -->
    <!-- <div class="flex justify-between bg-[#30437C] w-full p-6  items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold">Hello {{ profile.name }}</h1>
        <p class="text-sm">Welcome back! Let's start your trade with the best strategies by us</p>
      </div>
    </div>  -->
    <div class="w-full flex justify-center">
      <div
        class="grid w-full grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
      >
        <!-- Total Orders Card -->
        <!-- <div class="bg-white dark:bg-[#1F242A] dark:text-white text-black p-0 rounded-lg border">
          <div class="px-6 pt-2">
            <h2 class="text-xl font-bold">Total Orders</h2>
            <p class="text-3xl font-bold">{{ totalOrders }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-200">{{ orderUpdatedTime }}</p>
          </div>
          <div class="mt-2">
            <img src="/images/dashboard/graph1.svg" class="w-full rounded-b-md" alt="" />
          </div>
        </div> -->
        <div class="flex justify-between items-center rounded-3xl px-8 py-8 card bg-white dark:bg-[#1F242A]">
          <div class="space-y-1 text-black dark:text-white">
            <h2 class="text-[16px]">Total Orders</h2>
            <div class="">
              <p class="font-bold text-[25px]">{{ totalOrders }}</p>
              <p class="text-[14px]"> {{  orderUpdatedTime }}</p>
            </div>
          </div>
          <div class="">
            <img :src="images['demoGraph']" alt="" />
          </div>
        </div>

        <!-- Total Profit Card -->
        <!-- <div class="bg-white dark:bg-[#1F242A] dark:text-white text-black p-0 rounded-lg shadow">
          <div class="px-6 pt-2">
            <h2 class="text-xl font-bold">Total Profit</h2>
            <p class="text-3xl font-bold"><TotalProfit /></p>
            <p class="text-sm text-gray-500 dark:text-gray-200">{{ updatePNLTime }}</p>
          </div>
          <div class="mt-2">
            <img src="/images/dashboard/graph1.svg" class="w-full rounded-b-md" alt="" />
          </div>
        </div> -->
        <div class="flex justify-between items-center rounded-3xl px-4 py-8 card bg-white dark:bg-[#1F242A]">
          <div class="space-y-1 text-black dark:text-white">
            <h2 class="text-[16px]">Total Profit</h2>
            <div class="">
              <p class="font-bold text-[25px]"> <TotalProfit/> </p>
              <p class="text-[14px]">{{  updatePNLTime }}</p>
            </div>
          </div>
          <div class="">
            <img v-if="isProfitIncrease" :src="images['demoGraphGreen']" alt="" class="w-[90%]"/>
            <img v-else :src="images['demoGraphRed']" alt="" class="rotateY w-[90%]"/>
          </div>
        </div>

        <!-- Brokers Connected Card -->
        <!-- <div class="bg-white dark:bg-[#1F242A] dark:text-white text-black p-0 rounded-lg shadow">
          <div class="px-6 pt-2">
            <h2 class="text-xl font-bold">Brokers Connected</h2>
            <p class="text-3xl font-bold">{{ brokersTokenMessage }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-200">{{ brokerConnectTime }}</p>
          </div>
          <div class="mt-2">
            <img src="/images/dashboard/graph1.svg" alt="" class="w-full rounded-b-md" />
          </div>
        </div> -->

        <div class="flex justify-between items-center rounded-3xl px-4 py-8 card bg-white dark:bg-[#1F242A]">
          <div class="space-y-1 text-black dark:text-white">
            <h2 class="text-[16px]">Brokers Connected</h2>
            <div class="">
              <p class="font-bold text-[25px]">{{ brokersTokenMessage }}</p>
              <p class="text-[14px]">{{  brokerConnectTime }}</p>
            </div>
          </div>
          <div class="">
            <img :src="images['demoGraph']" alt="" />
          </div>
        </div>

        <!-- Plan Card -->
        <!-- <div class="bg-white text-black p-0 rounded-lg shadow">
        <h2 class="text-xl font-bold">Plan</h2>
        <p class="text-3xl font-bold">{{ profile?.plan_name }}</p>
        <p class="text-sm text-gray-500">Updated 5 min ago</p>
        <div class="mt-2">
          <div class="h-16 bg-blue-200 rounded"></div>
        </div>
      </div> -->
      </div>
    </div>
    <!-- Cards Section -->
    <!-- Closing div for grid section -->
  </div>
  <!-- Closing div for dashboard -->
</template>

<script setup lang="ts">
import { images } from "@/assets/img/index";
import { storeToRefs } from "pinia";
import { ref, computed, watchEffect  } from "vue";
import TotalProfit from '@/stores/utils/totalpnl.vue';
import { useProfileStore } from '@/stores/matrix/profile';
import { useBrokersStore } from "@/stores/matrix/broker";
import { useOrdersStore } from "@/stores/matrix/order";
import { useManualOrdersStore } from "@/stores/groups/manualOrders"

import { usePositionsStore } from '@/stores/matrix/position'
import { useManualPositionsStore } from '@/stores/groups/manualPosition'

// Stores Initialization
const manualOrdersStore = useManualOrdersStore();
const profileStore = useProfileStore();
const brokersStore = useBrokersStore();
const ordersStore = useOrdersStore();

const positionsStore = usePositionsStore()
const manualPositionsStore = useManualPositionsStore()

// Profile Data
const { brokers, updatedBrokerTime } = storeToRefs(brokersStore);
const { totalRecords, updatedOrderTime } = storeToRefs(ordersStore);
const { updatedPositionTime, isProfitIncrease } = storeToRefs(positionsStore);
const { updatedManualPositionTime } = storeToRefs(manualPositionsStore);
const { updatedManualOrderTime } = storeToRefs(manualOrdersStore);

const profile = computed(() => {
  return profileStore.profile;
});

// Expiration Date Logic
let expire_at: any;
expire_at = computed(() => {
  if (profileStore.profile) {
    try {
      return profileStore.profile.expire_at.split("T")[0];
    } catch {
      return "";
    }
  }
});

// Broker Logic: Calculate brokersTokenMessage
interface Broker {
  id: number;
  broker_name: string;
  broker_token_date: string;
  token_status: string;
  message: string;
  updated_at: string;
}

interface BrokerArray extends Array<Broker> {}

const brokersData = computed<BrokerArray>(() => brokers.value);

var brokersTokenMessage = computed(() => {
  const totalBrokers = brokersData.value.length;
  if (totalBrokers > 0) {
    const today = new Date().toISOString().split("T")[0];
    const tokensGeneratedToday = brokersData.value.filter((broker: any) => broker.broker_token_date.split("T")[0] === today && broker.token_status === "success").length;

    let message = tokensGeneratedToday ? `(${tokensGeneratedToday}/${totalBrokers})` : `(0/${totalBrokers})`;

    return message;
  } else {
    return "0";
  }
});

// Total Orders Calculation (from ordersStore and manualOrdersStore)
const totalOrders = computed(() => {
  let order = ordersStore.totalOrders;
  let manualOrder = manualOrdersStore.totalManualOrders;
  if (order || manualOrder) {
    return order + manualOrder;
  }
  return 0;
});

const brokerConnectTime = computed(() => {
  return calculateTimeDifference(updatedBrokerTime.value);
})

const orderUpdatedTime = ref("");
const updatePNLTime = ref("");

watchEffect(() => {
    if (updatedOrderTime.value || updatedManualOrderTime.value) {
      let data = getLatestTime(updatedOrderTime.value, updatedManualOrderTime.value);
      orderUpdatedTime.value = calculateTimeDifference(data)
    } else {
      orderUpdatedTime.value = "Data not available";
    }
})

watchEffect(() => {
    if (updatedManualPositionTime.value || updatedPositionTime.value) {
      let data = getLatestTime(updatedManualPositionTime.value, updatedPositionTime.value);
      updatePNLTime.value = calculateTimeDifference(data)
    } else {
      updatePNLTime.value = "Data not available";
    }
})

function getLatestTime(date1: any, date2: any) {
    if (!date1 && !date2) return null
    if (!date1) return date2;
    if (!date2) return date1;

    // If both dates are valid, return the latest
    return date1 > date2 ? date1 : date2;
}


function calculateTimeDifference(datetime: string): string {
  if(!datetime) {
    return "Data not available";
  }

  const now = new Date();
  let temp = datetime.replace("Z", "+0530");
  const pastDate = new Date(temp);
  const diffInMs = Math.abs(now.getTime() - pastDate.getTime()); // Always positive difference

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  let updatedTime: string;
  if (diffInSeconds < 60) {
    updatedTime = `Updated ${diffInSeconds} sec ago`;
  } else if (diffInMinutes < 60) {
    updatedTime = `Updated ${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    updatedTime = `Updated ${diffInHours} hr ago`;
  } else {
    updatedTime = `Updated ${diffInDays} days ago`;
  }

  return updatedTime;
}

</script>

<style scoped>
.card{
  box-shadow: 
    -5px -5px 15px rgba(255, 255, 255, 0.1), /* top-left white shadow */
    10px 10px 20px rgba(0, 0, 0, 0.7);      /* bottom-right black shadow */
}
.rotateY {
  transform: rotateY(180deg);
}
</style>
