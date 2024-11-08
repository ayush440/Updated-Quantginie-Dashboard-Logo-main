<template>
  <tr  class="hidden sm:table-row intro-x" :class="{ 'bg-white bg-opacity-5': isEven(index || 0) }">
    <td class="capitalize ">
      <div class="flex items-center text-nowrap px-2">
        <img class="shadow-none w-4 h-4 mr-1"
          :src="`${images[broker.broker_name]}`"
          :alt="broker.broker_name"
        />
        &nbsp;{{ broker.broker_name }}
      </div>
    </td>

    <td class="text-left">{{ broker.broker_userid }}</td>
  
    <td class="text-center  text-nowrap">
      {{ broker.broker_token_date.replace('T', ' ').replace('Z', '') }}
    </td>
    <td class="text-center flex justify-center">
      <ButtonSwitch @change="handleActiveChange()" :id="`${broker.id}`" name="is_active" v-model="broker.is_active"/>
    </td>
    <td class="text-center ">
      <a class="flex items-center justify-center mr-3 "  @click="tokenGenerate(broker)" href="javascript:;" :class="tokendate(broker.broker_token_date) && broker.token_status === 'success' ? 'text-success': updatedTodayDate(broker.updated_at) && broker.token_status !== 'success' ? 'text-danger':''">
          <Tippy class="tooltip flex items-center text-center justify-center" :content="updatedTodayDate(broker.updated_at) && broker.message ? broker.message : 'Error'" v-if="updatedTodayDate(broker.updated_at) && broker.token_status === 'failed'">
            <span class="flex items-center pt-[2px]"><AlertCircleIcon class="w-4 h-4 mr-1"/>Connect</span>
          </Tippy>
          <Tippy class="tooltip flex items-center text-center" :content="tokendate(broker.broker_token_date) && broker.message ? broker.message : 'Connected'" v-else-if="tokendate(broker.broker_token_date)"   >
            <span class="flex items-center pt-[2px]"><CheckCircleIcon class="w-4 h-4 mr-1 text-success"  />Connected</span>
          </Tippy>
          <Tippy class="tooltip flex items-center text-center" :content="'Connect'" v-else   >
            <span class="flex items-center pt-[2px]"><Link2Icon class="w-4 h-4 mr-1" /> Connect</span>
          </Tippy>
        </a>
    </td>
    <td >
      <div class="flex justify-center items-center	">
        <button class="mr-2 flex items-center" @click="showEdit(broker)">
          <EditIcon class="w-4 h-4" /> Edit
        </button>
        <button class="mr-2 flex items-center" @click="showOrdersPosition(broker)">
          <EditIcon class="w-4 h-4" /> Orders/Positions
        </button>
        <!-- <button class="delete-btn flex items-center" @click="deleteModal(broker.id)">
          <DeleteIcon class="w-4 h-4" /> Delete
        </button> -->
      </div>
    </td>
  </tr>





  <!-- for mobile screen  -->

  <div class="intro-x visible sm:hidden relative my-1" :class="{ 'shadow-md dark:shadow-slate-600 ': fullDetails, 'shadow-sm dark:shadow-slate-600': !fullDetails, 'bg-white bg-opacity-5': isEven(index || 0) }">
    <div class="px-4" :class="{ 'bg-secondary-dark font-semibold': fullDetails }">
      <div @click="fullDetails = !fullDetails" class="flex justify-between items-center py-3 text-sm cursor-pointer" >
        <div class="flex items-center text-nowrap pl-2 capitalize">
          <img class="shadow-none w-4 h-4 mr-2"
            :src="`${images[broker.broker_name]}`"
            :alt="broker.broker_name"
          />
          &nbsp;{{ `${broker.broker_name}- ` }}{{ broker.broker_userid }}
          <RightArrowIcon class="w-[12px] h-[12px] inline ml-1 transform rotate-90 transition transition-delay-300" :class="{ 'rotate-[-90deg]': fullDetails, 'rotate-90': !fullDetails }" />
        </div>

        <ButtonSwitch @change="handleActiveChange()" :id="`${broker.id}is_active`" name="is_active" v-model="broker.is_active"/>
      </div>

      
    </div>

    <div v-if="fullDetails" class="p-2 capitalize">
      <div class="flex flex-col w-full h-fit justify-between text-center text-xs xs:text-sm overflow-hidden bg-secondary border-t border-dashed dark:border-slate-600 p-2 rounded-lg">

        <div class="flex items-center justify-between px-2 py-1 bg-white bg-opacity-5">
          <div class="font-semibold">Token Date: </div>
          <div class="ml-4">{{ broker.broker_token_date.replace('T', ' ').replace('Z', '') }}</div>
        </div>


        <div class="flex items-center my-1 justify-between px-2 py-1">
            <div class="flex flex-wrap justify-left">
              <div class="font-semibold mr-2">ACTIONS: </div>
                <button class="mr-2 flex items-center" @click="showEdit(broker)">
                  <EditIcon class="w-4 h-4" />Edit
                </button>

                <button class="mr-2 flex items-center" @click="showOrdersPosition(broker)">
                  <EditIcon class="w-4 h-4" />Orders/Positions
                </button>
                
                <!-- <button class="mr-2 delete-btn flex items-center" @click="deleteModal(broker.id)">
                  <DeleteIcon class="w-4 h-4" />Delete
                </button> -->
            </div>
        </div>


        <div class="flex items-center justify-between px-2 py-1 bg-white bg-opacity-5">
          <div class="font-semibold">Connect: </div>
          <a class="flex items-center mr-3 "  @click="tokenGenerate(broker)" href="javascript:;" :class="tokendate(broker.broker_token_date) && broker.token_status === 'success' ? 'text-success': updatedTodayDate(broker.updated_at) && broker.token_status !== 'success' ? 'text-danger':''">
              <div v-if="updatedTodayDate(broker.updated_at) && broker.token_status === 'failed'" class="flex items-center justify-center" :content="updatedTodayDate(broker.updated_at) && broker.message ? broker.message : 'Error'" >
                <AlertCircleIcon class="w-3 h-3 mr-1 mt-[1px]"/>Connect
              </div>
              <div v-else-if="tokendate(broker.broker_token_date)" class="flex items-center" :content="tokendate(broker.broker_token_date) && broker.message ? broker.message : 'Connected'"    >
                <CheckCircleIcon class="w-3 h-3 mr-1 text-success mt-[1px]"  />Connected
              </div>
              <div v-else class="flex items-center" :content="'Connect'"    >
                <Link2Icon class="w-3 h-3 mr-1 mt-[1px]" /> Connect
              </div>
          </a>
        </div>

        <div v-if="broker.message" class="flex items-center">
          <div class="font-semibold">Message: </div>
          <div class="ml-4 " :class="tokendate(broker.broker_token_date) && broker.token_status === 'success' ? 'text-success': updatedTodayDate(broker.updated_at) && broker.token_status !== 'success' ? 'text-danger':''">

                <div v-if="updatedTodayDate(broker.updated_at) && broker.token_status === 'failed'">
                  {{  updatedTodayDate(broker.updated_at) && broker.message ? broker.message : 'Error' }}
                </div>
                <div v-else-if="tokendate(broker.broker_token_date)">
                  {{ tokendate(broker.broker_token_date) && broker.message ? broker.message : 'Connected' }}
                </div>
                <div v-else   >
                  {{ broker.message }}
                </div>
            
          </div>
        </div>

      </div>
    </div>
    
  </div>

          
