<template>
  <div>
    <!-- Se estiver na rota de login, só mostra o conteúdo -->
    <div v-if="isLoginPage">
      <router-view />
    </div>

    <!-- Caso contrário, mostra Sidebar + Header + conteúdo -->
    <div v-else class="min-h-screen flex">
      <Sidebar />

      <div class="flex-1 p-6">
        
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "./components/Sidebar.vue";

const route = useRoute();

const isLoginPage = computed(() => route.meta.public === true);
</script>
