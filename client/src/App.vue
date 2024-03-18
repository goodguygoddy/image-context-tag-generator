<template>
  <header class="bg-white">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex gap-x-12">
        <RouterLink to="/" class="-mx-3 cursor-pointer block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Search Images</RouterLink>
        <RouterLink to="/upload" class="-mx-3 cursor-pointer block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Upload Images</RouterLink>
      </div>
    </nav>
  </header>
  <main class="bg-white">
    <RouterView />
  </main>
</template>

<script setup>

</script>