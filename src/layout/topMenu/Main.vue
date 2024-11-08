<template>
  <div class="dark:bg-[#1F242A] dark:text-tableText w-[100vw] flex flex-col md:flex-row m-0 p-0 relative main-layout1">
    <!-- navbar container -->
    <div class="bg-third">
      <div class="relative visible md:hidden border-b dark:border-secondary overflow-x-hidden">
        <logoTopbar />
      </div>
      
      <!-- <div class="h-screen  border-r dark:border-[#0D2B3F] relative hidden md:block w-28 xl:w-64 2xl:w-72 overflow-y-scroll overflow-x-hidden bg-white dark:bg-[#153448]">
        <sideBar />
      </div> -->
    </div>
    <!-- navbar container end  -->

    <!-- main container -->
    <div class="relative md:h-screen flex flex-col bg-third dark:bg-[#1F242A] router-view p-0 m-0 overflow-x-hidden w-full"
     
    >
      <topbar />
      <div >
        <router-view />
      </div>
      <!-- <themeSwitcher /> -->
    </div>
    <!-- main container end  -->
  </div>
</template>

<script setup lang="ts">
import logoTopbar from '@/components/logoTopbar/Main.vue'
// import sideBar from '@/components/sideBar/Main.vue'
import topbar from '@/components/topbar.vue'
import themeSwitcher from '@/components/themeSwitcher.vue'
</script>
