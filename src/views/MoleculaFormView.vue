<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">
      {{ isEdit ? "Editar Molécula" : "Nova Molécula" }}
    </h1>

    <form @submit.prevent="salvar">
      <div class="grid grid-cols-1 gap-4">

        <label class="block">
          <span class="font-semibold">Nome</span>
          <input v-model="form.nome" type="text" class="input" required>
        </label>

        <label class="block">
          <span class="font-semibold">Fórmula</span>
          <input v-model="form.formula" type="text" class="input" required>
        </label>

        <label class="block">
          <span class="font-semibold">Massa Molar</span>
          <input v-model="form.massaMolar" type="number" step="0.01" class="input">
        </label>

        <label class="block">
          <span class="font-semibold">Polaridade</span>
          <input v-model="form.polaridade" type="text" class="input">
        </label>

        <label class="block">
          <span class="font-semibold">Densidade</span>
          <input v-model="form.densidade" type="number" step="0.01" class="input">
        </label>

        <label class="block">
          <span class="font-semibold">Ponto de Ebulição (°C)</span>
          <input v-model="form.pontoEbulicao" type="number" step="0.1" class="input">
        </label>

        <label class="block">
          <span class="font-semibold">Ponto de Fusão (°C)</span>
          <input v-model="form.pontoFusao" type="number" step="0.1" class="input">
        </label>

        <label class="block">
          <span class="font-semibold">Geometria</span>
          <input v-model="form.geometria" type="text" class="input">
        </label>

        <label class="block">
          <span class="font-semibold">Características</span>
          <textarea v-model="form.caracteristicas" class="input"></textarea>
        </label>

        <label class="block">
          <span class="font-semibold">Aplicações</span>
          <textarea v-model="form.aplicacoes" class="input"></textarea>
        </label>

        <label class="block">
          <span class="font-semibold">Fontes</span>
          <textarea v-model="form.fontes" class="input"></textarea>
        </label>
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

const form = ref({
  nome: "",
  formula: "",
  massaMolar: "",
  polaridade: "",
  densidade: "",
  pontoEbulicao: "",
  pontoFusao: "",
  caracteristicas: "",
  geometria: "",
  fontes: "",
  aplicacoes: ""
})

const isEdit = computed(() => !!route.params.id)

onMounted(async () => {
  if (isEdit.value) {
    const res = await api.get(`/moleculas/${route.params.id}/`)
    form.value = res.data
  }
})

async function salvar() {
  if (isEdit.value) {
    await api.put(`/moleculas/${route.params.id}/`, form.value)
  } else {
    await api.post("/moleculas/", form.value)
  }

  router.push("/moleculas")
}
</script>

<style scoped>
.input {
  @apply w-full border rounded p-2 bg-gray-800 text-white;
}
</style>
