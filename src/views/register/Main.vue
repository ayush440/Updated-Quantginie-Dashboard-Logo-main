<template>
  <div class="h-screen bg-[#1F242A] text-color overflow-hidden sm:overflow-visible">
    <div class="login-page relative h-full grid lg:grid-cols-2 gap-4">
      <!-- Logo and Animated Background -->
      <div class="relative hidden lg:flex items-center justify-center overflow-hidden">
        <a
          class="absolute z-10 top-2 left-2 w-[249px] h-16 flex justify-center items-center logo cursor-pointer"
          href="#"
        >
          <logoComp />
        </a>
        <div class="animated-background absolute inset-0 bg-cover bg-center">
          <!-- Animation background here -->
        </div>
      </div>

      <!-- Sign Up for an Account -->
      <div class="flex flex-col justify-center items-center px-4 lg:px-0 h-full overflow-y-auto sm:justify-center">
        <div class="w-full mt-10 xs:hidden md:block">
  <img 
    src="/src/assets/svgs/quant.svg" 
    alt="QuantGenie Logo" 
    class="w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56 h-auto"
  />
</div>

  <div class="rounded-lg bg-[#1F242A] mx-2 sm:mx-4 p-0 w-full max-w-[600px] flex flex-col justify-between h-full py-2 "> <!-- Reduced padding and limited max width -->
    <div class="login-box min-w-[280px] sm:min-w-[450px] lg:min-w-[400px] bg-opacity-10 rounded-lg">
            <!-- Mobile logo -->
            <div class="visible lg:hidden flex justify-center my-20 mt-1">
            <a class="flex justify-center items-center logo w-auto h-2 rounded-md cursor-pointer" href="#">
              <img src="../../assets/svgs/quant.svg" alt="Logo" class="w-auto h-auto object-contain mt-52" />

            </a>
          </div>

            <!-- Sign Up Form -->
            <div class="max-w-lg mx-auto p-10   ">
              <h1 class="text-3xl font-bold text-center dark:text-white text-gray-800 mt-10 mb-4">Register Now</h1>
              <p class="text-center dark:text-white text-gray-600 mb-4">Please enter your login details below to access your account.</p>

              <!-- Error message -->
              <div class="text-red-500 text-center mb-4" v-if="error">⚠️ {{ error }}</div>

              <form @submit.prevent="verifyOtp" class="space-y-6">


                <!-- User Information -->
                <div v-if="!otpAuthSignup" class="space-y-6">
                  <!-- Full Name -->
                  <div class="flex flex-col relative">
    <label for="name" class="dark:text-white text-gray-700 mb-2 text-sm">Full Name</label>
    
    <div class="relative">
        <img
            src="/src/assets/svgs/user.svg"
            alt="User Icon"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        />

        <input
            id="name"
            type="text"
            name="name"
            v-model.trim="validateSignUp.name.$model"
            placeholder="Enter your name"
            class="w-full px-4 py-2 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            :style="inputStyle"
        />
    </div>
    
    <template v-if="validateSignUp.name.$error">
        <div
            v-for="error of validateSignUp.name.$errors"
            :key="error.$uid"
            class="text-red-500 text-sm mt-1"
        >
            {{ error.$message }}
        </div>
    </template>
</div>


                  <!-- Email -->
                  <div class="flex flex-col relative">
    <label for="email" class="dark:text-white text-gray-700 mb-2 text-sm">Email</label>
    
    <div class="relative">
        <img
            src="/src/assets/svgs/mail.svg"
            alt="Mail Icon"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        />

        <input
            id="email"
            type="email"
            name="email"
            v-model.trim="validateSignUp.email.$model"
            placeholder="Enter your email"
            class="w-full px-4 py-2 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            style="box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1), 10px 10px 20px rgba(0, 0, 0, 0.7);"
        />
    </div>
    
    <template v-if="validateSignUp.email.$error">
        <div
            v-for="error of validateSignUp.email.$errors"
            :key="error.$uid"
            class="text-red-500 text-sm mt-1"
        >
            {{ error.$message }}
        </div>
    </template>
