<template>
  <aside :class="['w-64 bg-gray-900 text-white pt-10 flex flex-col gap-6 transition-all duration-300',
      isOpen ? 'w-56' : 'w-0 overflow-hidden',
      'md:w-64 lg:w-72']">
    <h1 class="text-xl font-bold">RAquimic Admin</h1>

    <nav class="flex flex-col gap-2">
      <RouterLink to="/" class="sidebar-link">Dashboard</RouterLink>
      <RouterLink to="/perguntas" class="sidebar-link">Perguntas</RouterLink>
      <RouterLink to="/moleculas" class="sidebar-link">Moléculas</RouterLink>
      <button @click="auth.logout()" class="text-red-500">Sair</button>

    </nav>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/auth";

const auth = useAuthStore();
const isOpen = ref(false); // estado mobile

// Permite controle externo (pelo botão no App.vue)
defineExpose({ isOpen });
</script>

<style scoped>
.sidebar-link {
  @apply p-2 rounded-md text-white hover:bg-gray-700 transition;
}
</style>

<!-- atualização teste sidebar -->