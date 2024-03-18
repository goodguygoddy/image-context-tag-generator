<template>
  <div class="w-full">
    <div class="mx-auto mt-8 max-w-xl sm:px-6 lg:px-8">
      <form @submit.prevent="submit">
        <div class="col-span-full">
          <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900"
            >Upload Image</label
          >
          <div
            class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
          >
            <div v-if="isLoading" class="flex justify-center items-center">
              <Loader />
            </div>
            <div v-else>
              <div v-if="selectedFile">
                <div class="mt-4 flex text-sm leading-6 text-gray-600">
                  <img :src="fileURL" alt="uploaded file" class="pointer-events-none object-cover group-hover:opacity-75" />
                </div>
              </div>
              <div v-else class="text-center">
                <PhotoIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <div class="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" @change="handleFileChange" name="file-upload" type="file" class="sr-only" />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-x-2 mt-8">
          <button v-if="selectedFile" type="button" @click="cancel" class="flex-none rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Cancel</button>
          <button type="submit" class="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { PhotoIcon } from '@heroicons/vue/24/solid';
  import { toast } from 'vue3-toastify';
  import Loader from '@/components/icons/Loader.vue';

  const selectedFile = ref(null);
  const fileURL = ref(null);
  const isLoading = ref(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file.type.startsWith('image/')) {
      cancel();
      toast.warning("Only image files are allowed!");
      return;
    }

    const maxFileSize = 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      cancel();
      toast.warning("File size should not exceed 10 MB!");
      return;
    }

    if (fileURL.value) {
      URL.revokeObjectURL(fileURL.value);
    }
    selectedFile.value = file;
    fileURL.value = URL.createObjectURL(selectedFile.value);
  }

  const cancel = () => {
    if (fileURL.value) {
      URL.revokeObjectURL(fileURL.value);
    }
    selectedFile.value = null;
    fileURL.value = null;
    isLoading.value = false;
  }

  const submit = async () => {
    if (!selectedFile.value) {
      toast.warning("File not selected!");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile.value);

    isLoading.value = true;

    try {
      await axios.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading file!');
    } finally {
      cancel();
    }
  }
</script>