<template>
  <div class="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
    <! Header >
    <header class="absolute top-0 left-0 w-full flex items-center p-4 z-20">
      <router-link to="/" class="flex items-center space-x-2">
        <img src="@/assets/logo.png" alt="Логотип" class="h-8" />
        <span class="text-black text-lg font-semibold">nemolchat doma</span>
      </router-link>
    </header>

    <! Градиенты >
    <div
      class="absolute w-[500px] h-[500px] bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full blur-3xl opacity-30 left-[-150px] bottom-[-150px] z-0"
    ></div>
    <div
      class="absolute w-[500px] h-[500px] bg-gradient-to-bl from-teal-400 to-cyan-400 rounded-full blur-3xl opacity-30 right-[-150px] top-[-150px] z-0"
    ></div>

    <! Контейнер формы >
    <transition name="fade-slide" appear>
      <div class="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <!-- Всплывающие уведомления -->
        <transition name="fade">
          <div
            v-if="showSuccess"
            class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg shadow"
          >
            {{ successMessage }}
          </div>
        </transition>
        <transition name="fade">
          <div
            v-if="showError"
            class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-lg shadow
                   text-center whitespace-nowrap"
          >
            {{ error }}
          </div>
        </transition>

        <h1 class="text-3xl font-bold text-center mb-6">Вход в личный кабинет</h1>
        <form class="space-y-4" @submit.prevent="login">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            required
          />
          <input
            v-model="password"
            type="password"
            placeholder="Пароль"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            required
          />
          <button
            type="submit"
            class="w-full bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Войти
          </button>
        </form>
        <p class="text-center text-sm mt-4">
          Нет аккаунта?
          <router-link to="/registration" class="text-teal-600 hover:underline font-medium"
            >Зарегистрироваться</router-link
          >
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { auth } from "@/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

const router = useRouter()
const route = useRoute()

const email = ref("")
const password = ref("")

const error = ref("")
const showError = ref(false)

const successMessage = ref("")
const showSuccess = ref(false)

const login = async () => {
  showError.value = false
  showSuccess.value = false
  error.value = ""

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    )
    const token = await userCredential.user.getIdToken()
    localStorage.setItem("token", token)

    // Уведомление об успешном входе
    successMessage.value = "Вход выполнен успешно!"
    showSuccess.value = true

    const redirectTo = route.query.redirect || "/analytics"
    setTimeout(() => {
      showSuccess.value = false
      router.push(redirectTo)
    }, 1500)
  } catch (err) {
    // При ошибке покажем текст и установим showError = true
    error.value = "Неверный email или пароль"
    showError.value = true

    // Скрыть уведомление через 3 секунды
    setTimeout(() => {
      showError.value = false
    }, 3000)
  }
}
</script>


<style scoped>
.fade-slide-enter-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Плавное появление/исчезание уведомлений */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
