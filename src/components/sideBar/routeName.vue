<template>
    <template v-if="navData && navData.name !== '' && route && route.name !==''">
      <li>
        <router-link class="menu-items" :to="route.path"
                    :class="[
                      router.currentRoute.value.name === navData.name ? 'active' : '',
                      router.currentRoute.value.name === navData.name ? 'text-white' : 'text-[#656A70]'
                    ]">
          <div class="visible xl:hidden ">
            <Tippy class="text-center" :content="navData.title">
              <component :is="navData.icon" class="w-5 h-5 lg:w-6 lg:h-6"/>
            </Tippy>
          </div>
  
          <!-- <component :is="navData.icon" class="w-6 h-6 hidden xl:block"/> -->
          <div class="ml-2 hidden xl:block text-[16px]">{{ navData.title }}</div>
  
        </router-link>
      </li>
    </template>
  </template>
  
  <script setup lang="ts">
  import router from '@/router/index'
  import { computed } from 'vue'
  
  const props = defineProps({
    item: Object,
    route: Object
  });
  
  const navData = computed<any>(() => {
    let data = props.item as any
    return data
  });
  
  const route = computed<any>(() => {
    let data = props.route as any
    return data
  });
  
  </script>
  
  <style scoped lang="scss">
  .menu-items {
    @apply flex items-center justify-center xl:justify-start text-lg font-semibold cursor-pointer my-2 lg:mx-1 py-2 px-4;
    transition: background-color 0.3s ease;
    -webkit-transition: background-color 0.5s 0s ease;
    transition: background-color 0.5s 0s ease;
  
    &:hover {
      color: white; /* Text turns white on hover */
       /* Example dark background */
    }
  }
  
  </style>
  