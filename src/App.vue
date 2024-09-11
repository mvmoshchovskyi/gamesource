<script setup>
import Header from '@/components/navigation/header.vue';
import { firstLoad } from '@/composables/auth';

const { loading } = firstLoad();
</script>

<template>
  <div v-if="loading" class="text-center m3">
    <v-progress-circular indeterminate color="primary"/>
  </div>
  <div v-else>
    <Header/>
    <router-view/>
  </div>
</template>

<style scoped>
</style>
