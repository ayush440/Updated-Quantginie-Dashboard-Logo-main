
<template>
    <li v-if="navData && navData.name !== '' && route && route.name !==''" @click="mobileToggle = false">   
        <router-link class="menu-items" :to="route.path"
            :class= "[
                    router.currentRoute.value.name === navData.name ? 'active' : '',
                ]"
        >

            <component :is="navData.icon" class="w-6 h-6 "/>
            
            <div class="ml-2">{{ navData.title }}</div>

        </router-link>
    </li>


</template>


<script setup lang="ts">
    import { storeToRefs } from 'pinia'
    import router from '@/router/index'
    import { useNavlinksStore } from '@/stores/navlinks'
    import { computed } from 'vue'

    const navlinkStore = useNavlinksStore()
    const { mobileToggle } = storeToRefs(navlinkStore)

    const props = defineProps({
        item: Object,
        route: Object
    });
    
    const navData = computed<any>(() =>{
        let data = props.item as any
        return data
    });

    const route = computed<any>(() =>{
        let data = props.route as any
        return data
    });

</script>


<style scoped lang="scss">
    .menu-items{
        @apply flex items-center text-lg font-semibold cursor-pointer my-2 mx-1 py-2 px-4;
        transition: background-color 0.3s ease;
        -webkit-transition: background-color 0.5s 0s ease; 
        transition: background-color 0.5s 0s ease;

        &:hover{
            @apply bg-secondary bg-opacity-75 rounded-xl; 
            box-shadow: 0px 2px 2px 1px #dfdede;
        }

    }
    .active{
        @apply bg-secondary rounded-xl text-primary dark:text-white; 
        box-shadow: 0px 2px 2px 1px #dfdede;
    }

    // ul :nth-child(3){
    //     @apply active; 
    // }

    .dark {
        .menu-items:hover{
            box-shadow: 0px 2px 2px 1px rgb(var(--color-secondary-light));
        }
        .active{
            box-shadow: 0px 2px 2px 1px rgb(var(--color-secondary-light));
        }
    }



</style>
