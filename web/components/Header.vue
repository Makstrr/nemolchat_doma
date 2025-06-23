<template>
  <div class="relative">
    <header class="flex items-center justify-between p-4 z-20 bg-transparent relative">
      <!-- Лого + название -->
      <div class="flex items-center cursor-pointer" @click="goHome">
        <img src="@/assets/logo.png" alt="Логотип" class="h-12 mr-3" />
        <span class="text-black text-2xl font-semibold">nemolchat doma</span>
      </div>

      <!-- Навигация и кнопка «Вход» или аватар+меню -->
      <nav class="hidden md:flex items-center space-x-24">
        <router-link
          to="/analytics"
          class="nav-link"
          :class="{ active: isActive('/analytics') }"
        >Аналитика</router-link>

        <router-link
          to="/how-it-works"
          class="nav-link"
          :class="{ active: isActive('/how-it-works') }"
        >Как это работает?</router-link>

        <router-link
          to="/contacts"
          class="nav-link"
          :class="{ active: isActive('/contacts') }"
        >Контакты</router-link>

        <div v-if="showLoginButton">
          <button
            @click="goLogin"
            class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full"
          >
            вход
          </button>
        </div>

        <div v-else class="relative ml-4">
          <img
            v-if="isLoggedIn"
            src="@/assets/profile.png"
            alt="Профиль"
            class="h-12 w-12 rounded-full object-cover cursor-pointer"
            @click="onAvatarClick"
          />
          <transition name="dropdown">
            <div
              v-if="showMenu && isLoggedIn"
              ref="menuRef"
              class="absolute top-full mt-2 right-0 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-40"
            >
              <ul>
                <li>
                  <button @click="goToProfile" class="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Профиль
                  </button>
                </li>
                <li>
                  <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Выход
                  </button>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </nav>

      <!-- Мобильное бургер-меню -->
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden flex items-center justify-center p-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-md transition"
      >
        <svg
          v-if="!mobileMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- ВНЕ шапки: мобильное меню -->
    <transition name="fade">
      <div
        v-if="mobileMenuOpen"
        class="md:hidden fixed top-20 left-4 right-4 z-30 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl px-4 pt-4 pb-6 space-y-2"
      >
        <router-link
          to="/analytics"
          class="block text-base font-medium py-2 hover:text-teal-600"
          :class="{ 'text-teal-600 font-semibold': isActive('/analytics') }"
          @click="closeMobileMenu"
        >Аналитика</router-link>

        <router-link
          to="/how-it-works"
          class="block text-base font-medium py-2 hover:text-teal-600"
          :class="{ 'text-teal-600 font-semibold': isActive('/how-it-works') }"
          @click="closeMobileMenu"
        >Как это работает?</router-link>

        <router-link
          to="/contacts"
          class="block text-base font-medium py-2 hover:text-teal-600"
          :class="{ 'text-teal-600 font-semibold': isActive('/contacts') }"
          @click="closeMobileMenu"
        >Контакты</router-link>

        <div class="border-t border-gray-200 my-2"></div>

        <div v-if="showLoginButton">
          <button
            @click="goLogin"
            class="w-full bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 rounded-full transition"
          >
            вход
          </button>
        </div>
        <div v-else class="space-y-1">
          <button
            v-if="isLoggedIn"
            @click="goToProfile"
            class="w-full text-left text-black font-medium py-2 hover:text-teal-600"
          >
            Мой профиль
          </button>
          <button
            v-if="isLoggedIn"
            @click="logout"
            class="w-full text-left text-black font-medium py-2 hover:text-teal-600"
          >
            Выход
          </button>
          <button
            v-else
            @click="goLogin"
            class="w-full bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 rounded-full transition"
          >
            вход
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { onClickOutside } from "@vueuse/core"

const props = defineProps({
  showLoginButton: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const route = useRoute()

const goHome = () => router.push("/")

const mobileMenuOpen = ref(false)
const closeMobileMenu = () => (mobileMenuOpen.value = false)

const isLoggedIn = computed(() => !!localStorage.getItem("token"))

const goLogin = () => router.push(isLoggedIn.value ? "/analytics" : "/login")

const isActive = (path) => route.path === path

const showMenu = ref(false)
const menuRef = ref(null)
onClickOutside(menuRef, () => (showMenu.value = false))

const onAvatarClick = () => (showMenu.value = !showMenu.value)

const goToProfile = () => {
  showMenu.value = false
  router.push("/profile")
}
const logout = () => {
  localStorage.removeItem("token")
  showMenu.value = false
  router.push("/")
}
</script>

<style scoped>
.nav-link {
  font-weight: 500;
  color: #333;
  transition: color 0.3s;
  padding-bottom: 2px;
}
.nav-link:hover {
  color: #0d9488;
}
.nav-link.active {
  font-weight: 700;
  border-bottom: 2px solid #0d9488;
  color: #0d9488;
}

/* Анимация */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