</div>


                  <!-- Mobile No. -->
                  <div class="flex flex-col relative">
    <label for="mobile" class="dark:text-white text-gray-700 mb-2 text-sm">Mobile No.</label>
    
    <div class="relative">
        <img
            src="/src/assets/svgs/call.svg"
            alt="Call Icon"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        />

        <input

            id="mobile"
            type="tel"
            name="mobile"
            v-model.trim="validateSignUp.mobile.$model"
            placeholder="Enter your mobile number"
            class="w-full px-4 py-2 pl-12 rounded-2xl outline"
            style="
                box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1), 10px 10px 20px rgba(0, 0, 0, 0.7);
                outline: none;
                border: none;
            "
        />
    </div>
    
    <template v-if="validateSignUp.mobile.$error">
        <div
            v-for="error of validateSignUp.mobile.$errors"
            :key="error.$uid"
            class="text-red-500 text-sm mt-1"
        >
            {{ error.$message }}
        </div>
    </template>
</div>


                  <!-- Password and Confirm Password -->
                  <div class="flex flex-col">
                    <label for="password" class="dark:text-white text-gray-700 mb-2 ">Password</label>
                    <div class="relative">
                      <input
                        :type="passwordFields.password ? 'text' : 'password'"
                        id="password"
                        name="password"
                        v-model.trim="validateSignUp.password.$model"
                        placeholder="Enter your password"
                        class="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        style="box-shadow: 
            -5px -5px 15px rgba(255, 255, 255, 0.1), 
            10px 10px 20px rgba(0, 0, 0, 0.7);     
        ">
                      <span
                        @click="togglePasswordVisibility('password')"
                        class="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                      >
                        <EyeOffIcon v-if="passwordFields.password" class="w-5 dark:text-white text-gray-600" />
                        <EyeIcon v-else class="w-5 dark:text-white text-gray-600" />
                      </span>
                    </div>
                    <template v-if="validateSignUp.password.$error">
                      <div
                        v-for="error of validateSignUp.password.$errors"
                        :key="error.$uid"
                        class="text-red-500 text-sm mt-1"
                      >
                        {{ error.$message }}
                      </div>
                    </template>
                  </div>

                  <div class="flex flex-col">
                    <label for="confirm_password" class="dark:text-white text-gray-700 mb-2 text-sm">Confirm Password</label>
                    <div class="relative">
                      <input
                        :type="passwordFields.confirm_password ? 'text' : 'password'"
                        id="confirm_password"
                        name="confirm_password"
                        v-model.trim="validateSignUp.confirm_password.$model"
                        placeholder="Confirm your password"
                        class="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        style="box-shadow: 
            -5px -5px 15px rgba(255, 255, 255, 0.1), 
            10px 10px 20px rgba(0, 0, 0, 0.7);     
        ">
                      <span
                        @click="togglePasswordVisibility('confirm_password')"
                        class="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                      >
                        <EyeOffIcon v-if="passwordFields.confirm_password" class="w-5 dark:text-white text-gray-600" />
                        <EyeIcon v-else class="w-5 dark:text-white text-gray-600" />
                      </span>
                    </div>
                    <template v-if="passwordsMatch === false" class="text-red-500 text-sm mt-1">
                    <p class="text-red-500">  Password does not match with confirm password</p>
                    </template>
                  </div>
                </div>

                <!-- OTP Authentication -->
                <div v-if="otpAuthSignup" class="flex flex-col">
                  <label for="otp" class="dark:text-white text-gray-700 mb-2">Enter OTP</label>
                  <input
                    id="otp"
                    type="text"
                    name="otp"
                    v-model.trim="validateOtp.otp.$model"
                    placeholder="Enter your 6-digit OTP"
                    class="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <template v-if="validateOtp.otp.$errors">
                    <div
                      v-for="error of validateOtp.otp.$errors"
                      :key="error.$uid"
                      class="text-red-500 text-sm mt-1"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>

                <!-- T&C and Buttons -->
                <div class="flex justify-start mt-6">
                  <div class="flex items-center">
                    <input type="checkbox" id="T&C" v-model="checkbox" class="mr-2" />
                    <label for="T&C" class="dark:text-[#ADADAD] text-gray-700 whitespace-nowrap">
                      I agree to the&nbsp;
                      <a :href="tncUrl" target="_blank" class="text-white underline">T&C</a> and&nbsp;
                      <a :href="privacyPolicyUrl" target="_blank" class="text-white underline">Privacy Policy</a>
                    </label>
                  </div>
                </div>

                <!-- Submit Buttons -->
                <div class="flex flex-col items-center mt-6">
                  <button
                    v-if="!otpAuthSignup"
                    type="button"
                    @click="signUp"
                    :disabled="!checkbox || passwordsMatch === false"
                    class="w-full py-3 bg-[#30437C] text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Register
                  </button>

                  <button
                    v-if="otpAuthSignup"
                    type="submit"
                    :disabled="!validateOtp.otp.$dirty || validateOtp.otp.$error"
                    class="w-full py-3 bg-[#30437C] text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit OTP
                  </button>
                </div>

                <!-- Already Registered -->
                <div class="flex justify-center mt-6">
                  <p class="dark:text-white text-gray-600">
                    Already have an account?&nbsp;
                    <a href="/login" class="text-blue-600 underline">Login</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute right-4 top-6 flex text-white">
      <DarkModeSwicher :bgCircle="true" />
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, reactive, toRefs, onBeforeMount } from 'vue'
import { required, minLength, email, sameAs } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { storeToRefs } from 'pinia'
import { useLogoStore } from '@/stores/utils/logo'
import { makeRequest, state } from '@/request/request'
import router from '@/router/index'
import DarkModeSwicher from '@/components/darkModeSwicher.vue'
import logoComp from '../login/logoComp.vue'

