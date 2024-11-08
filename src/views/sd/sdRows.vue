<template>
    <tr class="text-left items-center" :class="{ 'bg-white bg-opacity-5': isEven(index || 0) }">
        <td >{{ data.created_at.split("T")[0] }}</td>
        <td >{{ data.tradingsymbol }} ({{ data.exchange }})</td>
        <td >{{ data.quantity }}</td>
        <td >{{ data.buy_price }}</td>
        <td >{{ data.sell_price }}</td>
        <td :class="pnl > 0 ? 'color-success-100' : 'color-sell-100'">{{ pnl }}</td>
        <td >{{ data.status }}</td>
    </tr>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';


const props = defineProps({
    item: Object,
    index: Number
});
let pnl:number=0
const data = computed<any>(() =>{
    const data: any = props.item
    pnl= data.status === "CLOSED" ? (data.sell_price-data.buy_price)*data.quantity : 0
    return data
});

const isEven = (index: number) => index % 2 === 0
</script >

<style scoped>
.color-buy-100 {
    background-color:var(--color-buy-background-100);
    color:var(--color-buy-100);
    padding: 2px 10px;
    border-radius: 5px;
}
.color-sell-100 {
    background-color:var(--color-sell-background-100);
    color:var(--color-sell-100);
    padding: 0 10px;
    border-radius: 5px;
}

.color-pending-100 {
    background-color:var(--color-pending-background-100);
    color:var(--color-pending-100);
    padding: 0 10px;
    border-radius: 5px;
}

.color-success-100 {
    background-color:var(--color-success-background-100);
    color:var(--color-success-100);
    padding: 0 10px;
    border-radius: 5px;
}


.content-fit{
    justify-content: center;
    display: flex;
        width: fit-content;
}
.xx-small{
  font-size: .6rem;
}
.small{
  font-size: .8rem;
}
</style>