<template>
  <div class="profile-page min-h-screen bg-gradient-to-t from-[#e0f7fa] to-white overflow-x-hidden">
    <! Общий Header >
    <Header />
    <! Основной контейнер >
    <div class="mx-auto px-4 pt-6 max-w-7xl">
      <div class="flex flex-col lg:flex-row gap-8">
        <! Левая карточка: обслуживаемые адреса >
        <div
          class="bg-white rounded-2xl shadow-lg p-6 flex-1 lg:w-2/3 overflow-visible"
        >
          <h2 class="text-xl font-semibold mb-4">Обслуживаемые адреса:</h2>

          <! Кнопки “Редактировать”, “Загрузить список”, “Сохранить адреса” >
          <div class="flex flex-wrap gap-4 mb-4">
            <!-- Редактировать/Отменить -->
            <button
              @click="toggleEdit"
              :disabled="saving"
              class="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isEditing ? "Отменить" : "Редактировать" }}
            </button>

            <! Загрузить список из Excel >
            <div>
              <label
                :class="[
                  'inline-flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-full transition',
                  isEditing ? '' : 'opacity-50 cursor-not-allowed'
                ]"
              >
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  class="hidden"
                  @change="onFileChange"
                  :disabled="!isEditing || saving"
                />
                Загрузить список
              </label>
            </div>

            <! Сохранить адреса >
            <button
              @click="saveAddresses"
              :disabled="!isEditing || saving"
              class="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? "Сохраняем..." : "Сохранить адреса" }}
            </button>
          </div>

          <! Список адресов >
          <div
            class="space-y-3 max-h-[500px] overflow-auto pr-2"
            :class="{ 'opacity-50': loadingAddresses }"
          >
            <div
              v-for="(addr, idx) in addresses"
              :key="idx"
              class="relative flex items-center mb-3"
            >
              <input
                v-model="addresses[idx]"
                :disabled="!isEditing"
                type="text"
                class="flex-1 px-4 py-2 border border-[#C7F5F9] rounded-full focus:outline-none focus:ring-2 focus:ring-teal-200 pr-10"
              />
              <button
                v-if="isEditing"
                @click="removeAddress(idx)"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                &times;
              </button>
            </div>

            <! Поле для нового адреса >
            <div class="relative flex items-center">
              <input
                v-model="newAddress"
                :disabled="!isEditing"
                type="text"
                placeholder="+"
                class="flex-1 px-4 py-2 border border-[#C7F5F9] rounded-full focus:outline-none focus:ring-2 focus:ring-teal-200 pr-10"
              />
              <button
                v-if="isEditing"
                @click="addAddress"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-700 font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <! Правая карточка: данные пользователя >
        <div class="bg-white rounded-2xl shadow-lg p-6 lg:w-1/3 flex flex-col">
          <h2 class="text-xl font-semibold mb-4">
            <!-- ФИО руководителя или placeholder -->
            <input
              v-model="profile.fullName"
              :readonly="!isEditingProfile"
              type="text"
              placeholder="Руководитель"
              class="w-full px-4 py-2 border border-[#C7F5F9] rounded-full focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
            />
          </h2>

          <! Загрузка и ошибка >
          <div v-if="loading" class="text-center py-4">Загрузка...</div>
          <div v-else-if="error" class="text-red-500 text-center py-4">
            {{ error }}
          </div>

          <! Форма профиля >
          <form v-else @submit.prevent="toggleEditProfile" class="space-y-4 flex-1 flex flex-col">
            <!-- Организация -->
            <div>
              <input
                v-model="profile.orgName"
                :readonly="!isEditingProfile"
                type="text"
                placeholder="Организация"
                class="w-full px-4 py-2 border border-[#C7F5F9] rounded-full focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
              />
            </div>

            <! Email (чтение) >
            <div>
              <input
                v-model="profile.email"
                readonly
                type="email"
                class="w-full px-4 py-2 border border-[#C7F5F9] rounded-full bg-gray-100 focus:outline-none"
                placeholder="Email"
              />
            </div>

            <! Телефон >
            <div>
              <input
                v-model="profile.phone"
                :readonly="!isEditingProfile"
                type="text"
                placeholder="Телефон"
                class="w-full px-4 py-2 border border-[#C7F5F9] rounded-full focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
              />
            </div>

            <! ИНН >
            <div>
              <input
                v-model="profile.inn"
                :readonly="!isEditingProfile"
                type="text"
                placeholder="ИНН"
                class="w-full px-4 py-2 border border-[#C7F5F9] rounded-full focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
              />
            </div>

            <! ОГРН >
            <div>
              <input
                v-model="profile.ogrn"
                :readonly="!isEditingProfile"
                type="text"
                placeholder="ОГРН"
                class="w-full px-4 py-2 border border-[#C7F5F9] rounded-full focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
              />
            </div>

            <! Телефон диспетчерской службы >
            <div>
              <input
                v-model="profile.dispatchPhone"
                :readonly="!isEditingProfile"
                type="text"
                class="w-full px-4 py-2 border border-[#C7F5F9] rounded-full focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                placeholder="Телефон диспетчерской службы"
              />
            </div>

            <! Адрес организации >
            <div class="flex-1">
              <textarea
                v-model="profile.address"
                :readonly="!isEditingProfile"
                rows="3"
                placeholder="Адрес офиса"
                class="mt-1 w-full px-4 py-2 border border-[#C7F5F9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none bg-white"
              ></textarea>
            </div>

            <! Кнопка “Изменить профиль” или “Сохранить изменения” >
            <div class="pt-4">
              <button
                type="button"
                @click="toggleEditProfile"
                class="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="saving || loading"
              >
                {{ isEditingProfile ? "Сохранить изменения" : "Изменить профиль" }}
              </button>
              <!-- Всплывающее уведомление -->
              <transition name="fade">
                <div
                  v-if="showToast"
                  class="fixed top-20 mx-auto left-0 right-0 w-fit bg-red-500 text-white px-4 py-2 rounded-full shadow-lg z-50"
                >
                  Не удалось прочитать файл Excel
                </div>
              </transition>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { auth, db } from "@/firebase"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