// Store and component initialization
const logoStore = useLogoStore()
const { logoData } = storeToRefs(logoStore)

// Reactive variables
const error = ref<string>("")
const checkbox = ref<boolean>(false)
const otpAuthSignup = ref<boolean>(false)
const emailsignup = ref<string>('')
const tncUrl = ref<string>('')
const privacyPolicyUrl = ref<string>('')

// Password visibility control
const passwordFields = reactive<any>({
  password: false,
  confirm_password: false
})

// Function to toggle password visibility
function togglePasswordVisibility(field: string) {
  passwordFields[field] = !passwordFields[field];
}

// URL Handling
async function checkUrl(url: string, name: string) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    const contentType = response.headers.get("Content-Type")
    const contentLength = response.headers.get("Content-Length")

    if (contentType !== 'text/html' || !contentLength || parseInt(contentLength, 10) < 100) {
      if(name === "tnc") {
        tncUrl.value = '../../tnc.html' // Fallback URL
      } else if(name === "privacy_policy") {
        privacyPolicyUrl.value = '../../privacy_policy.html' // Fallback URL
      }
    }
  } catch {
    if(name === "tnc") {
      tncUrl.value = '../../tnc.html' // Fallback URL
    } else if(name === "privacy_policy") {
      privacyPolicyUrl.value = '../../privacy_policy.html' // Fallback URL
    }
  }
}

function extractDomain() {
  const hostname = new URL(window.location.href).hostname
  const domain = hostname.replace(/^www\./i, '')

  const domainParts = domain.split('.').slice(0, 2)
  const domainName = domainParts.join('_')

  tncUrl.value = `/images/tnc/${domainName}_tnc.html`
  privacyPolicyUrl.value = `/images/privacy_policy/${domainName}_privacy_policy.html`

  checkUrl(tncUrl.value, "tnc")
  checkUrl(privacyPolicyUrl.value, "privacy_policy")
}

onBeforeMount(() => {
  extractDomain()
})

