<template>
  <div class="contacts">
    <Header />
    <! Контент >
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-20">
      <div class="space-y-6 max-w-xl">
        <h1 class="text-3xl font-bold">Появился вопрос или возникла проблема?</h1>
        <h2 class="text-3xl font-bold">Наши контакты:</h2>
        <p class="text-lg">email: support.nemolchatdoma@gmail.com</p>
        <p class="text-lg">telegram: @nemolchatdoma_supportbot</p>
      </div>

      <! Картинка QR-кода >     
      <div class="flex justify-center items-center w-full md:w-1/2 mt-12 md:mt-0">
        <img src="@/assets/qr-code.png" alt="QR-код" class="w-80 h-80 object-contain" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => router.push('/')
</script>

<style scoped>
.contacts {
  min-height: 100vh;
  background: linear-gradient(to top, #e0f7fa, white 50%);
  padding: 0 2rem 2rem 2rem;

}

.nav-link {
  font-weight: 500;
  color: #333;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #0d9488; /* бирюзовый */
}

.nav-link.active {
  font-weight: 700;
  border-bottom: 2px solid #0d9488;
  color: #0d9488;
}
</style>
