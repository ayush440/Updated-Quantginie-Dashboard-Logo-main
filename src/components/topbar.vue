<template>
  <div
    class="hidden md:flex justify-between items-center py-3 px-4 bg-white dark:bg-[#1F242A] sticky top-0 z-30" style="z-index: 61;"
  >
    <!-- page Name  -->
    <div
      class="unselectable capitalize ml-3 font-bold text-2xl text-[#30437C] dark:text-white text-[35px] xl:text-[40px]"
    >

      <img src="../assets/img/png.png" alt="Logo" class="w-[120px] max-h-[60px] object-contain" />

    </div>

    <div class="">
      <ul v-if="navlinks.length > 0 && allRoutes.length > 0" class="flex">
        <routeName
          v-for="(navData, index) in navlinks"
          :key="index"
          :item="navData"
          :route="findRoutes(navData.name)"
        />
      </ul>
    </div>

    <div class="hidden sm:flex items-center pt-0 2xl:pt-2 pr-0 2xl:pr-2">
      <!-- <div class="hidden md:block">
        <DarkModeSwicher :topbar="true" />
      </div> -->

      <!-- notification   -->
      <PopupDropdown
        :isOpen="showNotificationModal"
        @close="closeNotificationModal"
        dropdownClass="dropdown-1 top-[100%] shadow-lg border border-third-light dark:border-third"
      >
        <template #dropdown-toggle>
          <div
            class="p-2 2xl:p-2.5 mx-1 bg-secondary small-box-shadow rounded-full"
            @click="toggleNotificationModal"
          >
            <ActiveAlertIcon class="w-4 h-4 2xl:w-5 2xl:h-5 cursor-pointer" />
          </div>
        </template>

        <template #dropdown-body>
          <div
            class="max-h-[320px] overflow-y-scroll text-gray-600 dark:text-white text-center p-2"
          >
            <div
              v-if="notifications.length > 0"
              class="cursor-pointer relative"
              v-for="notification in notifications"
            >
              <div class="ml-2 overflow-hidden">
                <div class="flex items-center">
                  <a href="javascript:;" class="font-medium truncate mr-5">{{
                    notification.heading
                  }}</a>
                  <div class="text-xs text-slate-400 ml-auto whitespace-nowrap">
                    {{ notification.time }}
                  </div>
                </div>
                <div class="text-left truncate text-slate-400 mt-0.5">
                  Strategy: {{ notification.strategy ? notification.strategy.name : 'N/A' }}
                </div>
                <div class="text-left truncate text-slate-400 mt-0.5">
                  Exchange: {{ notification.exchange }}
                </div>
                <div class="text-left truncate text-slate-400 mt-0.5">
                  Side: {{ notification.side }}
                </div>
                <div class="text-left truncate text-slate-400 mt-0.5">
                  Symbol: {{ notification.tradingsymbol }}
                </div>
                <div class="text-left truncate text-slate-400 mt-0.5">
                  {{ notification.message }}
                </div>
              </div>
            </div>
            <span v-else> You have no notifications </span>
          </div>
        </template>
      </PopupDropdown>

      <!-- profile  -->

      <PopupDropdown
        :isOpen="showProfileModal"
        @close="closeProfileModal"
        dropdownClass="dropdown-1 max-w-56 top-[100%] right-[70%] shadow-lg border border-third-light dark:border-third"
      >
        <template #dropdown-toggle>
          <div class="flex ">
            <div
              class="p-2 mx-1 bg-secondary mt-1 rounded-full card"
              @click="toggleProfileModal"
            >
              <!-- <UserIcon class="w-4 h-4 2xl:w-5 2xl:h-5 cursor-pointer" /> -->
              <img class="w-12 h-12 rounded-full" :src="profile.profile_picture_url ? profile.profile_picture_url : images['profileLarge']" alt="" />
            </div>

          </div>
        </template>
        <template #dropdown-body>
          <div class="font-bold text-xl">Profile</div>
          <div class="font-medium capitalize pb-2">
            {{ profile?.name }} <br />
            <span class="text-sm lowercase"> {{ profile?.email }} </span>
          </div>
          <div @click="clickProfile" class="profile-option">
            <userIcon class="icon-size ml-0" />My Profile
          </div>
          <div @click="clickRefresh" class="profile-option">
            <ReloadIcon class="icon-size p-[1px] ml-0" />Refresh
          </div>
          <div class="profile-option"><HelpIcon class="icon-size ml-0" />Help</div>
          <div class="profile-option" @click="logout">
            <LockIcon class="icon-size ml-0" />Logout
          </div>
        </template>
      </PopupDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { images } from '@/assets/img'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router/index'
