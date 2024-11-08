
<template>
  <div class="h-screen bg-[#1F242A] text-color">
    <div class="login-page relative h-full lg:grid lg:grid-cols-2">
      <!-- Image/Logo Section (visible only on large screens) -->
      <div class="hidden lg:flex items-center justify-center bg-cover bg-center animated-background relative">
        
      </div>

      <!-- Form Section -->

      <div class="flex flex-col  justify-center items-center p-6 w-full lg:w-full  ">
        <div class="w-full -mt-44"> <img src="/src/assets/svgs/quant.svg" alt="QuantGenie Logo" class="w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56 h-auto"/> </div>

        

        
        <!-- <img src="/src/assets/svgs/quant.svg" alt="QuantGenie Logo" class="w-auto h-auto object-contain" /> -->
        
        <div class="login-box bg-opacity-95 lg:bg-opacity-0 mx-2 sm:mx-0 min-w-[300px] sm:min-w-[500px] lg:min-w-[400px] rounded-lg dark:shadow-slate-800">
          <!-- mobile logo -->
          <div class="visible lg:hidden flex justify-center my-52 mt-20">
            <a class="flex justify-center items-center logo w-[249px] h-16 rounded-md cursor-pointer" href="#">
              <img src="../../assets/svgs/quant.svg" alt="Logo" class="w-auto h-auto object-contain mt-60" />

            </a>
          </div>


          <!-- Login Form -->
          <div v-if="!forgotPassword" class="max-w-md mx-auto p-6 mt-32">
            <!-- Error message -->
            
            <h1 class="text-4xl font-bold text-center dark:text-white text-gray-800 mb-2">Sign In</h1>
            <p class="text-center dark:text-white text-gray-600 mb-4">Please login to your account.</p>

            <!-- Error message -->
            <div class="text-red-500 text-center mb-4" v-if="error">
              ⚠️ {{ error }}
            </div>

            <form class="space-y-6" @submit.prevent="login">
              <!-- Email Input -->
    <div class="space-y-2">
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-white">
        Email
      </label>
      <div class="relative">
        <input
          id="email"
          type="email"
          v-model.trim="validateSignin.email.$model"
          autocomplete="email"
          class="w-full pl-10 pr-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1f242a]  dark:text-white"
          :class="{ 'border-red-500': validateSignin.email.$error }"
          style="box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1), 10px 10px 20px rgba(0, 0, 0, 0.7);"
        />
        <img
          src="/src/assets/svgs/mail.svg"
          alt="Mail Icon"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        />
      </div>
      <template v-if="validateSignin.email.$errors">
        <div v-for="error of validateSignin.email.$errors" :key="error.$uid" class="text-red-500 mt-2">
          {{ error.$message }}
        </div>
      </template>
    </div>

              <!-- Password Input -->
              <div class="space-y-2">
      <label for="password" class="block text-sm font-medium text-gray-700 dark:text-white">
        Password
      </label>
      <div class="relative">
        <input
          id="password"
          :type="passwordFields.password ? 'text' : 'password'"
          v-model.trim="validateSignin.password.$model"
          autocomplete="current-password"
          class="w-full pl-10 pr-12 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1f242a]  dark:text-white"
          :class="{ 'border-red-500': validateSignin.password.$error }"
          style="box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1), 10px 10px 20px rgba(0, 0, 0, 0.7);"
        />
        <img
          src="/src/assets/svgs/password.svg"
          alt="Password Icon"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        />
                  <span @click="togglePasswordVisibility('password')"
                    class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer dark:text-white text-gray-600">
                    <EyeOffIcon v-if="passwordFields.password" class="w-6 h-6" />
                    <EyeIcon v-else class="w-6 h-6" />
                  </span>
                </div>
                <template v-if="validateSignin.password.$errors">
                  <div v-for="error of validateSignin.password.$errors" :key="error.$uid" class="text-red-500 mt-2">
                    {{ error.$message }}
                  </div>
                </template>
              </div>

              <!-- Terms and Conditions -->
              <div class="flex items-center justify-between">
                <label class="flex items-center dark:text-white text-gray-600">
                  <input
                    v-model="checkbox"
                    type="checkbox"
                    class="form-checkbox h-5 w-5 text-white"
                    id="T&C"
                  />
                  <span class="ml-2 text-[#ADADAD]">
                    I agree to the&nbsp;
                    <a target="_blank" :href="tncUrl" class="text-white underline">T&C</a> &nbsp; and&nbsp;
                    <a target="_blank" :href="privacyPolicyUrl" class="text-white underline">Privacy Policy</a>
                  </span>
                </label>
              </div>
              <a href="javascript:;" @click="forgotPassword = true" class="text-blue-500 hover:underline">Forgot Password</a>

              <!-- Submit Buttons -->
              <div class="flex flex-col space-y-4">
                <button
                  type="submit"
                  :disabled="!checkbox"
                  :class="!checkbox ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'"
                  class="w-full py-3 bg-[#30437C] text-white font-semibold rounded-lg shadow-sm focus:outline-none">
                  Login
                </button>
                <button
                  type="button"
                  @click="handleToggle"
                  class="w-full py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-sm hover:bg-gray-600">
                  Register
                </button>
              </div>
            </form>
          </div>
          <!-- Other content (Forgot Password, OTP Verification, etc.) can go here -->
        </div>
      </div>
    </div>

    <!-- Theme Switcher -->
    <div class="absolute right-4 top-6 flex text-white">
      <DarkModeSwicher :bgCircle="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import logoComp from './logoComp.vue'
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, reactive, watchEffect, onBeforeMount } from 'vue'
import {
  token,
  setToken,
  setisAuthenticated,
  state,
  makeRequest
} from '@/request/request'
import router from '@/router/index'
import DarkModeSwicher from '@/components/darkModeSwicher.vue'
// import themeSwitcher from '@/components/themeSwitcher.vue'
import { showToast } from '@/request/request'
import { required, minLength, integer, email } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