</template>

<script setup lang="ts">
import { images } from '@/assets/img'
import { makeRequest } from '@/request/request'
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBrokersStore } from '@/stores/matrix/broker'
import { useProfileStore } from '@/stores/matrix/profile'

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const brokersStore = useBrokersStore()
const { showAddEditModal, editBrokerData, showDeleteConfirmationModal, idForDelete,
  showBrokerName, showOrderPositionModal, storedBrokerData, } = storeToRefs(brokersStore)

const { getBrokers, addEditBroker, showOrdersview } = brokersStore

// define interface to ignore type warning error
interface Broker {
  id: number
  broker_name: string
  user_id: number
  user_name: string
  broker_userid: string

  broker_token_date: string
  is_disabled: boolean
  is_active: boolean
  updated_at: string
  message: string
  token_status: string

}

const props = defineProps({
    item: Object,
    index: Number
});

const fullDetails = ref<boolean>(false)

const broker = computed<Broker>(() =>{
    let data = props.item as Broker
    return data
});

const tokenGenerate = async (broker: Broker): Promise<void> => {
  let tokengenId: number = broker.id;

  try {
    let response = await makeRequest("generateToken", "GET", {}, {}, {},0, tokengenId);

    if (response.data && broker.broker_name === "zerodha") {
      window.open(response.data.redirect_url, '_blank');
    }
    // getBrokers()

  } catch (error) {
    // Handle errors if needed
    // console.error("Error in token generation:", error);
  }
};

const tokendate = (date: any) => {
  let brokerDate = new Date(date.replace("Z","")).toLocaleDateString('en-CA');
    return brokerDate === new Date().toLocaleDateString('en-CA');
}

const updatedTodayDate = (date: any) => {
  const updatedAt: Date  = new Date(date)
  const today: Date = new Date();
  today.setUTCHours(0, 0, 0, 0);
  updatedAt.setUTCHours(0, 0, 0, 0);
    return updatedAt.getTime() === today.getTime();
}

const handleActiveChange = async() => {
  broker.value.is_active = !broker.value.is_active
  await addEditBroker(broker.value.id, {"is_active":broker.value.is_active? false : true})
}

const showEdit = (broker: any) => {
  showAddEditModal.value = true
  editBrokerData.value = broker
}


const showOrdersPosition = (data: any) => {
  showBrokerName.value = data.broker_name
  storedBrokerData.value = data
  showOrderPositionModal.value = true
  showOrdersview(data)
}
const deleteModal = (id: number) => {
  showDeleteConfirmationModal.value = true
  idForDelete.value = id
}
const isEven = (index: number) => index % 2 === 0
</script>
