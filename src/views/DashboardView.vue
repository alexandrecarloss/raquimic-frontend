<template>
  <div class="w-full flex flex-col gap-6">

    <!-- TÍTULO -->
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <div v-if="loadingStats" class="w-full py-6 text-center">
      <div class="animate-spin w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full mx-auto"></div>
      <p class="text-gray-600 mt-2">Carregando estatísticas...</p>
    </div>
    <div v-else>
      <!-- CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
          <h2 class="card-title">Total de Perguntas</h2>
          <p class="card-value">{{ stats.perguntas }}</p>
        </div>

        <div class="card">
          <h2 class="card-title">Moléculas Cadastradas</h2>
          <p class="card-value">{{ stats.moleculas }}</p>
        </div>

        <div class="card">
          <h2 class="card-title">Salas Ativas (Firebase)</h2>
          <p class="card-value">{{ salas.length }}</p>
          <p class="text-sm text-gray-500 mt-2">Gerencie salas ao lado</p>
        </div>
      </div>
    </div>

    <!-- GRÁFICO -->
    <div class="card h-72">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Perguntas x Moléculas</h2>
      <canvas ref="chartCanvas" class="w-full h-full"></canvas>
    </div>

    <div v-if="loadingSalas" class="py-4 text-center text-gray-500">
      Carregando salas...
    </div>

    <!-- SALAS -->
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl text-gray-700 font-semibold">Salas Ativas</h2>
        <span class="text-gray-500 text-sm">{{ salas.length }} salas</span>
      </div>

      <div
        class="overflow-y-auto max-h-96 pr-2"
        v-if="salas.length > 0"
      >
        <ul class="flex flex-col gap-2">
          <li
            v-for="s in salas"
            :key="s.id"
            class="border rounded p-3 flex justify-between items-center bg-gray-50"
          >
            <div>
              <div class="font-semibold">ID: {{ s.id }}</div>
              <div class="text-sm text-gray-600">
                Host: {{ s.hostName || '—' }} • Jogadores: {{ s.jogadores?.length || 0 }}
              </div>
              <div class="text-xs text-gray-500">
                Criada: {{ formatDate(s.createdAt) }}
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="openSala(s)"
                class="btn-green"
              >
                Abrir
              </button>

              <button
                @click="encerrarSala(s.id)"
                class="btn-red"
              >
                Encerrar
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div v-else class="text-gray-500">Nenhuma sala ativa.</div>
    </div>

  </div>
</template>

<style scoped>
.card {
  @apply bg-white p-6 rounded-xl shadow hover:shadow-lg transition;
}

.card-title {
  @apply text-lg font-semibold text-gray-700 mb-2;
}

.card-value {
  @apply text-4xl text-gray-700 font-bold;
}

.btn-green {
  @apply px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition;
}

.btn-red {
  @apply px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition;
}
</style>


<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import api from "../api/api";
import { rtdb } from "../firebase";
import { ref as dbRef, onValue, remove } from "firebase/database";
const loadingStats = ref(true);
const loadingSalas = ref(true);


onValue(dbRef(rtdb, "salas/"), (snapshot) => {
  console.log(snapshot.val());
});


// Chart.js
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// 🔥 Registro correto (faltava o BarController)
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const stats = ref({ perguntas: 0, moleculas: 0 });
const chartCanvas = ref(null);
let chartInstance = null;

const salas = ref([]);
let unsubscribeSalas = null;

// Formatador datas
function formatDate(ts) {
  try {
    const d = ts?.toDate ? ts.toDate() : (ts ? new Date(ts) : null);
    return d ? d.toLocaleString() : "—";
  } catch (e) {
    return "—";
  }
}

// -----------------------------------------------------------------------------------
// CARREGA ESTATÍSTICAS
// -----------------------------------------------------------------------------------
async function carregarStats() {
  try {
    const [p, m] = await Promise.all([
      api.get("/perguntas-total/"),
      api.get("/moleculas-total/")
    ]);

    stats.value.perguntas = p.data.count;
    stats.value.moleculas = m.data.count;

    atualizarGrafico();
  } catch (e) {
    console.error("Erro ao carregar stats:", e);
  }
}

// -----------------------------------------------------------------------------------
// GRÁFICO
// -----------------------------------------------------------------------------------
function criarGrafico() {
  if (!chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext("2d");

  // 🔥 Evita o erro “Canvas already in use”
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Perguntas", "Moléculas"],
      datasets: [
        {
          label: "Totais",
          data: [stats.value.perguntas, stats.value.moleculas],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Perguntas vs Moléculas" }
      },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  });
}

function atualizarGrafico() {
  if (!chartInstance) {
    criarGrafico();
    return;
  }

  chartInstance.data.datasets[0].data = [
    stats.value.perguntas,
    stats.value.moleculas
  ];

  chartInstance.update();
}

// -----------------------------------------------------------------------------------
// FIREBASE
// -----------------------------------------------------------------------------------
function ligarMonitorSalasRealtime() {
  const salasRef = dbRef(rtdb, "salas");

  onValue(salasRef, (snapshot) => {
    const data = snapshot.val();
    salas.value = data
    ? Object.entries(data).map(([id, item]) => ({
        id,
        createdAt: item.createdAt,
        hostName: item.hostName,
        jogadores: item.jogadores ? Object.keys(item.jogadores) : [], // <-- CORREÇÃO
      }))
    : [];

  });
}

async function encerrarSala(id) {
  if (!confirm("Encerrar esta sala?")) return;

  try {
    await remove(dbRef(rtdb, `salas/${id}`));
  } catch (e) {
    console.error("Erro ao encerrar sala:", e);
  }
}

function openSala(s) {
  alert(`Abrindo sala ${s.id} — jogadores: ${s.jogadores?.length || 0}`);
}

// -----------------------------------------------------------------------------------
// CICLO DE VIDA
// -----------------------------------------------------------------------------------
onMounted(async () => {
  loadingStats.value = true;

  await carregarStats();
  loadingStats.value = false;

  ligarMonitorSalasRealtime();
  setTimeout(() => loadingSalas.value = false, 300); // só para não "piscar"
});


onBeforeUnmount(() => {
  if (unsubscribeSalas) unsubscribeSalas();
  if (chartInstance) chartInstance.destroy();
});
</script>