import { useLogoStore } from '@/stores/utils/logo'
const logoStore = useLogoStore()
const { logoData } = storeToRefs(logoStore)

const error = ref("");
const checkbox = ref(false)
const forgotPassword = ref(false)
const forOtpVerify = ref(false);
const forgotEmail = ref("")


const tncUrl = ref('')
const privacyPolicyUrl = ref('')

async function checkUrl(url: any, name: string) {
  try {
    const response = await fetch(url, { method: 'HEAD' });

    const contentType = response.headers.get("Content-Type");
    const contentLength = response.headers.get("Content-Length");
    
    // Assuming the actual T&C page is an HTML file with a significant size
    if (contentType !== 'text/html' || !contentLength || parseInt(contentLength, 10) < 100) {
      if(name == "tnc") {
        tncUrl.value = '../../tnc.html'; // Fallback URL
      } else if(name == "privacy_policy") {
        privacyPolicyUrl.value = '../../privacy_policy.html'; // Fallback URL
      }
    }
  } catch (error) {
    if(name == "tnc") {
      tncUrl.value = '../../tnc.html'; // Fallback URL
    } else if(name == "privacy_policy") {
      privacyPolicyUrl.value = '../../privacy_policy.html'; // Fallback URL
    }
  }
}


const parsedUrl = ref<any>({})
const extractedDomainName = ref('')

function extractDomain() {
  const hostname = parsedUrl.value.hostname;
  const domain = hostname.replace(/^www\./i, '');

  extractedDomainName.value = domain.split('.').slice(0, 2).join('_');


  tncUrl.value = "/images/tnc/" + extractedDomainName.value + '_tnc.html';
  checkUrl(tncUrl.value, "tnc");
  privacyPolicyUrl.value = "/images/privacy_policy/" + extractedDomainName.value + '_privacy_policy.html';
  checkUrl(privacyPolicyUrl.value, "privacy_policy");
}

onBeforeMount(() => {
  const url = window.location.href
  parsedUrl.value = new URL(url);

  getDomain(url)
  extractDomain()
})

