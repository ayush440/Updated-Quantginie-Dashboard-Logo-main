<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div v-if="strategy">
        <div v-if="chartData && chartData.datasets && chartData.datasets[0].data">
            <Line :data="chartData" :options="options" />
        </div>

        <div v-else>
            <Bar :data="nullData" :options="options" />
        </div>
    </div>

    <!-- <Line :data="data" :options="options" /> -->

    
</template>
  
<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
  import { Line, Bar } from 'vue-chartjs'
  import { ref, computed } from 'vue';
  
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);


    const chartData = ref<any>([]);
    const props: any = defineProps({
        data : Object,
    })

    const generateColor = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 1)`;
    };

    const sortAndPrepareData = (data: any[]) => {
        const sortedData = data.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
        const labels = sortedData.map(item => {
            const date = new Date(item.month);
            return date.toLocaleString('default', { month: 'short',  year: 'numeric' }); //day: 'numeric',
        });
        const pnlData = sortedData.map(item => item.pnl);

        return { labels, pnlData };
    };


    const strategy : any = computed(() => {
        
        let tempData: any = props.data || {};
        const { labels, pnlData } = sortAndPrepareData(tempData.positions || []);
        // let pnlData1: any = [];

        // pnlData.reduce((sum, current, index) => {
        //     pnlData1[index] = sum + current;
        //     return pnlData1[index];
        // }, 0);

        // console.log("print labels and pnldata", labels, pnlData)
        if(Object.keys(tempData).length) {
            let temp = {
                labels: labels,

                datasets: [
                    {
                    label: 'PNL',
                    data: pnlData,
                    backgroundColor: generateColor(),
                    borderColor: generateColor().replace('0.2', '1'),
                    borderWidth: 1
                    }
                ]
            }
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            chartData.value = temp

        }
        return props.data
    })

    const nullData = ref<any>({
        labels: ['No Positions'],
        datasets: [
            {
            label: 'PNL',
            data: [0],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'white',
            borderWidth: 1
            }
        ]
    });
    

    const options = ref({
        responsive: true,
        padAngle: 5,

        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.7)',
                },
                // title: {
                //     display: true,
                //     text: 'Month'
                // }
            },
            y: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.7)',
                },
                title: {
                    display: true,
                    text: 'PNL',
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            }
        },
        plugins: {
            legend: {
            display: false 
            }
        }
    });
</script>
  