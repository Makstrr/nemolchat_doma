<template>
  <div class="flex flex-col min-h-screen bg-gray-100 relative overflow-hidden">
    <Header :showLoginButton="true" />


    <!Круглый градиент по центру левой части >
    <div
      class="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 opacity-30 blur-3xl z-0"
    ></div>

    <! Основной контент >
    <div class="flex flex-col md:flex-row flex-1 relative z-10">
      <!-- Левая часть -->
      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center items-start md:pl-20">
        <h1 class="text-3xl font-bold mb-4">Система анализа отзывов жильцов об управляющей компании</h1>
        <p class="text-lg text-gray-600 mb-8">
          Автоматический анализ отзывов жильцов из соцсетей, форумов и карт
        </p>
        <button
          @click="router.push('/registration')"
          class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full"
        >
          Регистрация
        </button>

      </div>

      <! Правая часть >
      <div class="w-full md:w-1/2 relative">
        <img src="@/assets/workspace.png" alt="Рабочее пространство" class="w-full h-full object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'

const router = useRouter()

</script>

<style scoped>
/* Дополнительные стили, если потребуются */
</style>

