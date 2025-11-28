<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Criar Quiz Personalizado</h1>

    <!-- Nome do quiz -->
    <label class="block mb-4">
      <span class="font-semibold">Nome do Quiz</span>
      <input v-model="nome" type="text" class="input" required>
    </label>

    <!-- Seleção automática -->
    <div class="bg-gray-900 p-4 rounded-lg mb-6">
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

      <button class="btn-green ml-4" @click="gerarAutomatico">
        Gerar
      </button>
    </div>

    <!-- Lista de perguntas -->
    <div class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Selecione Perguntas</h2>
      <div class="max-h-96 overflow-y-auto border rounded p-3 bg-gray-700">

        <div v-for="p in perguntas" :key="p.id" class="border-b py-2 flex justify-between">
          <span>{{ p.enunciado }}</span>
          <input type="checkbox"
                 v-model="selecionadas"
                 :value="p.id">
        </div>

      </div>
    </div>

    <button class="btn-blue" @click="salvarQuiz">Salvar Quiz</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "../api/api"
import { useRouter } from "vue-router"

const router = useRouter()

const nome = ref("")
const perguntas = ref([])
const selecionadas = ref([])

const qtd = ref(5)
const dificuldade = ref("")

onMounted(async () => {
  const res = await api.get("/perguntas/")
  perguntas.value = res.data
})

function gerarAutomatico() {
  let filtradas = perguntas.value

  if (dificuldade.value) {
    filtradas = filtradas.filter(p => p.dificuldade === dificuldade.value)
  }

  selecionadas.value = filtradas
    .sort(() => Math.random() - 0.5)
    .slice(0, qtd.value)
    .map(p => p.id)
}

async function salvarQuiz() {
  if (!nome.value || selecionadas.value.length === 0) {
    alert("Preencha nome e selecione ao menos 1 pergunta")
    return
  }

  const payload = {
    nome: nome.value,
    perguntas: selecionadas.value
  }

  const res = await api.post("/quiz-personalizado/", payload)
  router.push(`/quiz/jogar/${res.data.id}`)
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