const domainName = computed(() => {
  return logoData.value
})

const imgName = ref('')
const imgLoad = ref(false)

function  handleImageLoad() {
  imgLoad.value = true
}
function handleImageError(error: any) {
  imgLoad.value = false
}


const getDomain = (url: string) => {
  const parsedUrl = new URL(url);
  let hostName = parsedUrl.hostname
  if(hostName == 'localhost'){
  } else {
    let splitedHost = hostName.split('.')
    imgName.value = splitedHost[1] + "_" + splitedHost[2]
    hostName = splitedHost[1]
  }
} 

const handleToggle = () => {
  router.push({ name: 'register' })
}

const otpData = reactive({
    email: '',
    otp: '',
    password: '',
  })

  const otpRules = {
    email: { required },
    otp: { required, minLength: minLength(6) },
    password: { required, minLength: minLength(6) },
  }

let validateOtp = useVuelidate(otpRules, toRefs(otpData)) 


const signinData = reactive({
  email: '',
  password: '',
})
const siginRules = {
  email: { required, email },
  password: { required, minLength: minLength(6) },

}
let validateSignin = useVuelidate(siginRules, toRefs(signinData))



const login = async () => {
  try {
    validateSignin.value.$touch();
    if (!validateSignin.value.$invalid) {
      const response:any = await makeRequest('login', 'POST', signinData)
      if (response) {
        let token = response.data.access_token
        setToken(token);

        setisAuthenticated(true,response.data.role_name);
        localStorage.setItem("role", response.data.role_name);

        localStorage.setItem("token", token);
        localStorage.setItem("refresh", 'true');

        
        router.push({ name: 'dashboard' })
        // window.location.reload()
        // showToast(response.message, 'success')
        error.value = "";
      } else {
        error.value = state["login"].error.data.message;
      }
    }
  } catch (error: any) {
    error.value = state["login"].error.message;
    if (error.value) {
      error.value = state["login"].error.data.message;
    }
  }
}


const sendOtp = async () => {
  try {
      const response = await makeRequest('sendForgotOTP', 'POST', {email: forgotEmail.value}, {}, {},0) 
      if(response) {
        error.value = "";
        forOtpVerify.value = true
        otpData.email = forgotEmail.value
      } else{
        error.value = state["sendForgotOTP"].error.data.message;
      }
  } catch (error: any) {
    error.value = state["sendForgotOTP"].error.message;
  }
}

const verifyOtp = async () => {
    try {
      validateOtp.value.$touch();
      if (!validateOtp.value.$invalid) {
          const response = await makeRequest('forgot', 'PUT', otpData, {}, {},0) 

          if(response) {
            error.value = "";
            forOtpVerify.value = false
            forgotPassword.value = false
            router.push({ name: 'login' })
            showToast("Password changed successfully", "success")
          } else {
            error.value = state["forgot"].error.data.message;
          }
      } 
  } catch (error: any) {
    error.value = state["forgot"].error.message;
    if (error.value) {
      error.value = state["forgot"].error.data.message;
    }
  }
}


let passwordFields = reactive<any>({
    password: false,
    newPassword: false
  });
  
  function togglePasswordVisibility(field: string) {
    passwordFields[field] = !passwordFields[field];
  }
</script>

<style scoped>

.submit-btn button{
  backdrop-filter: none !important;
  background-image: none !important;
}
.input-box label {
  @apply text-black font-bold;

}

.input-box input  {
    @apply w-full px-2 py-1 box-border border border-gray-50 rounded focus:outline-1 focus:outline-gray-200;
  }

.dark .input-box label {
  @apply text-tableText
}

/* CSS for the animated background */
/* if not run in build then give inline by first importing this file */
.animated-background {
width: 100%;

  background: url('@/assets/img/back.webp') no-repeat center center;
  
  background-size: cover;
  background-position: center;

}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
@keyframes backgroundAnimation {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}


.text-color{
  @apply text-black dark:text-white;
}


@media screen and (max-width: 1020px) {
  .login-page{
    background-size: cover;
  }
}
</style>