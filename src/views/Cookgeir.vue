<script setup lang="ts">
import { getRecipeSuggestions, getRecipeDetails } from '@/utils/ollama';
import { ref } from 'vue';
import SuggestionCard from '@/components/SuggestionCard.vue';

const ingredients = ref('');
const suggestions = ref('');
const parsedResponse = ref<Array<{ name: string; time: string }>>([]);
const parsedRecipeDetails = ref<{ name: string; ingredients: Array<{ name: string; quantity: string }>; instructions: string[] } | null>(null);

const fetchRecipes = async () => {
  try {
    console.log('contacting ollama with ingredients:', ingredients.value);
    const response = await getRecipeSuggestions(ingredients.value);

    parsedResponse.value = response.split('\n').map((line) => {
      const [name, time] = line.split('|');
      return { name: name?.trim() || '', time: time?.trim() || '' };
    });

    suggestions.value = response;
    console.log(parsedResponse.value);
  } catch (error) {
    console.error('Error fetching recipe suggestions:', error);
  }
};

const handleCardClick = async (name: string | undefined) => {
  console.log('Card clicked:', name);

  try {
    console.log('Fetching details for recipe:', name);
    const response = await getRecipeDetails(name || '', ingredients.value);;
    console.log('Recipe details response:', response);
    
    const cleaned = response.replace(/```json|```/g, '').trim()
    const parsedDetails = JSON.parse(cleaned)
    
    parsedRecipeDetails.value = {
      name: name || '',
      ingredients: Array.isArray(parsedDetails.ingredients) ? parsedDetails.ingredients : [],
      instructions: Array.isArray(parsedDetails.instructions) ? parsedDetails.instructions : [],
    };


  } catch (error) {
    console.error('Error fetching recipe details:', error);
  }
};

</script>

<template>
  <div class="aigeir-wrapper">
    <h1>Cookgeir</h1>
    <input type="text" v-model="ingredients" placeholder="Enter ingredients, separated by commas" />
    <button @click="fetchRecipes">Get Recipe Suggestions</button>

    <div class="suggestions-wrapper" v-if="parsedResponse.length > 0">
      <SuggestionCard :name="parsedResponse[0]?.name ?? ''" :time="parsedResponse[0]?.time ?? ''"
        @click="handleCardClick(parsedResponse[0]?.name ?? '')" />
      <SuggestionCard :name="parsedResponse[1]?.name ?? ''" :time="parsedResponse[1]?.time ?? ''"
        @click="handleCardClick(parsedResponse[1]?.name ?? '')" />
      <SuggestionCard :name="parsedResponse[2]?.name ?? ''" :time="parsedResponse[2]?.time ?? ''"
        @click="handleCardClick(parsedResponse[2]?.name ?? '')" />
    </div>

    <div class="recipe-details" v-if="parsedRecipeDetails">
      <h2>{{ parsedRecipeDetails.name }}</h2>
      
      <ul>
        <li v-for="ingredient in parsedRecipeDetails.ingredients" :key="ingredient.name">
          {{ ingredient.name }} - {{ ingredient.quantity }}
        </li>
      </ul>
      <ol>
        <li v-for="instruction in parsedRecipeDetails.instructions" :key="instruction">
          {{ instruction }}
        </li>
      </ol>

    </div>

  </div>
</template>

<style scoped>
.aigeir-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
}

.suggestions-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
}

button {
  font-family: "Rubik", sans-serif;
}

</style>