//import * as XLSX from "xlsx"
import Header from "@/components/Header.vue"

// 0. Слушаем состояние авторизации
const router = useRouter()
const user = ref(null)
const showToast = ref(false)
const initializing = ref(true)

onAuthStateChanged(auth, (u) => {
  if (u) {
    user.value = u
  } else {
    user.value = null
    router.push("/login")
  }
  initializing.value = false
})

const showExcelError = () => {
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// 1. Состояния загрузки/сохранения/ошибок
const loading = ref(true)
const saving = ref(false)
const loadingAddresses = ref(false)
const error = ref("")

// 2. Профильные данные
const profile = reactive({
  fullName: "",
  orgName: "",
  email: "",
  phone: "",
  inn: "",
  ogrn: "",
  dispatchPhone: "",
  address: ""
})

// 3. Режим редактирования профиля
const isEditingProfile = ref(false)

// 4. Обслуживаемые адреса и их редактирование
const addresses = ref([])
const newAddress = ref("")
const isEditing = ref(false)

// 5. Загрузка данных при монтировании
onMounted(async () => {
  // Ждём, пока Firebase определит авторизацию
  while (initializing.value) {
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  if (!user.value) return

  // Проверяем сеть
  if (!navigator.onLine) {
    error.value = "Нет подключения к Интернету."
    loading.value = false
    return
  }

  // Загружаем профиль из Firestore
  try {
    const docRef = doc(db, "users", user.value.uid)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      const data = snap.data()
      profile.fullName = data.fullName || data.displayName || ""
      profile.email = data.email || user.value.email || ""
      profile.orgName = data.orgName || ""
      profile.phone = data.phone || ""
      profile.inn = data.inn || ""
      profile.ogrn = data.ogrn || ""
      profile.dispatchPhone = data.dispatchPhone || ""
      profile.address = data.address || ""
      addresses.value = data.addresses || []
    } else {
      // Создаём документ, если нет
      await updateDoc(docRef, {
        fullName: user.value.displayName || "",
        email: user.value.email,
        orgName: "",
        phone: "",
        inn: "",
        ogrn: "",
        dispatchPhone: "",
        address: "",
        addresses: [],
        createdAt: serverTimestamp()
      })
      profile.fullName = user.value.displayName || ""
      profile.email = user.value.email || ""
      addresses.value = []
    }
  } catch (err) {
    error.value = "Не удалось загрузить профиль: " + err.message
  } finally {
    loading.value = false
  }
})

// 6. Редактирование профиля
const toggleEditProfile = async () => {
  if (!isEditingProfile.value) {
    // Переход в режим редактирования
    isEditingProfile.value = true
    return
  }

  // Сохранение изменений
  if (!navigator.onLine) {
    error.value = "Нет подключения. Сохранить нельзя."
    return
  }
  saving.value = true
  error.value = ""
  try {
    const docRef = doc(db, "users", user.value.uid)
    await updateDoc(docRef, {
      fullName: profile.fullName.trim(),
      orgName: profile.orgName.trim(),
      phone: profile.phone.trim(),
      inn: profile.inn.trim(),
      ogrn: profile.ogrn.trim(),
      dispatchPhone: profile.dispatchPhone.trim(),
      address: profile.address.trim(),
      updatedAt: serverTimestamp()
    })
    isEditingProfile.value = false
  } catch (err) {
    error.value = "Ошибка при сохранении профиля: " + err.message
  } finally {
    saving.value = false
  }
}

// 7. Редактирование адресов
const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    // При отмене – перезагружаем
    reloadAddresses()
  }
}

