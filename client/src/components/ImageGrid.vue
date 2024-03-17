<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        <li v-for="image in images" :key="image.source" class="relative">
          <div class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <img :src="image.source" alt="" class="pointer-events-none object-cover group-hover:opacity-75" />
          </div>
          <p class="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{{ image.title }}</p>
          <p class="pointer-events-none block text-sm font-medium text-gray-500">{{ image.tags }}</p>
        </li>
      </ul>
    </div>
</template>

<script setup>

  const props = defineProps({
    images: Array
  })

</script>