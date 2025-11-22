<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="login" class="bg-white p-8 rounded-xl shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Usuário</label>
        <input v-model="username" type="text" class="w-full border p-2 rounded" required />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Senha</label>
        <input v-model="password" type="password" class="w-full border p-2 rounded" required />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Entrar
      </button>

      <p v-if="error" class="text-red-600 text-center mt-3">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../api/api";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const error = ref("");

const auth = useAuthStore();
const router = useRouter();

async function login() {
  error.value = "";

  try {
    const response = await api.post("/token/", {
      username: username.value,
      password: password.value,
    });

    auth.login(response.data.access);
    router.push("/");
  } catch (err) {
    error.value = "Credenciais inválidas.";
  }
}
</script>
