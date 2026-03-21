<script setup lang="ts">
import { getRecipeSuggestions, getRecipeDetails } from '@/utils/ollama';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SuggestionCard from '@/components/SuggestionCard.vue';
import chefThinking from '@/assets/png/chef_thinking.png';

const router = useRouter()
const ingredientInput = ref('');
const ingredientArray = ref<string[]>([])
const suggestions = ref('');
const loading = ref(false);
const suggestionsLoading = ref(false);
const parsedResponse = ref<Array<{ name: string; time: string }>>([]);
const parsedRecipeDetails = ref<{ name: string; ingredients: Array<{ name: string; quantity: string }>; instructions: string[] } | null>(null);
const pickedRecipe = ref<string | null>(null);

const fetchRecipes = async () => {
  try {
    suggestionsLoading.value = true;
    const parsedIngredients = ingredientArray.value.join(", ")
    const response = await getRecipeSuggestions(parsedIngredients);

    parsedResponse.value = response.split('\n').map((line) => {
      const [name, time] = line.split('|');
      return { name: name?.trim() || '', time: time?.trim() || '' };
    });

    suggestions.value = response;
  } catch (error) {
    console.error('Error fetching recipe suggestions:', error);
  } finally {
    suggestionsLoading.value = false;
  }
};

const handleCardClick = async (name: string | undefined) => {
  pickedRecipe.value = name || null;
  try {
    loading.value = true;
    const parsedIngredients = ingredientArray.value.join(", ")
    const response = await getRecipeDetails(name || '', parsedIngredients);

    const cleaned = response.replace(/```json|```/g, '').trim()
    const parsedDetails = JSON.parse(cleaned)

    parsedRecipeDetails.value = {
      name: name || '',
      ingredients: Array.isArray(parsedDetails.ingredients) ? parsedDetails.ingredients : [],
      instructions: Array.isArray(parsedDetails.instructions) ? parsedDetails.instructions : [],
    };
  } catch (error) {
    console.error('Error fetching recipe details:', error);
  } finally {
    loading.value = false;
  }
};


const addIngredient = () => {
  if (ingredientInput.value.trim()) {
    ingredientArray.value.push(ingredientInput.value.trim())
    ingredientInput.value = ""
  }
}

const removeIngredient = (index: number) => {
  ingredientArray.value.splice(index, 1)
}

const handleInputKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    addIngredient()
  }
}

const startOver = () => {
  pickedRecipe.value = null;
  parsedRecipeDetails.value = null;
  parsedResponse.value = [];
  suggestions.value = '';
  loading.value = false;
}

</script>

<template>
  <div class="cookgeir-page">
    <header class="cookgeir-header">
      <button class="back-button" @click="router.push('/')">
        &larr;
      </button>
      <div class="header-text">
        <h1 class="header-title">Cookgeir</h1>
        <p class="header-subtitle">Tell me what's in your fridge and I'll figure out dinner.</p>
      </div>
    </header>

    <main class="cookgeir-body">
      <Transition name="recipe-fade">
        <div class="input-section" v-if="!pickedRecipe">
          <div class="input-row">
            <input
              type="text"
              v-model="ingredientInput"
              placeholder="Add an ingredient..."
              @keydown="handleInputKeydown"
            />
            <button class="add-button" @click="addIngredient">Add</button>
          </div>

          <div class="ingredient-tags" v-if="ingredientArray.length > 0">
            <span
              class="tag"
              v-for="(ingredient, index) in ingredientArray"
              :key="ingredient"
            >
              {{ ingredient }}
              <button class="tag-remove" @click="removeIngredient(index)">&times;</button>
            </span>
          </div>

          <span class="button-container">
            <button
              class="cook-button"
              @click="fetchRecipes"
              :disabled="ingredientArray.length < 3 || suggestionsLoading"
            >
              <span v-if="suggestionsLoading" class="spinner"></span>
              <span v-else>Get recipes</span>
            </button>
            <p v-if="ingredientArray.length < 3">Add at least 3 ingredients.</p>
          </span>
        </div>
      </Transition>

      <Transition name="recipe-fade">
        <div class="suggestions-area" v-if="parsedResponse.length > 0 && !pickedRecipe">
          <div class="suggestions-wrapper">
            <TransitionGroup name="card">
              <SuggestionCard
                v-for="item in parsedResponse"
                :key="item.name"
                :name="item.name"
                :time="item.time"
                @click="handleCardClick(item.name)"
              />
            </TransitionGroup>
          </div>

          <div class="chef-area">
            <div class="speech-bubble">
              <p>Based on your ingredients, I have these 3 suggestions!</p>
            </div>
            <img :src="chefThinking" alt="Chef pondering" class="chef-image" />
          </div>
        </div>
      </Transition>

      <Transition name="recipe-fade">
        <div v-if="pickedRecipe" class="recipe-section">
          <h2 class="recipe-title">{{ pickedRecipe }}</h2>

          <div v-if="loading" class="recipe-loader">
            <div class="recipe-loader__bar"></div>
          </div>

          <Transition name="recipe-fade">
            <div class="recipe-details" v-if="parsedRecipeDetails">
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
          </Transition>

          <button class="start-over-button" @click="startOver">Start over</button>
        </div>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.cookgeir-page {
  min-height: 100vh;
  background: #fafafa;
  font-family: "Noto-sans", sans-serif;
}

