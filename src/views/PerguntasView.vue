<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Perguntas</h1>

      <RouterLink
        to="/perguntas/nova"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        + Nova Pergunta
      </RouterLink>
    </div>

    <div class="bg-gray-900 shadow rounded-xl p-4">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-800 text-left">
            <th class="p-3">Pergunta</th>
            <th class="p-3">Molécula / Assunto</th>
            <th class="p-3 w-32 text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in perguntas" :key="p.id">
            <td class="p-3">{{ p.enunciado }}</td>

            <td class="p-3">
              <span v-if="p.molecula">{{ p.molecula.nome }}</span>
              <span v-else class="text-gray-500 italic">Assuntos Gerais</span>
            </td>

            <td class="p-3 text-center flex gap-2 justify-center">
              <RouterLink
                :to="`/perguntas/${p.id}/editar`"
                class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Editar
              </RouterLink>

              <button
                @click="deletarPergunta(p.id)"
                class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Apagar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="perguntas.length === 0" class="text-center py-6 text-gray-500">
        Nenhuma pergunta cadastrada.
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api"; 

export default {
  name: "PerguntasView",
  data() {
    return {
      perguntas: [],
    };
  },
  methods: {
    async carregarPerguntas() {
      try {
        const resp = await api.get("/perguntas/");
        this.perguntas = resp.data;
      } catch (e) {
        console.error("Erro ao carregar perguntas:", e);
      }
    },

    async deletarPergunta(id) {
      if (!confirm("Tem certeza que deseja excluir esta pergunta?")) return;

      try {
        await api.delete(`/perguntas/${id}/`);
        this.perguntas = this.perguntas.filter(p => p.id !== id);
      } catch (e) {
        console.error("Erro ao deletar:", e);
      }
    },
  },
  mounted() {
    this.carregarPerguntas();
  },
};
</script>