// Vuelidate setup for OTP
const otpData = reactive({
  email: '',
  otp: ''
})

const otpRules = {
  email: { required },
  otp: { required, minLength: minLength(6) },
}

const validateOtp = useVuelidate(otpRules, toRefs(otpData))

// Vuelidate setup for Sign Up
const signUpData = reactive({
  name: '',
  email: '',
  mobile: '',
  password: '',
  confirm_password: '',
  isAgree: false,
  mobile_prefix: '+91'
})

const signUpRules = {
  name: { required },
  email: { required, email },
  mobile: { required },
  password: { required, minLength: minLength(6) },
  confirm_password: { 
    required,
    sameAs: sameAs(() => signUpData.password)
  }
}

const validateSignUp = useVuelidate(signUpRules, toRefs(signUpData))

// Password mismatch computed property
const passwordsMatch = computed(() => {
  return signUpData.password === signUpData.confirm_password
})

// Sign Up function
const signUp = async () => {
  try {
    validateSignUp.value.$touch()
    if (!validateSignUp.value.$invalid) {
      signUpData.mobile = `${signUpData.mobile}`
      signUpData.isAgree = checkbox.value
      const response = await makeRequest('register', 'POST', signUpData)
      if (response) {
        otpAuthSignup.value = true
        otpData.email = signUpData.email
        idForOtpVerify.value = response.data
        error.value = ""
      } else {
        error.value = state["register"].error.data.message
      }
    }
  } catch (err: any) {
    error.value = state["register"].error.message || err.message
  }
}

// OTP Verification function
const idForOtpVerify = ref<number>(0)

const verifyOtp = async () => {
  try {
    validateOtp.value.$touch()
    if (!validateOtp.value.$invalid) {
      const response = await makeRequest('verifyOTP', 'PUT', otpData, {}, {}, 0, idForOtpVerify.value)
      if (response) {
        error.value = ""
        router.push({ name: 'login' })
      } else {
        error.value = state["verifyOTP"].error.data.message
      }
    }
  } catch (err: any) {
    error.value = state["verifyOTP"].error.message || err.message
  }
}

const inputStyle = computed(() => ({
  boxShadow: '-5px -5px 15px rgba(255, 255, 255, 0.1), 10px 10px 20px rgba(0, 0, 0, 0.7)'
}))

// Get Domain
const getDomain = (url: string) => {
  const parsedUrl = new URL(url)
  const hostName = parsedUrl.hostname
  if (hostName !== 'localhost') {
    const splitedHost = hostName.split('.')
    imgName.value = `${splitedHost[1]}_${splitedHost[2]}`
  }
}

const imgName = ref<string>('')
const imgLoad = ref<boolean>(false)

function handleImageLoad() {
  imgLoad.value = true
}

function handleImageError(error: any) {
  imgLoad.value = false
}

// Handle Toggle for Login redirection
const handleToggle = () => {
  router.push({ name: 'login' })
}
</script>



<style scoped>
.dark .bg-primary {
  background-image: radial-gradient(rgba(0, 0, 0, 0) 1px, #000 1px);
  backdrop-filter: brightness(100%) blur(3px);
  background-size: 4px 4px;
}
.submit-btn button{
  backdrop-filter: none !important;
  background-image: none !important;
}

.custom-button {
  @apply w-full py-3 bg-[#30437C] text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed;
  box-shadow: 
    inset 0 2px 4px 0 rgba(255, 255, 255, 0.06),
    inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}


.input-box label {
@apply text-black font-bold;

}

.input-box input  {
@apply w-full px-2 py-1 box-border border border-gray-50 rounded focus:outline-1 focus:outline-gray-200;
}

select {
@apply w-full h-10  px-2 py-1 box-border border border-gray-50 rounded cursor-pointer focus:outline-1 focus:outline-gray-200;
}

.dark .input-box label {
@apply text-tableText
}

/* CSS for the animated background */
.animated-background {
  background-image: url('@/assets/img/back.webp');
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
  background-size: contain;
  
}
}
</style>


