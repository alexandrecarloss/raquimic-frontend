<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quizzes</h1>

      <RouterLink
        to="/quizzes/nova"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        + Novo Quiz
      </RouterLink>
    </div>

    <div class="mb-4 flex justify-end">
      <input
        v-model="filtro"
        type="text"
        placeholder="Buscar quiz..."
        class="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 w-64"
      />
    </div>


    <div class="bg-gray-900 shadow rounded-xl p-4">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-800 text-left">
            <th class="p-3">Nome</th>
            <th class="p-3">Qtd. Perguntas</th>
            <th class="p-3 w-32 text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="q in quizzesFiltrados" :key="q.id">
            <td class="p-3">{{ q.nome }}</td>
            <td class="p-3">{{ q.perguntas.length }}</td>

            <td class="p-3 text-center flex gap-2 justify-center">
              <RouterLink
                :to="`/quizzes/${q.id}/editar`"
                class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Editar
              </RouterLink>

              <button
                @click="deletarQuiz(q.id)"
                class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Apagar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="quizzes.length === 0" class="text-center py-6 text-gray-500">
        Nenhum quiz cadastrado.
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api"

export default {
  data() {
    return {
      quizzes: [],
      filtro: ""
    };
  },
  computed: {
    quizzesFiltrados() {
      const txt = this.filtro.toLowerCase();

      return this.quizzes.filter(q =>
        q.nome.toLowerCase().includes(txt) ||
        q.perguntas.length.toString().includes(txt)
      );
    }
  },
  async mounted() {
    const resp = await api.get("/quizzes/")
    this.quizzes = resp.data.results
  },
  methods: {
    async deletarQuiz(id) {
      if (!confirm("Tem certeza que deseja excluir este quiz?")) return;

      await api.delete(`/quizzes/${id}/`);
      this.quizzes = this.quizzes.filter(q => q.id !== id);
    }
  }
}
</script>
