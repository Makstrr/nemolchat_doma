<template>
  <div class="analytics-page min-h-screen bg-gradient-to-t from-[#e0f7fa] to-white overflow-x-hidden">
    <Header />

    <div class="mx-auto px-0 pt-6 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-14 items-start">
        <! Левая часть >
        <div class="space-y-6 w-full">
          <! Поисковая панель >
          <div class="relative bg-white rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between search-panel">
            <!-- Первая строка: адрес и фильтры -->
            <div class="flex flex-col sm:flex-row gap-2 w-full filters-section">
              <!-- Выбор адреса -->
              <div class="flex-1 relative">
                <input
                  v-model="selectedAddress"
                  @click="toggleAddressDropdown"
                  readonly
                  placeholder="Выберите адрес"
                  class="w-full px-4 py-2 border border-[#C7F5F9] rounded-full focus:outline-none focus:ring-2 focus:ring-teal-200 cursor-pointer"
                />
                <transition name="fade">
                  <ul
                    v-if="showAddressDropdown"
                    ref="addressDropdownRef"
                    class="absolute z-30 mt-2 w-full bg-white border border-[#C7F5F9] rounded-lg shadow-md max-h-48 overflow-auto"
                  >
                    <li @click="clearAddress" class="px-4 py-2 hover:bg-teal-50 cursor-pointer text-gray-500">
                      Сбросить выбор
                    </li>
                    <li
                      v-for="(addr, idx) in addresses"
                      :key="idx"
                      @click="selectAddress(addr)"
                      class="px-4 py-2 hover:bg-teal-50 cursor-pointer"
                    >
                      {{ addr }}
                    </li>
                  </ul>
                </transition>
              </div>

              <! Кнопка фильтров >
              <div class="relative">
                <button @click="toggleFiltersDropdown" class="focus:outline-none">
                  <svg
                    class="w-8 h-8 text-teal-400"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M16 24 L8 12 L24 12 Z" />
                  </svg>
                </button>
                <transition name="fade">
                  <div
                    v-if="showFiltersDropdown"
                    ref="filtersDropdownRef"
                    class="absolute top-full mt-2 left-0 w-60 bg-white bg-opacity-90 border border-teal-200 rounded-lg shadow-md z-30"
                  >
                    <div class="p-4">
                      <h3 class="font-semibold mb-2">Фильтры по услугам:</h3>
                      <div class="space-y-2 h-48 overflow-auto">
                        <label
                          v-for="(filter, idx) in filters"
                          :key="idx"
                          class="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            :value="filter"
                            v-model="selectedFilters"
                            class="h-4 w-4 text-teal-400 border border-teal-200 rounded-full focus:ring-0"
                          />
                          <span class="text-gray-700">{{ filter }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>

            <! Вторая строка: период и кнопка Поиск >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 w-full mt-1">
              <!-- Выбор периода -->
              <div class="w-full sm:w-auto">
                <select
                  v-model="selectedPeriod"
                  class="w-full sm:w-56 px-4 py-2 border border-[#C7F5F9] rounded-full focus:outline-none focus:ring-2 focus:ring-teal-200 cursor-pointer"
                >
                  <option value="all">За всё время</option>
                  <option value="30">Последние 30 дней</option>
                  <option value="14">Последние 14 дней</option>
                  <option value="7">Последние 7 дней</option>
                </select>
              </div>

              <! Кнопка Поиск >
              <button
                @click="onSearchClick"
                :disabled="(!selectedAddress && selectedFilters.length === 0) || loadingAnalytics"
                class="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Поиск
              </button>
            </div>
          </div>

          <! Показ выбранных фильтров (только после «Поиск») >
          <div v-if="showAnalytics && analyticsFilters.length" class="mb-4">
            <span class="font-medium text-gray-700">Выбранные фильтры:</span>
            <ul class="inline-flex space-x-3 mt-2 flex-wrap">
              <li
                v-for="(flt, idx) in analyticsFilters"
                :key="idx"
                class="bg-teal-200 text-teal-800 px-3 py-1 rounded-full text-sm"
              >
                {{ flt }}
              </li>
            </ul>
          </div>

          <! Статистика по адресу и фильтрам >
          <div v-if="showAnalytics" class="space-y-6">
            <template v-if="analyticsAddress">
              <template v-if="mockData.addresses[analyticsAddress]?.[getCurrentPeriodKey()]">
                <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                  <h3 class="text-lg font-medium">{{ analyticsAddress }} — Удовлетворённость услугами</h3>
                  <div class="relative w-full h-64">
                    <canvas id="addressPieChart" class="absolute inset-0 w-full h-full"></canvas>
                  </div>
                </div>
                <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                  <h3 class="text-lg font-medium">{{ analyticsAddress }} — Топ-5 жалоб</h3>
                  <div class="relative w-full h-64">
                    <canvas id="addressBarChart" class="absolute inset-0 w-full h-full"></canvas>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="bg-white rounded-2xl shadow p-6 text-gray-600 text-center">
                  Данные по этому адресу за выбранный период отсутствуют.
                </div>
              </template>
            </template>

            <template v-for="(flt, idx) in analyticsFilters" :key="idx">
              <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                <h3 class="text-lg font-medium">{{ flt }} — Статистика</h3>
                <div v-if="mockData.filters[analyticsAddress]?.[getCurrentPeriodKey()]?.[flt]" class="relative w-full h-64">
                  <canvas :id="`filterChart${idx}`" class="absolute inset-0 w-full h-full"></canvas>
                </div>
                <div v-else class="text-gray-600 text-center py-10">
                  Данные по фильтру за выбранный период отсутствуют.
                </div>
              </div>
            </template>
          </div>
        </div>


        <! ПРАВАЯ ЧАСТЬ: Общая аналитика компании (всегда видна) >
        <div v-if="hasCompanyData" class="space-y-6 w-full lg:pl-8">
          <h2 class="text-2xl font-semibold mb-2 text-center sm:text-left">Общая аналитика компании:</h2>

          <!-- Первая строка карточек -->
          <div class="flex flex-wrap gap-6">
            <!-- Карточка: Удовлетворённость услугами -->
            <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4 w-full max-w-xl mx-auto">
              <h3 class="text-lg font-medium">Удовлетворённость услугами</h3>
              <div class="relative w-full h-64">
                <canvas id="companyPieChart" class="absolute inset-0 w-full h-full"></canvas>
              </div>
              <ul class="mt-4 space-y-1 text-gray-700">
                <li class="flex items-center space-x-2">
                  <span class="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
                  <span>Положительные — 15 %</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="inline-block w-3 h-3 bg-yellow-300 rounded-full"></span>
                  <span>Нейтральные — 23 %</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="inline-block w-3 h-3 bg-red-300 rounded-full"></span>
                  <span>Негативные — 62 %</span>
                </li>
              </ul>
            </div>

            <! Карточка: Топ-5 жалоб компании >
            <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4 w-full max-w-xl mx-auto">
              <h3 class="text-lg font-medium">Топ-5 жалоб</h3>
              <div class="relative w-full h-64">
                <canvas id="companyBarChart" class="absolute inset-0 w-full h-full"></canvas>
              </div>
            </div>
          </div>

          <!-- Вторая строка карточек -->
          <div class="flex flex-wrap gap-6">
            <!-- Карточка: Топ-5 жалоб в других УК -->
            <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4 w-full max-w-xl mx-auto">
              <h3 class="text-lg font-medium">Топ-5 жалоб в других УК</h3>
              <div class="relative w-full h-64">
                <canvas id="otherUkBarChart" class="absolute inset-0 w-full h-full"></canvas>
              </div>
            </div>

            <!-- Карточка: Соотношение жалоб по адресам -->
            <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4 w-full max-w-xl mx-auto">
              <h3 class="text-lg font-medium">Соотношение жалоб по адресам</h3>
              <div class="relative w-full h-64">
                <canvas id="companyAddressPieChart" class="absolute inset-0 w-full h/full"></canvas>
              </div>
              <ul class="mt-4 space-y-1 text-gray-700">
                <li class="flex items-center space-x-2">
                  <span class="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
                  <span>ул. Ленина 27, Екатеринбург — 12%</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="inline-block w-3 h-3 bg-red-300 rounded-full"></span>
                  <span>пр-кт Космонавтов 108, Екатеринбург — 37%</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="inline-block w-3 h-3 bg-orange-300 rounded-full"></span>
                  <span>ул. Уральских Рабочих 46, Екатеринбург — 16%</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="inline-block w-3 h-3 bg-blue-400 rounded-full"></span>
                  <span>ул. Комсомольская 99, Екатеринбург — 15%</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="inline-block w-3 h-3 bg-orange-500 rounded-full"></span>
                  <span>ул. Уральская 78, Екатеринбург — 21 %</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from "vue"
import { useRouter } from "vue-router"
import { auth, db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { onClickOutside } from "@vueuse/core"
import Chart from "chart.js/auto"
import Header from "@/components/Header.vue"

const router = useRouter()
const user = ref(null)
const initializing = ref(true)

// ЛОГИНЫ
const allowedEmails = [
  "email@gmail.com",
  "gmail@gmail.com"
]

const hasCompanyData = ref(false)

onAuthStateChanged(auth, (u) => {
  if (u) { 
    user.value = u
    hasCompanyData.value = allowedEmails.includes(u.email)
  } else {
    user.value = null
    hasCompanyData.value = false
    router.push("/login")
  }
  initializing.value = false
})

const addresses = ref([])
const selectedAddress = ref("")
const selectedPeriod = ref("all")
const showAddressDropdown = ref(false)
const allFilters = computed(() => {
  const addr = selectedAddress.value
  const period = getCurrentPeriodKey()
  if (!addr || !mockData.addresses[addr]?.[period]) return []
  return mockData.addresses[addr][period].top || []
})
const filters = ref([])
const selectedFilters = ref([])
const showFiltersDropdown = ref(false)
const showAnalytics = ref(false)
const loadingAnalytics = ref(false)

const analyticsAddress = ref("")
const analyticsFilters = ref([])

watch([selectedAddress, selectedPeriod], () => {
  filters.value = allFilters.value
  selectedFilters.value = []
})


const mockData = {
  addresses: {
    "ул. Ленина 27, Екатеринбург  ": {
      all: { tone: [19, 21, 77], 
             top: ["Неисправный домофон", "Плохое освещение у подъезда", "Неубранный снег", "Протечки", "Грубый консьерж"],
             topValues: [36, 18, 12, 8, 6] },
      30: { tone: [6, 8, 10], 
            top: ["Неисправный домофон", "Неподстриженный газон"],
            topValues: [9, 1] },
      14: { tone: [1, 3, 6], 
            top: ["Грубый консьерж"],
            topValues: [6] },
      7: null
    },
    "пр-кт Космонавтов 108, Екатеринбург  ": {
      all: { tone: [60, 90, 180], 
             top: ["Горячее водоснабжение", "Грязь в подъезде", "Отопление", "Электричество", "Сломанный лифт"],
             topValues: [68, 54, 59, 32, 24 ] },
      30: { tone: [20, 30, 95], 
            top: ["Горячее водоснабжение", "Грязь в подъезде", "Протечки", "Электричество", "Сломанный лифт"],
            topValues: [48, 40, 22, 15, 12] },
      14: { tone: [7, 18, 35],
            top: ["Горячее водоснабжение", "Грязь в подъезде", "Электричество"],
            topValues: [5, 14, 19] },
      7: { tone: [3, 1, 5], 
           top: ["Вентиляция"],
           topValues: [5] }
    },
    "ул. Уральских Рабочих 46, Екатеринбург  ": {
      all: { tone: [16, 30, 102],
             top: ["Сломанный лифт", "Грязь в подъезде", "Запах мусора", "Разбитый асфальт", "Отсутствие освещения во дворе"],
             topValues: [52, 15, 12, 8, 15] },
      30: { tone: [6, 12, 35],
            top: ["Сломанный лифт", "Грязь в подъезде", "Запах мусора", "Отсутствие освещения во дворе", "Разбитый асфальт"],
            topValues: [20, 6, 4, 3, 5] },
      14: { tone: [2, 5, 14],
            top: ["Сломанный лифт", "Грязь в подъезде", "Запах мусора"],
            topValues: [8, 3, 2] },
      7: { tone: [1, 2, 7],
            top: ["Сломанный лифт", "Грязь в подъезде"],
            topValues: [5, 2] },
    },
    "ул. Комсомольская 99, Екатеринбург  ": {
      all: {
        tone: [28, 32, 95],
        top: [
          "Слабый напор воды",
          "Грязный лифт",
          "Неубранный снег",
          "Запах канализации",
          "Ржавчина в воде"
        ],
        topValues: [41, 20, 16, 12, 6]
      },
      30: {
        tone: [4, 8, 20],
        top: [
          "Грязный лифт",
          "Ржавчина в воде",
          "Слабый напор воды",
          "Запах канализации"
        ],
        topValues: [7, 6, 4, 3]
      },
      14: {
        tone: [2, 7, 6],
        top: [
          "Грязный лифт",
          "Слабый напор воды",
          "Запах канализации"
        ],
        topValues: [3, 2, 2]
      },
      7: {
        tone: [0, 4, 3],
        top: [
          "Грязный лифт",
          "Слабый напор воды"
        ],
        topValues: [2, 1]},
    },
    "ул. Уральская 78, Екатеринбург  ": {
      all: {
        tone: [22, 40, 120],
        top: [
          "Шумные соседи",
          "Грязь в подъезде",
          "Отопление",
          "Неубранный мусор",
          "Не работает домофон"
        ],
        topValues: [38, 30, 25, 22, 18]
      },
      30: {
        tone: [8, 14, 45],
        top: [
          "Грязь в подъезде",
          "Отопление",
          "Не работает домофон",
          "Шумные соседи",
          "Неубранный мусор"
        ],
        topValues: [10, 8, 7, 6, 5]
      },
      14: {
        tone: [3, 5, 18],
        top: [
          "Грязь в подъезде",
          "Отопление",
          "Не работает домофон"
        ],
        topValues: [5, 4, 3]
      },
      7: {
        tone: [1, 2, 10],
        top: [
          "Грязь в подъезде",
          "Отопление"
        ],
        topValues: [3, 2]},
    }
  },
  filters: {
    "ул. Ленина 27, Екатеринбург  ": {
      all: {
        "Неисправный домофон": [1, 3, 5],
        "Плохое освещение у подъезда": [1, 1, 2],
        "Неубранный снег": [1, 1, 1],
        "Протечки": [0, 2, 2],
        "Грубый консьерж": [0, 1, 3]
      },
      30: {
        "Неисправный домофон": [0, 1, 2],
        "Неподстриженный газон": [0, 1, 0]
      },
      14: {
        "Грубый консьерж": [0, 1, 2]
      }
    },
    "пр-кт Космонавтов 108, Екатеринбург  ": {
      all: {
        "Горячее водоснабжение": [8, 5, 30],
        "Грязь в подъезде": [0, 25, 14],
        "Отопление": [6, 20, 27],
        "Электричество": [8, 10, 14],
        "Сломанный лифт": [3, 7, 12]
      },
      30: {
        "Горячее водоснабжение": [3, 15, 23],
        "Грязь в подъезде": [0, 10, 22],
        "Протечки": [4, 6, 9],
        "Электричество": [3, 5, 7],
        "Сломанный лифт": [2, 3, 7]
      },
      14: {
        "Горячее водоснабжение": [0, 2, 3],
        "Грязь в подъезде": [0, 6, 6],
        "Электричество": [0, 4, 7]
      },
      7: {
        "Вентиляция": [1, 2, 2]
      }
    },
    "ул. Уральских Рабочих 46, Екатеринбург  ": {
      all: {
        "Сломанный лифт": [1, 18, 24],
        "Грязь в подъезде": [0, 7, 3],
        "Запах мусора": [0, 6, 3],
        "Разбитый асфальт": [1, 3, 3],
        "Отсутствие освещения во дворе": [2, 5, 8]
      },
      30: {
        "Сломанный лифт": [0, 3, 7],
        "Грязь в подъезде": [1, 2, 4],
        "Запах мусора": [0, 2, 5],
        "Разбитый асфальт": [1, 2, 4],
        "Отсутствие освещения во дворе": [0, 1, 2]
      },
      14: {
        "Сломанный лифт": [0, 3, 3],
        "Грязь в подъезде": [1, 1, 5],
        "Запах мусора": [0, 1, 5]
      },
      7: {
        "Сломанный лифт": [0, 1, 3],
        "Грязь в подъезде": [0, 1, 1]
      }
    },
    "ул. Комсомольская 99, Екатеринбург  ": {
      all: {
        "Слабый напор воды": [0, 12, 19],
        "Грязный лифт": [0, 6, 10],
        "Неубранный снег": [0, 5, 9],
        "Запах канализации": [0, 3, 6],
        "Ржавчина в воде": [1, 2, 3]
      },
      30: {
        "Грязный лифт": [0, 3, 2],
        "Ржавчина в воде": [1, 2, 3],
        "Слабый напор воды": [0, 1, 2],
        "Запах канализации": [0, 1, 2]
      },
      14: {
        "Грязный лифт": [1, 1, 1],
        "Слабый напор воды": [0, 1, 1],
        "Запах канализации": [0, 1, 1]
      },
      7: {
        "Грязный лифт": [0, 1, 1],
        "Слабый напор воды": [0, 0, 1]
      }
    },
    "ул. Уральская 78, Екатеринбург  ": {
      all: {
        "Шумные соседи": [0, 10, 23],
        "Грязь в подъезде": [0, 8, 18],
        "Отопление": [2, 6, 16],
        "Неубранный мусор": [1, 6, 14],
        "Не работает домофон": [1, 5, 12]
      },
      30: {
        "Грязь в подъезде": [0, 4, 4],
        "Отопление": [1, 3, 4],
        "Не работает домофон": [1, 2, 4],
        "Шумные соседи": [1, 2, 6],
        "Неубранный мусор": [0, 1, 3]
      },
      14: {
        "Грязь в подъезде": [0, 2, 2],
        "Отопление": [0, 1, 2],
        "Не работает домофон": [0, 1, 2]
      },
      7: {
        "Грязь в подъезде": [0, 1, 2],
        "Отопление": [0, 1, 1]
      }
    }
  }
}

const addressDropdownRef = ref(null)
const filtersDropdownRef = ref(null)
onClickOutside(addressDropdownRef, () => showAddressDropdown.value = false)
onClickOutside(filtersDropdownRef, () => showFiltersDropdown.value = false)

onMounted(async () => {
  while (initializing.value) await new Promise(r => setTimeout(r, 50))
  if (!user.value) return
  try {
    const docRef = doc(db, "users", user.value.uid)
    const snap = await getDoc(docRef)
    addresses.value = snap.exists() ? snap.data().addresses || [] : []
  } catch (err) {
    console.error("Ошибка при загрузке адресов:", err)
  }
  renderCompanyCharts()
})

const onSearchClick = async () => {
  if (!selectedAddress.value && selectedFilters.value.length === 0) return
  loadingAnalytics.value = true
  showAnalytics.value = false
  await nextTick()
  analyticsAddress.value = selectedAddress.value
  analyticsFilters.value = [...selectedFilters.value]
  showAnalytics.value = true
  setTimeout(() => {
    renderAddressCharts()
    renderFilterCharts()
    loadingAnalytics.value = false
  }, 100)
}

const toggleAddressDropdown = () => {
  showAddressDropdown.value = !showAddressDropdown.value
  showFiltersDropdown.value = false
}
const toggleFiltersDropdown = () => {
  showFiltersDropdown.value = !showFiltersDropdown.value
  showAddressDropdown.value = false
}
const selectAddress = (addr) => {
  selectedAddress.value = addr
  showAddressDropdown.value = false
}
const clearAddress = () => {
  selectedAddress.value = ""
  showAnalytics.value = false
  showAddressDropdown.value = false
}

const getCurrentPeriodKey = () => selectedPeriod.value === "all" ? "all" : Number(selectedPeriod.value)

async function renderAddressCharts() {
  await nextTick()
  const addr = analyticsAddress.value
  const periodKey = getCurrentPeriodKey()
  const addrData = mockData.addresses[addr]?.[periodKey] ?? null
  const pieEl = document.getElementById("addressPieChart")
  const barEl = document.getElementById("addressBarChart")
  if (!addrData) {
    pieEl?.getContext("2d")?.clearRect(0, 0, pieEl.width, pieEl.height)
    barEl?.getContext("2d")?.clearRect(0, 0, barEl.width, barEl.height)
    return
  }
  new Chart(pieEl.getContext("2d"), {
    type: "pie",
    data: {
      labels: ["Положительные", "Нейтральные", "Негативные"],
      datasets: [{ data: addrData.tone, backgroundColor: ["#4ade80", "#facc15", "#fca5a5"] }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
  })
  new Chart(barEl.getContext("2d"), {
    type: "bar",
    data: {
      labels: addrData.top.length ? addrData.top : ["Нет данных"],
      datasets: [{ label: "Жалобы", data: addrData.topValues ?? addrData.top.map(() => 0), backgroundColor: "#c084fc" }]
    },
    options: {
      indexAxis: "y", responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  })
}

async function renderFilterCharts() {
  await nextTick()
  const addr = analyticsAddress.value
  const periodKey = getCurrentPeriodKey()
  for (let idx = 0; idx < analyticsFilters.value.length; idx++) {
    const flt = analyticsFilters.value[idx]
    const data = mockData.filters[addr]?.[periodKey]?.[flt] ?? null
    const el = document.getElementById(`filterChart${idx}`)
    if (!data || !el) continue
    new Chart(el.getContext("2d"), {
      type: "pie",
      data: {
        labels: ["Позитивно", "Нейтрально", "Негативно"],
        datasets: [{ data, backgroundColor: ["#34d399", "#fde047", "#f87171"] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
    })
  }
}


function renderCompanyCharts() {
  const pieEl = document.getElementById("companyPieChart")
  const barEl = document.getElementById("companyBarChart")
  const otherBarEl = document.getElementById("otherUkBarChart")
  const addrPieEl = document.getElementById("companyAddressPieChart")

  if (pieEl) new Chart(pieEl.getContext("2d"), {
    type: "pie",
    data: { labels: ["Положительные", "Нейтральные", "Негативные"], datasets: [{ data: [145, 213, 574], backgroundColor: ["#4ade80", "#facc15", "#fca5a5"] }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
  })

  if (barEl) new Chart(barEl.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Грязь в подъезде", "Отопление", "Сломанный лифт", "Горячее водоснабжение", "Cлабый напор воды"],
      datasets: [{ label: "Процент жалоб", data: [27, 23, 21, 18, 11], backgroundColor: "#fca5a5" }]
    },
    options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  })

  if (otherBarEl) new Chart(otherBarEl.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Горячее водоснабжение", "Система мусороотведения", "Холодное водоснабжение", "Теплоснабжение", "Наружное освещение"],
      datasets: [{ label: "Процент жалоб", data: [45, 20, 5, 3, 1], backgroundColor: "#7dd3fc" }]
    },
    options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  })

  if (addrPieEl) new Chart(addrPieEl.getContext("2d"), {
    type: "pie",
    data: {
      labels: ["ул. Ленина 27", "пр-кт Космонавтов 108", "ул. Уральских Рабочих 46", "ул. Комсомольская 99", "ул. Уральская 78"],
      datasets: [{ data: [80, 237, 102, 95, 133], backgroundColor: ["#4ade80", "#fea5a5", "#ffa555", "#60a5fa", "#FFA500" ] }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
  })
}
</script>


<style scoped>
/* Плавное появление/исчезание dropdown-ов */
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

</style>
