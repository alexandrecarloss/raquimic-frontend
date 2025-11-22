<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">
      {{ isEdit ? "Editar Pergunta" : "Nova Pergunta" }}
    </h1>

    <form @submit.prevent="salvar">
      <div class="grid grid-cols-1 gap-4">

        <!-- Enunciado -->
        <label class="block">
          <span class="font-semibold">Enunciado</span>
          <input v-model="form.enunciado" type="text" class="input" required>
        </label>

        <!-- Molécula -->
        <label class="block">
          <span class="font-semibold">Molécula (opcional)</span>
          <select v-model="form.molecula" class="input">
            <option value="">Assuntos Gerais</option>
            <option
              v-for="m in moleculas"
              :key="m.id"
              :value="m.id"
            >
              {{ m.nome }} ({{ m.formula }})
            </option>
          </select>
        </label>

        <!-- Alternativas -->
        <div class="grid grid-cols-2 gap-4">
          <label>
            <span class="font-semibold">Alternativa A</span>
            <input v-model="form.alternativa_a" type="text" class="input" required>
          </label>

          <label>
            <span class="font-semibold">Alternativa B</span>
            <input v-model="form.alternativa_b" type="text" class="input" required>
          </label>

          <label>
            <span class="font-semibold">Alternativa C</span>
            <input v-model="form.alternativa_c" type="text" class="input" required>
          </label>

          <label>
            <span class="font-semibold">Alternativa D</span>
            <input v-model="form.alternativa_d" type="text" class="input" required>
          </label>
        </div>

        <!-- Resposta correta -->
        <label class="block">
          <span class="font-semibold">Resposta correta</span>
          <select v-model="form.resposta_correta" class="input" required>
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
            <option value="d">D</option>
          </select>
        </label>

        <!-- Dica -->
        <label class="block">
          <span class="font-semibold">Dica</span>
          <input v-model="form.dica" type="text" class="input">
        </label>

        <!-- Dificuldade -->
        <label class="block">
          <span class="font-semibold">Dificuldade</span>
          <select v-model="form.dificuldade" class="input" required>
            <option value="F">Fácil</option>
            <option value="M">Média</option>
            <option value="D">Difícil</option>
          </select>
        </label>

        <!-- Referência -->
        <label class="block">
          <span class="font-semibold">Referência</span>
          <input v-model="form.referencia" type="text" class="input">
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

const moleculas = ref([])
const form = ref({
  enunciado: "",
  molecula: "",
  alternativa_a: "",
  alternativa_b: "",
  alternativa_c: "",
  alternativa_d: "",
  resposta_correta: "a",
  dica: "",
  dificuldade: "F",
  referencia: ""
})

const isEdit = computed(() => !!route.params.id)

onMounted(async () => {
  const resMol = await api.get("/moleculas/")
  moleculas.value = resMol.data

  if (isEdit.value) {
    const res = await api.get(`/perguntas/${route.params.id}/`)
    form.value = res.data
    form.value.molecula = res.data.molecula ?? ""
  }
})

async function salvar() {
  console.log(form.value)
  if (isEdit.value) {
    await api.put(`perguntas/${route.params.id}/`, form.value)
  } else {
    await api.post("perguntas/", form.value)
  }

  router.push("/perguntas")
}
</script>

<style scoped>
.input {
  @apply w-full border rounded p-2;
}
</style>