import routeName from '@/components/sideBar/routeName.vue'
import DarkModeSwicher from '@/components/darkModeSwicher.vue'
import { logout } from '@/request/request'
import { useProfileStore } from '@/stores/matrix/profile'
import { useNotificationsStore } from '@/stores/matrix/notification'
import { useStrategiesStore } from '@/stores/matrix/strategy'
import { useNavlinksStore } from '@/stores/navlinks'
const notificationStore = useNotificationsStore()
const strategiesStore = useStrategiesStore()

const navlinksStore = useNavlinksStore()
const { navlinks } = storeToRefs(navlinksStore)

let { notificationsData } = storeToRefs(notificationStore)

const { strategies } = storeToRefs(strategiesStore)

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const RouteNameArray = ref(['invoices', 'invoice_items'])

const titleVisible = computed(() => {
  if (router.currentRoute.value.name) {
    let name = router.currentRoute.value.name.toString() || ''
    return !RouteNameArray.value.includes(name)
  }
  return true
})

const title = computed(() => {
  let name = router.currentRoute.value.name || ''
  if (name) {
    let titleData = navlinks.value.find((item: any) => item.name === name)
    return titleData && titleData.title ? titleData.title : name
  }
  return ''
})

const allRoutes = computed(() => router.getRoutes())


const findRoutes = (name: string) => {
    return allRoutes.value.find((route) => route.name === name)
}

const showNotificationModal = ref(false)

let notifications = computed<any>(() => {
  if (
    notificationsData.value &&
    strategies.value &&
    strategies.value.length > 0 &&
    notificationsData.value.length > 0
  ) {
    // Map strategy IDs to their corresponding strategies for efficient lookup
    const strategyMap = new Map(
      strategies.value.map((strategy: { id: any }) => [strategy.id, strategy])
    )

    // Associate each notification with its corresponding strategy
    const notificationsWithStrategies = notificationsData.value.map(
      (notification: { strategy_id: unknown }) => {
        const strategy = strategyMap.get(notification.strategy_id)
        return {
          ...notification,
          strategy: strategy || null
        }
      }
    )
    return notificationsWithStrategies
  }

  return []
})

const closeNotificationModal = () => {
  showNotificationModal.value = false
}

const clickProfile = () => {
  router.push({ name: 'profile' })
  showProfileModal.value = false
}

const clickRefresh = () => {
  window.location.reload()
}
const toggleNotificationModal = () => {
  showNotificationModal.value = !showNotificationModal.value
}

const showProfileModal = ref(false)

const closeProfileModal = () => {
  showProfileModal.value = false
}

const toggleProfileModal = () => {
  showProfileModal.value = !showProfileModal.value
}
</script>

<style scoped>
.profile-option {
  @apply hover:bg-primary hover:bg-opacity-10 dark:hover:bg-opacity-40 cursor-pointer flex bg-secondary dark:bg-primary dark:bg-opacity-50 dark:shadow-slate-600 rounded p-1 my-1 shadow-sm;
}

.icon-size {
  @apply m-1 h-4 w-4;
}

.card{
  box-shadow: 
    -5px -5px 15px rgba(255, 255, 255, 0.1), /* top-left white shadow */
    10px 10px 20px rgba(0, 0, 0, 0.7);      /* bottom-right black shadow */
}
</style>
