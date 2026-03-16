<script setup lang="ts">
import { getRecipeSuggestions } from '@/utils/ollama';
import { ref } from 'vue';

const ingredients = ref('');
const suggestions = ref('');

const fetchRecipes = async () => {
    const respons = ""
  try {
    console.log('contacting ollama with ingredients:', ingredients.value);
     const response = await getRecipeSuggestions(ingredients.value);
     
     const parsedResponse = response.split('\n').map((line) => {
      const [name, time] = line.split('|');
      return { name: name?.trim() || '', time: time?.trim() || '' };
     });
     
     suggestions.value = response;
    console.log(parsedResponse);
  } catch (error) {
    console.error('Error fetching recipe suggestions:', error);
  }
};
</script>

<template>
  <h1>Cookgeir</h1>
  <input type="text" v-model="ingredients" placeholder="Enter ingredients, separated by commas" />
  <button @click="fetchRecipes">Get Recipe Suggestions</button>

  <p>{{ suggestions }}</p>
</template>

<style scoped></style>