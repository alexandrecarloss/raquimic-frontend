<template>
  <div class="w-full">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Total de Perguntas</h2>
        <p class="text-4xl text-gray-700 font-bold">{{ stats.perguntas }}</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Moléculas Cadastradas</h2>
        <p class="text-4xl text-gray-700 font-bold">{{ stats.moleculas }}</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Salas Ativas (Firebase)</h2>
        <p class="text-4xl text-gray-700 font-bold">{{ salas.length }}</p>
        <p class="text-sm text-gray-500 mt-2">Gerencie salas ao lado</p>
      </div>
    </div>

    <!-- Gráfico -->
    <div class="bg-white p-6 rounded-xl shadow">
      <h2 class="text-xl text-gray-700 font-semibold mb-4">Perguntas x Moléculas</h2>
      <canvas ref="chartCanvas" class="w-full h-64"></canvas>
    </div>

    <!-- Lista de salas do Firebase -->
    <div class="bg-white p-6 rounded-xl shadow mt-6">
      <h2 class="text-xl text-gray-700 font-semibold mb-4">Salas Ativas</h2>

      <div v-if="salas.length === 0" class="text-gray-500">Nenhuma sala ativa.</div>

      <ul>
        <li v-for="s in salas" :key="s.id" class="flex justify-between items-center p-3 border rounded mb-2">
          <div>
            <div class="font-semibold">ID: {{ s.id }}</div>
            <div class="text-sm text-gray-600">Host: {{ s.hostName || '—' }} • Jogadores: {{ s.players?.length || 0 }}</div>
            <div class="text-xs text-gray-500">Criada: {{ formatDate(s.createdAt) }}</div>
          </div>

          <div class="flex items-center gap-2">
            <button @click="openSala(s)" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Abrir</button>
            <button @click="encerrarSala(s.id)" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Encerrar</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import api from "../api/api";
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { db, collection, onSnapshot, deleteDoc, doc } from "../firebase";

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const stats = ref({ perguntas: 0, moleculas: 0 });
const chartCanvas = ref(null);
let chartInstance = null;

const salas = ref([]);
let unsubscribeSalas = null;

function formatDate(ts) {
  try {
    const d = ts?.toDate ? ts.toDate() : (ts ? new Date(ts) : null);
    return d ? d.toLocaleString() : "—";
  } catch (e) { return "—"; }
}

async function carregarStats() {
  try {
    const [p, m] = await Promise.all([
      api.get("/perguntas/"),
      api.get("/moleculas/")
    ]);

    stats.value.perguntas = Array.isArray(p.data) ? p.data.length : (p.data.count ?? 0);
    stats.value.moleculas = Array.isArray(m.data) ? m.data.length : (m.data.count ?? 0);

    atualizarGrafico();
  } catch (e) {
    console.error("Erro ao carregar stats:", e);
  }
}

function criarGrafico() {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Perguntas", "Moléculas"],
      datasets: [{
        label: "Totais",
        data: [stats.value.perguntas, stats.value.moleculas],
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Perguntas vs Moléculas" }
      },
      scales: {
        y: { beginAtZero: true, ticks: { precision:0 } }
      }
    }
  });
}

function atualizarGrafico() {
  if (!chartInstance) {
    criarGrafico();
    return;
  }
  chartInstance.data.datasets[0].data = [stats.value.perguntas, stats.value.moleculas];
  chartInstance.update();
}

// Firebase: monitora coleção "salas"
function ligarMonitorSalas() {
  const salasCol = collection(db, "salas");
  unsubscribeSalas = onSnapshot(salasCol, (snapshot) => {
    const arr = [];
    snapshot.forEach(docSnap => {
      arr.push({ id: docSnap.id, ...docSnap.data() });
    });
    // ordenar por createdAt se existir
    arr.sort((a,b) => {
      const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0)
      const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0)
      return tb - ta;
    })
    salas.value = arr;
  }, (err) => console.error("Erro no snapshot salas:", err));
}

async function encerrarSala(id) {
  if (!confirm("Encerrar esta sala? Isso removerá a sala do Firestore.")) return;
  try {
    await deleteDoc(doc(db, "salas", id));
  } catch (e) {
    console.error("Erro ao encerrar sala:", e);
  }
}

function openSala(s) {
  // abre detalhes em nova aba ou modal (pode implementar modal depois)
  alert(`Abrindo sala ${s.id} — jogadores: ${s.players?.length || 0}`);
}

onMounted(() => {
  carregarStats();
  criarGrafico();
  ligarMonitorSalas();
});

onBeforeUnmount(() => {
  if (unsubscribeSalas) unsubscribeSalas();
  if (chartInstance) chartInstance.destroy();
});
</script>

<style scoped>
/* coloque estilos se quiser */
</style>
