<template>
  <div class="w-full h-screen">
    <div class="mt-24">
      <div class="mx-auto max-w-xl sm:px-6 lg:px-8">
        <SearchBar @search-submitted="updateImages" />
      </div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <ImageGrid :images="images" />
      </div>
    </div>
  </div>


</template>

<script setup>
import { onMounted } from 'vue';
import { toast } from "vue3-toastify"
import axios from 'axios';
import ImageGrid from './components/ImageGrid.vue';
import SearchBar from './components/SearchBar.vue';


onMounted(async () => {
  try {
    const response = await axios.get('/images');
    images.value = response.data;
  } catch (error) {
    toast.error('Error fetching images:', error);
  }
});


const updateImages = async (searchQuery) => {
  const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/your-api-endpoint`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});
}

// const images = ref([
//   {
//     title: 'Cat Cat, Dog, Planet Cat, Dog, Planet',
//     tags: 'Cat, Dog, Planet',
//     source:
//       'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
//   },
//   {
//     title: 'Dog',
//     tags: 'Cat, Dog, Planet',
//     source:
//       'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
//   },
//   {
//     title: 'Planet',
//     tags: 'Cat, Dog, Planet',
//     source:
//       'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
//   },
//   {
//     title: 'World',
//     size: 'Hello, world',
//     source:
//       'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
//   },
//   // More files...
// ])

</script>