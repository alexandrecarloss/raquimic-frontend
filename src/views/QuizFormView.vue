<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">
      {{ isEdit ? "Editar Quiz" : "Criar Novo Quiz" }}
    </h1>

    <form @submit.prevent="salvar">
      <div class="grid grid-cols-1 gap-4">

        <!-- Nome -->
        <label class="block">
          <span class="font-semibold">Nome do Quiz</span>
          <input v-model="form.nome" type="text" class="input" required />
        </label>

        <!-- Painel de geração automática – só aparece na criação -->
        <div v-if="!isEdit" class="bg-gray-900 p-4 rounded-lg mb-6">
          <h2 class="font-bold text-lg mb-2">Geração Automática</h2>

          <label>Quantidade: </label>
          <input v-model.number="qtd" type="number" class="border p-1 w-20 ml-2">

          <label class="ml-4">Dificuldade:</label>
          <select v-model="dificuldade" class="border p-1 ml-2">
            <option value="">Todas</option>
            <option value="F">Fácil</option>
            <option value="M">Média</option>
            <option value="D">Difícil</option>
          </select>

          <button class="btn-green ml-4" type="button" @click="gerarAutomatico">
            Gerar
          </button>
        </div>

        <div class="block">
          <span class="font-semibold">Perguntas</span>

          <!-- 🔍 Busca -->
          <input 
            v-model="busca" 
            @input="buscarPerguntas" 
            placeholder="Buscar pergunta..." 
            class="w-full border p-2 rounded bg-gray-800 mt-2"
          />

          <div class="max-h-96 overflow-y-auto border rounded p-3 bg-gray-700 mt-2">
            <div
              v-for="p in perguntasFiltradas"
              :key="p.id"
              class="flex justify-between border-b py-2"
            >
              <span>{{ p.enunciado }}</span>
              <input type="checkbox" v-model="form.perguntas" :value="p.id"/>
            </div>
          </div>

          <!-- 🔄 Paginação -->
          <div class="flex justify-between mt-3">
            <button 
              class="btn-green" 
              :disabled="!previous"
              @click="carregarPagina(previous)"
            >
              Anterior
            </button>

            <button 
              class="btn-green" 
              :disabled="!next"
              @click="carregarPagina(next)"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      <button class="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Salvar
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import api from "../api/api"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const perguntas = ref([])
const next = ref(null)
const previous = ref(null)
const busca = ref("")

const form = ref({
  nome: "",
  perguntas: []
})

const qtd = ref(5)
const dificuldade = ref("")
const isEdit = computed(() => !!route.params.id)
const perguntasFiltradas = computed(() => perguntas.value)

let searchTimeout = null

function buscarPerguntas() {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(async () => {
    await carregarPagina(`/perguntas/?search=${busca.value}`)
  }, 300) // debounce
}


// =============================
// Função genérica para carregar qualquer URL
// =============================
async function carregarPagina(url = "/perguntas/") {
  const res = await api.get(url)

  perguntas.value = res.data.results
  next.value = res.data.next
  previous.value = res.data.previous
}

// =============================
// Load inicial
// =============================
onMounted(async () => {
  await carregarPagina()

  if (isEdit.value) {
    const res = await api.get(`/quizzes/${route.params.id}/`)
    form.value.nome = res.data.nome
    form.value.perguntas = res.data.perguntas.map(p => p.id)
  }
})

// =============================
// Gerar automático
// =============================
function gerarAutomatico() {
  let filtradas = perguntas.value

  if (dificuldade.value) {
    filtradas = filtradas.filter(p => p.dificuldade === dificuldade.value)
  }

  form.value.perguntas = filtradas
    .sort(() => Math.random() - 0.5)
    .slice(0, qtd.value)
    .map(p => p.id)
}

// =============================
// Salvar
// =============================
async function salvar() {
  const payload = {
    nome: form.value.nome,
    perguntas: form.value.perguntas.filter(Boolean)
  }

  if (isEdit.value) {
    await api.put(`/quizzes/${route.params.id}/`, payload)
  } else {
    await api.post("/quizzes/", payload)
  }

  router.push("/quizzes")
}
</script>

<style scoped>
.input {
  @apply w-full border rounded p-2;
}
.btn-blue {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition;
}
.btn-green {
  @apply bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition;
}
</style>
