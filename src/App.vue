<template>
  <div>
    <div v-if="isLoginPage">
      <router-view />
    </div>

    <div v-else class="min-h-screen flex">
      
      <!-- Botão só aparece no mobile -->
      <button
        class="md:hidden fixed top-4 left-4 bg-gray-900 text-white px-3 py-2 rounded-md z-50"
        @click="sidebarRef.isOpen = !sidebarRef.isOpen"
      >
        ☰
      </button>

      <!-- Sidebar -->
      <Sidebar ref="sidebarRef" />

      <!-- Conteúdo -->
      <div class="flex-1 p-6 md:ml-0 ml-0">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "./components/Sidebar.vue";

const route = useRoute();
const sidebarRef = ref(null);

const isLoginPage = computed(() => route.meta.public === true);
</script>
