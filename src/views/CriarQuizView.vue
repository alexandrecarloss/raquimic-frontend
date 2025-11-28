<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Criar Quiz Personalizado</h1>

    <p class="mb-2">Selecione as perguntas:</p>

    <div class="border p-4 rounded max-h-[500px] overflow-y-auto mb-4 bg-blue-600">
      <div
        v-for="p in perguntas"
        :key="p.id"
        class="flex justify-between border-b py-2"
      >
        <span>{{ p.enunciado }}</span>
        <input type="checkbox" v-model="selecionadas" :value="p.id" />
      </div>
    </div>

    <button class="bg-blue-600 text-white px-3 py-2 rounded" @click="criarQuiz">
      Criar Quiz
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/api";
import { useRouter } from "vue-router";

const router = useRouter();

const perguntas = ref([]);
const selecionadas = ref([]);

onMounted(async () => {
  const res = await api.get("/perguntas/");
  perguntas.value = res.data;
});

async function criarQuiz() {
  if (selecionadas.value.length === 0) {
    alert("Selecione pelo menos uma pergunta");
    return;
  }

  const res = await api.post("/quiz/criar-personalizado/", {
    perguntas: selecionadas.value,
  });

  alert("Quiz criado! ID: " + res.data.id);

  router.push("/");
}
</script>
