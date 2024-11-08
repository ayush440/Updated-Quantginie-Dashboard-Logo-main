import { ref } from 'vue'
import { defineStore } from 'pinia'
import { makeRequest, state  } from '@/request/request'

export const useBrokersStore = defineStore('brokers', () => {
  const endpoint = 'brokers'
  const wait=0
  const brokers = ref<any[]>([])
  const brokersByUserId = ref([])
  const showAddEditModal = ref(false)
  const editBrokerData = ref({})
  const showDeleteConfirmationModal = ref(false)
  const idForDelete = ref(0)

  const showOrderOptionModal = ref<boolean>(false)
  const showWebhookOrdersModal = ref<boolean>(false)
  const showMatrixOrdersModal = ref<boolean>(false)
  const storeBrokerId = ref(0)

  const showOrderPositionModal = ref<boolean>(false)
  const brokerOrders = ref<any>([])
  const showPositions = ref<boolean>(false)
  const brokerPositions = ref<any>([])
  const showSqOffModal = ref<boolean>(false)
  const brokerPosSqOffData = ref<any>({})

  const showBrokerName = ref<string>('')
  const storedBrokerData = ref<any>({})

  const updatedBrokerTime = ref<string>('')

  const getBrokers = async () => {
    try {
      const response = await makeRequest(endpoint, 'GET', {}, {}, {}, 0)
      if (response.data){
        brokers.value = response.data

        getLatestDate(brokers.value);

      } else {
          brokers.value = [];
      }
    } catch (error) {
      throw error
    }
  }
  
  const getBrokersById = (id: number) => {
    return brokers.value.find((broker: any) => broker.id === id);
  }

  const getBrokersByUserId = async (id: number, subEndpoint: string) => {
    try {
      const response = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, id, subEndpoint)
      if (response.data) {
        brokersByUserId.value = response.data
      } else {
        brokersByUserId.value = []
      }
    } catch (error) {
      throw error
    }
  }

  const showOrdersview = async (broker: any) => {
    state['getBrokerOrders']={
      loading: true,
      data: null,
      error: {},
      updating:false
    }
    
    let response = await makeRequest("getBrokerOrders", "GET", {}, {}, {}, 0, broker.id, );
    
    try{
        if(response.data){
          if(response.data.order){
              brokerOrders.value=response.data.order || []
          }else{
              brokerOrders.value=[]
          }
          if (response.data.position){
              brokerPositions.value=response.data.position || []
          }else{
              brokerPositions.value=[]
          }
        } else {
            brokerOrders.value=[]
            brokerPositions.value=[]
        }
        
        showBrokerName.value = broker.broker_name;
        
        
        brokerPosSqOffData.value.broker_id = broker.id
        brokerPosSqOffData.value.user_id = broker.user_id
        brokerPosSqOffData.value.broker_userid = broker.broker_userid
        brokerPosSqOffData.value.broker_api = broker.broker_api
        brokerPosSqOffData.value.broker_api_secret = broker.broker_api_secret
        brokerPosSqOffData.value.broker_name = broker.broker_name


    } catch (error) {
      brokerOrders.value=[]
      brokerPositions.value=[]
      throw error
    }
}

const findBrokerById = (id: number) => {
  return brokers.value.find((broker: any) => broker.id === id);
};

  const deleteBroker = async (id: number) => {
    try {
      await makeRequest(endpoint, 'DELETE', {}, {}, {}, 0, id)
      // getBrokers()
    } catch (error) {
      throw error
    }
  }

  // addEditBroker function edit broker
  async function addEditBroker(id: number, formdata: any) {
    try {
      if (id) {
        await makeRequest(endpoint, 'PUT', formdata, {}, {},0, id)
      } else {
        await makeRequest(endpoint, 'POST', formdata, {}, {}, 0)
      }
      // getBrokers()
    } catch (error) {
      throw error
    }
  }



  function getLatestDate(dataArray: { broker_token_date: string }[]) {
    if(dataArray.length === 0) {
      updatedBrokerTime.value  = ''
      return
    } 
    const latestDate = dataArray.reduce((latest, current) => {
      const currentDate = new Date(current.broker_token_date);
      const latestDate = new Date(latest.broker_token_date);

      return currentDate > latestDate ? current : latest;
    });

    updatedBrokerTime.value  = latestDate.broker_token_date
  }

  getBrokers()

  return {
    endpoint,
    wait,
    state,
    brokers,
    brokersByUserId,
    getBrokers,
    findBrokerById,
    deleteBroker,
    getBrokersById,
    getBrokersByUserId,
    addEditBroker,
    showOrdersview,

    showAddEditModal,
    editBrokerData,
    showDeleteConfirmationModal,
    idForDelete,
    showOrderOptionModal,
    showWebhookOrdersModal,
    showMatrixOrdersModal,
    storeBrokerId,

    showOrderPositionModal,
    showBrokerName,
    storedBrokerData,
    brokerOrders,
    showPositions,
    brokerPositions,
    showSqOffModal,
    brokerPosSqOffData,

    updatedBrokerTime
  }
})
