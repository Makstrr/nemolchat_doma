<template>
  <div class="how-it-works" :class="{ narrow: isNarrow }">
    <Header />

    <div
      class="relative flex justify-center gap-x-99 w-full max-w-7xl z-10"
      :class="{ 'narrow-layout': isNarrow }"
    >
      <! Шаг 1 >
      <div
        class="info-box-wrapper"
        :style="getWrapperStyle(0)"
      >
        <div class="info-box">
          <div class="info-text">
            <span>Парсинг данных</span>
            <div class="info-icon" @click="toggleStep(1)">?</div>
          </div>
        </div>
        <transition name="expand">
          <div v-if="hoverStep === 1" class="bubble-wrapper">
            <div class="tooltip-bubble">
              Наш код заботливо собирает отзывы по названию УК и адресам на различных платформах, 
              например, Яндекс.Карты, VK, форумы.
              <br>
              Также мы можем добавить и ваши источники.
            </div>
          </div>
        </transition>
      </div>

      <! Шаг 2 >
      <div
        class="info-box-wrapper"
        :style="getWrapperStyle(1)"
      >
        <div class="info-box">
          <div class="info-text">
            <span>NLP-анализ</span>
            <div class="info-icon" @click="toggleStep(2)">?</div>
          </div>
        </div>
        <transition name="expand">
          <div v-if="hoverStep === 2" class="bubble-wrapper">
            <div class="tooltip-bubble">
              Нейросеть, заточенная специально под вопросы ЖКХ, определяет ключевые проблемы, тональность отзыва.
            </div>
          </div>
        </transition>
      </div>

      <! Шаг 3 >
      <div
        class="info-box-wrapper"
        :style="getWrapperStyle(2)"
      >
        <div class="info-box">
          <div class="info-text">
            <span>Формирование отчётов</span>
            <div class="info-icon" @click="toggleStep(3)">?</div>
          </div>
        </div>
        <transition name="expand">
          <div v-if="hoverStep === 3" class="bubble-wrapper">
            <div class="tooltip-bubble">
              С помощью кода все эти данные трансформируются в понятные графики в вашем личном кабинете.
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const hoverStep = ref(null)
const isNarrow = ref(false)

const checkAspectRatio = () => {
  isNarrow.value = window.innerWidth / window.innerHeight < 16 / 9
}

onMounted(() => {
  checkAspectRatio()
  window.addEventListener('resize', checkAspectRatio)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkAspectRatio)
})

const toggleStep = (step) => {
  hoverStep.value = hoverStep.value === step ? null : step
}

const getWrapperStyle = (index) => {
  if (isNarrow.value) return {}
  const positions = [
    { top: '150px', left: '200px', position: 'relative' },
    { top: '345px', left: '381px' },
    { top: '550px', left: '550px', position: 'relative' }
  ]
  return positions[index]
}
</script>

<style scoped>
.how-it-works {
  min-height: 100vh;
  background: url('@/assets/background_HItW.png') center center / cover no-repeat;
  position: relative;
  transition: background 0.3s ease;
}

.info-box-wrapper {
  position: relative;
  max-width: 400px;
  width: 100%;
  transition: margin-bottom 0.4s ease;
}

.info-box {
  background: linear-gradient(to right, #c2e9f7, #a1c4fd);
  color: #003f5c;
  padding: 1.8rem 2.2rem;
  border-radius: 50px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: left;
  position: relative;
}

.info-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-text span {
  font-size: 1.25rem;
  font-weight: 600;
  padding-left: 0.5rem;
  line-height: 1.4;
}

.info-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid white;
  color: white;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.tooltip-bubble {
  background-color: rgba(255, 255, 255, 0.95);
  border: 2px solid #a0e0eb;
  border-radius: 1rem;
  padding: 1rem;
  color: #225e65;
  font-size: 0.95rem;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  z-index: 20;
  width: 100%;
  transition: all 0.3s ease;
  margin-top: 14px; /* 👈 отступ для больших экранов */
}

.bubble-wrapper {
  overflow: hidden;
}

.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.4s ease, opacity 0.4s ease;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 📱 Адаптация для экранов уже чем 16:9 */
@media screen and (max-aspect-ratio: 16/9) {
  .how-it-works.narrow {
    background: linear-gradient(to top, #a0e0eb, #ffffff 50%) !important;
    padding: 2rem 1rem;
  }

  .how-it-works.narrow .narrow-layout {
    flex-direction: column !important;
    align-items: center !important;
    gap: 2rem;
    margin-top: 60px;
  }

  .how-it-works.narrow .info-box-wrapper {
    top: auto !important;
    left: auto !important;
    width: 100%;
    max-width: 420px;
  }

  .how-it-works.narrow .tooltip-bubble {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    margin-top: 1rem;
  }
}
</style>
