<template>
  <div class="w-full h-screen">
    <div class="mt-8">
      <div class="mx-auto max-w-xl sm:px-6 lg:px-8">
        <SearchBar @search-submitted="searchImages" />
      </div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <ImageGrid :images="images" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { toast } from 'vue3-toastify';
  import axios from 'axios';
  import ImageGrid from '@/components/ImageGrid.vue';
  import SearchBar from '@/components/SearchBar.vue';

  const images = ref();

  onMounted(async () => {
    await fetchImages();
  });

  const fetchImages = async (searchQuery = '') => {
    try {
      const trimmedQuery = searchQuery.trim();
      const url = trimmedQuery ? `/images?search=${encodeURIComponent(trimmedQuery)}` : '/images';

      const response = await axios.get(url);
      images.value = response.data;
    } catch (error) {
      toast.error('Error fetching images:', error);
    }
  };

  const searchImages = async (searchQuery) => {
    await fetchImages(searchQuery);
  }
</script>