const reloadAddresses = async () => {
  loadingAddresses.value = true
  try {
    const snap = await getDoc(doc(db, "users", user.value.uid))
    if (snap.exists()) {
      addresses.value = snap.data().addresses || []
    } else {
      addresses.value = []
    }
  } catch {
    // Игнорируем ошибки при отмене
  } finally {
    loadingAddresses.value = false
  }
}

const addAddress = () => {
  const v = newAddress.value.trim()
  if (v) {
    addresses.value.push(v)
    newAddress.value = ""
  }
}

const removeAddress = (idx) => {
  addresses.value.splice(idx, 1)
}

const saveAddresses = async () => {
  // Если в поле «newAddress» есть непустой текст, добавляем его в массив
  const last = newAddress.value.trim()
  if (last) {
    addresses.value.push(last)
    newAddress.value = ""
  }

  if (!navigator.onLine) {
    error.value = "Нет подключения. Сохранить нельзя."
    return
  }
  saving.value = true
  error.value = ""
  try {
    const docRef = doc(db, "users", user.value.uid)
    await updateDoc(docRef, {
      addresses: addresses.value,
      updatedAt: serverTimestamp()
    })
    isEditing.value = false
  } catch (err) {
    error.value = "Ошибка при сохранении адресов: " + err.message
  } finally {
    saving.value = false
  }
}

// 8. Загрузка Excel-файла с адресами
const onFileChange = (e) => {
  if (!isEditing.value || saving.value) return
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result)
      const workbook = XLSX.read(data, { type: "array" })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      const imported = jsonData
        .map((row) => row[0])
        .filter((cell) => typeof cell === "string" && cell.trim())
      addresses.value = imported
    } catch (err) {
      console.error(err)
      showExcelError()
    }
  }
  reader.readAsArrayBuffer(file)
}
</script>

<style scoped>
.profile-page {
  /* Убираем горизонтальную полосу прокрутки */
  overflow-x: hidden;
}

/* Плавная анимация для меню Header */
.transition-menu {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
