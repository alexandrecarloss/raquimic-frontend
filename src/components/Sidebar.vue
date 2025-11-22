<template>
  <aside class="w-64 bg-gray-900 text-white p-4 flex flex-col gap-6">
    <h1 class="text-xl font-bold">RAquimic Admin</h1>

    <nav class="flex flex-col gap-2">
      <RouterLink to="/" class="sidebar-link">Dashboard</RouterLink>
      <RouterLink to="/perguntas" class="sidebar-link">Perguntas</RouterLink>
      <RouterLink to="/moleculas" class="sidebar-link">Moléculas</RouterLink>
      <RouterLink to="/salas" class="sidebar-link">Multiplayer</RouterLink>
      <button @click="auth.logout()" class="text-red-500">Sair</button>

    </nav>
  </aside>
</template>

<style scoped>
.sidebar-link {
  @apply p-2 rounded-md text-white hover:bg-gray-700 transition;
}
</style>