.cookgeir-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 3rem 12vw 2.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.back-button {
  background: none;
  border: none;
  font-size: 1.6rem;
  color: #333;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 0.5rem;
  transition: background 120ms ease;
  line-height: 1;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.header-title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  color: #111;
}

.header-subtitle {
  margin: 0;
  font-size: clamp(0.85rem, 1.2vw, 1rem);
  color: rgb(140, 140, 140);
  line-height: 1.5;
}

.cookgeir-body {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.input-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-row {
  display: flex;
  gap: 0.5rem;
}

.input-row input {
  flex: 1;
  font-family: "Noto-sans", sans-serif;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.75rem;
  background: #fff;
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.input-row input::placeholder {
  color: #bbb;
}

.input-row input:focus {
  border-color: #aaa;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.04);
}

.add-button {
  font-family: "Noto-sans", sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  border: 1px solid #ddd;
  border-radius: 0.75rem;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
}

.add-button:hover {
  background: #f0f0f0;
  border-color: #ccc;
}

.button-container {
  display: flex;
  gap: 15px;
  color: rgb(140, 140, 140);
}

.ingredient-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  background: #f0f0f0;
  border-radius: 9999px;
  font-size: 0.85rem;
  color: #333;
}

.tag-remove {
  background: none;
  border: none;
  font-size: 1rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 100ms ease;
}

.tag-remove:hover {
  color: #555;
}

.cook-button {
  font-family: "Noto-sans", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.85rem 2rem;
  border: none;
  border-radius: 9999px;
  background: rgba(6, 13, 24, 0.86);
  color: #d8e5ef;
  cursor: pointer;
  align-self: flex-start;
  transition: background 150ms ease, transform 150ms ease, opacity 150ms ease;
}

.cook-button:hover:not(:disabled) {
  background: rgba(9, 22, 38, 0.96);
  transform: translateY(-1px);
}

.cook-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.suggestions-area {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
}

.suggestions-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chef-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.speech-bubble {
  position: relative;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 1rem;
  padding: 0.8rem 1.2rem;
  max-width: 280px;
  text-align: center;
}

.speech-bubble p {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
}

.speech-bubble::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #fff;
}

.speech-bubble::before {
  content: "";
  position: absolute;
  bottom: -9px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-top: 9px solid #e0e0e0;
}

.chef-image {
  height: 600px;
  object-fit: contain;
}

/* ---------- card leave transition ---------- */
.card-enter-active,
.card-leave-active {
  transition: opacity 300ms ease, transform 300ms ease;
}

.card-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(8px);
}

/* ---------- recipe fade in ---------- */
.recipe-fade-enter-active {
  transition: opacity 400ms ease, transform 400ms ease;
}

.recipe-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

/* ---------- recipe section ---------- */
.recipe-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recipe-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
  text-align: center;
  color: #111;
}

/* ---------- loading bar ---------- */
.recipe-loader {
  width: 100%;
  max-width: 320px;
  height: 3px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.recipe-loader__bar {
  width: 40%;
  height: 100%;
  background: #333;
  border-radius: 4px;
  animation: loader-slide 1.2s ease-in-out infinite;
}

@keyframes loader-slide {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(200%); }
  100% { transform: translateX(-100%); }
}

.start-over-button {
  margin-top: 2rem;
  font-family: "Noto-sans", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 9999px;
  background: #fff;
  color: #555;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
}

.start-over-button:hover {
  background: #f0f0f0;
  border-color: #ccc;
  color: #333;
}

.recipe-details {
  width: 100%;
  line-height: 1.7;
}

.recipe-details ul,
.recipe-details ol {
  padding-left: 1.25rem;
}

.recipe-details li {
  margin-bottom: 0.4rem;
}

@media (max-width: 640px) {
  .cookgeir-header {
    padding: 2rem 6vw 1.5rem;
  }

  .cookgeir-body {
    padding: 2rem 6vw 3rem;
  }

  .suggestions-area {
    flex-direction: column;
  }
}
</style>
