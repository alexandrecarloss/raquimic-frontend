<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Moléculas</h1>

      <RouterLink
        to="/moleculas/nova"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        + Nova Molécula
      </RouterLink>
    </div>

    <div class="mb-4 flex justify-end">
      <input
        v-model="filtro"
        type="text"
        placeholder="Buscar molécula..."
        class="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 w-64"
      />
    </div>



    <div class="bg-gray-900 shadow rounded-xl p-4">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-800 text-left">
            <th class="p-3">Nome</th>
            <th class="p-3">Fórmula</th>
            <th class="p-3 w-32 text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="m in moleculasFiltradas" :key="m.id">
            <td class="p-3">{{ m.nome }}</td>
            <td class="p-3">{{ m.formula }}</td>

            <td class="p-3 text-center flex gap-2 justify-center">
              <RouterLink
                :to="`/moleculas/${m.id}/editar`"
                class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Editar
              </RouterLink>

              <button
                @click="deletarMol(m.id)"
                class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Apagar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="moleculas.length === 0" class="text-center py-6 text-gray-500">
        Nenhuma molécula cadastrada.
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api";

export default {
  data() {
    return {
      moleculas: [],
      filtro: ""
    };
  },
  computed: {
    moleculasFiltradas() {
      const txt = this.filtro.toLowerCase();
      return this.moleculas.filter(m =>
        m.nome.toLowerCase().includes(txt) ||
        m.formula.toLowerCase().includes(txt)
      );
    }
  },
  methods: {
    async carregar() {
      try {
        const resp = await api.get("/moleculas/");
        this.moleculas = resp.data.results;
      } catch (e) {
        console.error("Erro ao carregar moléculas:", e);
      }
    },

    async deletarMol(id) {
      if (!confirm("Tem certeza que deseja excluir esta molécula?")) return;

      try {
        await api.delete(`/moleculas/${id}/`);
        this.moleculas = this.moleculas.filter(m => m.id !== id);
      } catch (e) {
        console.error("Erro ao apagar:", e);
      }
    }
  },
  mounted() {
    this.carregar();
  },
};
</script>
