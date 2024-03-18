<template>
    <form @submit.prevent="submit">
      <label for="search" class="block text-sm font-medium leading-6 text-gray-900">Image Search</label>
      <div class="relative mt-2 flex items-center gap-x-4">
        <input type="text" v-model="search" name="search" placeholder="Serach Image" id="search" class="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
        <button type="submit" @click="submit" class="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
      </div>
  </form>
</template>

<script setup>
  import { ref } from 'vue'
  const search = ref('')
  const emit = defineEmits(['search-submitted']);

  const submit = (event) => {
    emit('search-submitted', search.value);
  }
</script>