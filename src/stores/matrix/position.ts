import { ref, computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { defineStore } from 'pinia'
import { makeRequest, state } from '@/request/request'
import { useStrategiesStore } from '@/stores/matrix/strategy'
import { useBrokersStore } from '@/stores/matrix/broker'
import { useManualPositionsStore } from '@/stores/groups/manualPosition'
import { useTickerStore } from "@/stores/matrix/ticker/ticker"

export const usePositionsStore = defineStore('positions', () => {
  const tickerStore = useTickerStore();
  const strategiesStore = useStrategiesStore()
  const manualPositionsStore = useManualPositionsStore()
  const brokersStore = useBrokersStore()
  const { strategies } = storeToRefs(strategiesStore)
  const { mainManualPosition, updatedManualPositionTime } = storeToRefs(manualPositionsStore)
  const { brokers } = storeToRefs(brokersStore)

  const endpoint = 'positions'
  const positions = ref<any>([])
  const mainPositions = ref<any>([])
  const tempPositions = ref<any>([])
  const strategiesPositions = ref<any>([])
  const positionsByUserId = ref([])
  const positionsByStgId = ref([])

  const isTabActive = ref('Live')


  const showSqOffModal = ref(false)
  const showCloseModal = ref(false)
  const dataForSqOff = ref({strategy_id: 0, broker_id: 0, position_id: 0})

  const showAddEditModal = ref(false)
  const addEditPositionData = ref({})
  const showDeleteConfirmationModal = ref(false)
  const idForDelete = ref(0)

  const searchInputText = ref<string>('');
  const currentPageNumber = ref<number>(1);
  const totalPages = ref<number>(0);
  const showStartRecords = ref<number>(1);
  const showEndRecords = ref<number>(0);
  const totalRecords = ref<number>(1);

  const updatedPositionTime = ref('')

  const isProfitIncrease = ref(true)

  const page_id = 1
  const page_size = 10

  const getPositions = async () => {
    try {
      const response = await makeRequest(endpoint, 'GET', {}, {}, { })
      if (response.data){
        positions.value = response.data.sort((a: any, b: any) => b.id - a.id) || []
        mainPositions.value = positions.value

        mainPositions.value.map((pos:any, index: number) => ({
          ...pos,
          serialNo: `position-${index}`
        }));
        tempPositions.value = mainPositions.value

        getLatestDate(mainPositions.value)

        let tokensList = []
        for (let i = 0; i < positions.value.length; i++) {
          tokensList.push(positions.value[i].instrument_token)
        }
        tickerStore.updateTickerList(tokensList)
        strategiesPositions.value = computeStrategiesPositions();
      } else {
          positions.value = [];
          mainPositions.value = positions.value
      }
      
    } catch (error) {
      throw error
    }
  }

  interface GroupedPositions {
    [key: string]: { color: string, color2: string, pnl: number, name: string, image_url: string, script: string, positions: any }; // or [key: number]: Position[] if strategy_id is a number
  }
  function groupPositionsByStrategyId(positions: any, strategies: any) {
    const groupedPositions = {} as GroupedPositions;
    positions.forEach((position: any) => {
      
      const { strategy_id } = position;
      const strategy = strategies.find((s: any) => s.id === strategy_id);

      position.last_price = updatePositionLastPrice(position) || 0;
      
      // let pnl =
      //   position.status === "CLOSED"
      //     ? (position.sell_price - position.buy_price) * position.quantity
      //     : position.status === "OPEN" && position.last_price
      //     ? position.side === "BUY"
      //       ? (position.last_price - position.buy_price) * position.quantity
      //       : (position.sell_price - position.last_price) * position.quantity
      //     : 0;
      


      // new code for pnl
      let pnl = 0
      if (position.status !== "OPEN" ) {
        if(position.sell_price && position.buy_price){
          pnl = (position.sell_price - position.buy_price) * position.quantity
        }
      } else if (position.side === 'BUY' ) {
        if(position.buy_price && position.last_price){
          pnl = (position.last_price - position.buy_price) * position.quantity;
        }
      } else if (position.side === 'SELL' ) {
        
        if(position.sell_price && position.last_price){
          pnl = (position.sell_price - position.last_price) * position.quantity;
        }
      }
    
      
      position.pnl = pnl

      if (!groupedPositions[strategy_id]) {
        let color = strategy.color.replace(/,[\s\d.]+[)]$/, ", 0.8)");
        groupedPositions[strategy_id] = {
          color: color,
          color2: strategy.color2,
          pnl: pnl,
          name: strategy.name,
          image_url: strategy.image_url,
          script: strategy.script,
          positions: [],
        };
      } else {
        groupedPositions[strategy_id].pnl += pnl;
      }
  
      groupedPositions[strategy_id].positions.push(position);
    });
  
    return groupedPositions;
  }

  // Define the function separately
  function computeStrategiesPositions() {
    if(mainManualPosition.value && mainManualPosition.value.length){
      // include manual positions also 
      mainPositions.value = [...tempPositions.value, ...mainManualPosition.value]
    }
    if (Object.keys(mainPositions.value).length && strategies.value.length) {
      let data = groupPositionsByStrategyId(
        mainPositions.value,
        strategies.value
      );
      const chartDataArray = [];
      for (const id in data) {
        chartDataArray.push({
          label: data[id].name,
          value: data[id].pnl,
        });
      }

      return data; // Assuming the intention was to return 'data'. If you intended to return 'chartDataArray', adjust accordingly.
    } else {
      return [];
    }
  }

  watchEffect(() => {
    strategiesPositions.value = computeStrategiesPositions();
  });

  watchEffect(() => {
    if(strategies.value.length > 0 && brokers.value.length > 0 && positions.value.length > 0) {
      for (let i = 0; i < positions.value.length; i++) {
        const strgy = strategies.value.find(
          (s:any) => s.id === positions.value[i].strategy_id
        );
        const brkr = brokers.value.find(
          (s:any) => s.id === positions.value[i].broker_id
        )
        positions.value[i].broker = brkr;
        positions.value[i].strategy = strgy;
      }
    }
  })

  const getPositionsByUserId = async (id: number, subEndpoint: string) => {
    try {
      const response = await makeRequest(endpoint, 'GET', {}, {}, { page_id, page_size, user_id: id }, (id = 0), subEndpoint)
      if (response.data) {
        positionsByUserId.value = response.data
      } else {
        positionsByUserId.value = []
      }
    } catch (error) {
      throw error
    }
  }
  const getPositionsByStgId = async (id: number, subEndpoint: string) => {
    try {
      const response = await makeRequest(endpoint, 'GET', {}, {},{page_id, page_size, strategy_id: id}, (id = 0),subEndpoint)
      if (response.data) {
        positionsByStgId.value = response.data.data || []
      } else {
        positionsByStgId.value = []
      }
    } catch (error) {
      throw error
    }
  }


  function updatePositionLastPrice(data: any) {
    // positions.value.forEach((position: any) => {
    //   if (position.instrument_token === data.instrument_token) {
    //     position.last_price = data.last_price;
    //   }
    // });
    // return
    const newTick = tickerStore.getLastPrice(data.instrument_token);
    return newTick ||data.last_price;
  };

  // sqOffPosition function 
  async function sqOffPosition() {
    try {
        await makeRequest(endpoint, 'POST', dataForSqOff.value, {}, {})
        getPositions()
        return "success"
    } catch (error) {
      throw error
    } finally {
      dataForSqOff.value = {strategy_id: 0, broker_id: 0, position_id: 0}
    }
  }

  async function closePosition() {
    try {
        await makeRequest('closePosition', 'POST', dataForSqOff.value, {}, {})
        return "success"
    } catch (error) {
      throw error
    } finally {
      dataForSqOff.value = {strategy_id: 0, broker_id: 0, position_id: 0}
    }
  }

  function getLatestDate(dataArray: { updated_at: string }[]) {
    if(dataArray.length === 0) {
      updatedPositionTime.value  = ''
      return
    }
    const latestDate = dataArray.reduce((latest, current) => {
      const currentDate = new Date(current.updated_at);
      const latestDate = new Date(latest.updated_at);

      return currentDate > latestDate ? current : latest;
    });

    updatedPositionTime.value  = latestDate.updated_at
  }

  getPositions()

  return {
    state,
    endpoint,
    positions,
    mainPositions,
    strategiesPositions,
    positionsByUserId,
    positionsByStgId,
    isTabActive,
    getPositions,
    getPositionsByUserId,
    getPositionsByStgId,
    sqOffPosition,
    closePosition,

    showSqOffModal, 
    showCloseModal,
    dataForSqOff,
    updatePositionLastPrice,

    showAddEditModal,
    addEditPositionData,
    showDeleteConfirmationModal,
    idForDelete,

    searchInputText,
    currentPageNumber,
    totalPages,
    showStartRecords,
    showEndRecords,
    totalRecords,
    updatedPositionTime,
    isProfitIncrease
  }
})
