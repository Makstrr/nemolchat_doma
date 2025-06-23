<template>
  <div class="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
    <!-- Header -->
    <header class="absolute top-0 left-0 w-full flex items-center p-4 z-20">
      <router-link to="/" class="flex items-center space-x-2">
        <img src="@/assets/logo.png" alt="Логотип" class="h-8" />
        <span class="text-black text-lg font-semibold">nemolchat doma</span>
      </router-link>
    </header>

    <! Градиенты (фоновые круги) >
    <div
      class="absolute w-[500px] h-[500px] bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full blur-3xl opacity-30 left-[-150px] bottom-[-150px] z-0"
    ></div>
    <div
      class="absolute w-[500px] h-[500px] bg-gradient-to-bl from-teal-400 to-cyan-400 rounded-full blur-3xl opacity-30 right-[-150px] top-[-150px] z-0"
    ></div>

    <! Контейнер формы >
    <transition name="fade-slide" appear>
      <div class="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md z-10 relative">
        <!-- Всплывающее уведомление об успехе или ошибке -->
        <transition name="fade">
          <div
            v-if="showSuccess"
            class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg shadow
                   text-center whitespace-nowrap"
          >
            {{ successMessage }}
          </div>
        </transition>
        <transition name="fade">
          <div
            v-if="showError"
            class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-lg shadow"
          >
            {{ error }}
          </div>
        </transition>

        <h1 class="text-3xl font-bold text-center mb-6">Регистрация</h1>

        <form @submit.prevent="register" class="space-y-4">
          <! Email >
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            required
          />

          <! Название организации (дополнительно)>
          <input
            v-model="orgName"
            type="text"
            placeholder="Название организации"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
          />

          <! ОГРН (дополнительно) >
          <input
            v-model="ogrn"
            type="text"
            placeholder="ОГРН"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
          />

          <! Пароль >
          <input
            v-model="password"
            type="password"
            placeholder="Пароль"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            required
          />

          <! Повтор пароля >
          <input
            v-model="repeatPassword"
            type="password"
            placeholder="Повторите пароль"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            required
          />

          <! Кнопка регистрации >
          <button
            type="submit"
            class="w-full bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
          >
            Зарегистрироваться
          </button>
        </form>

        <! Ссылка на вход >
        <router-link to="/login" class="text-teal-500 hover:underline block text-center mt-4">
          Уже есть аккаунт?
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { auth, db } from "@/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

const router = useRouter()
const email = ref("")
const password = ref("")
const repeatPassword = ref("")
const orgName = ref("")
const ogrn = ref("")
const error = ref("")
const showError = ref(false)
const successMessage = ref("")
const showSuccess = ref(false)

const register = async () => {
  showError.value = false
  showSuccess.value = false
  error.value = ""

  if (password.value !== repeatPassword.value) {
    error.value = "Пароли не совпадают"
    showError.value = true
    // Скрыть уведомление через 3 секунды
    setTimeout(() => {
      showError.value = false
    }, 3000)
    return
  }

  try {
    // 1. Регистрируем пользователя в Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    )
    const uid = userCredential.user.uid

    // 2. Создаём документ в Firestore с дополнительными данными
    await setDoc(doc(db, "users", uid), {
      email: email.value.trim(),
      orgName: orgName.value.trim(),
      ogrn: ogrn.value.trim(),
      createdAt: serverTimestamp()
    })

    // 3. Показываем уведомление об успешной регистрации
    successMessage.value = "Регистрация прошла успешно!"
    showSuccess.value = true

    // 4. Сохраняем токен и после небольшой задержки переходим на страницу аналитики
    const token = await userCredential.user.getIdToken()
    localStorage.setItem("token", token)

    // Оставляем время на просмотр уведомления (1.5 секунды), затем переходим
    setTimeout(() => {
      showSuccess.value = false
      router.push("/analytics")
    }, 1500)
  } catch (err) {
    // Отображаем сообщение об ошибке с анимацией
    error.value = err.message
    showError.value = true
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
