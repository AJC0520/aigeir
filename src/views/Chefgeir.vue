<script setup lang="ts">
import { getRecipeSuggestions, getRecipeDetails } from '@/utils/ollama';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import SuggestionCard from '@/components/SuggestionCard.vue';
import chefThinking from '@/assets/png/chef_thinking.png';
import chefCooking from '@/assets/png/chef_cooking.png';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-vue-next';

const router = useRouter()
const ingredientInput = ref('');
const ingredientArray = ref<string[]>([])
const suggestions = ref('');
const loading = ref(false);
const suggestionsLoading = ref(false);
const parsedResponse = ref<Array<{ name: string; time: string }>>([]);
const parsedRecipeDetails = ref<{ name: string; ingredients: Array<{ name: string; quantity: string }>; instructions: string[] } | null>(null);
const pickedRecipe = ref<string | null>(null);

const ingredientCount = computed(() => ingredientArray.value.length)

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
  <div class="chefgeir-page">
    <!-- grain overlay -->
    <div class="grain-overlay"></div>

    <header class="chefgeir-header">
      <button class="back-button" @click="router.push('/')" aria-label="Back to home">
        <ArrowLeft :size="20" />
      </button>
      <div class="header-text">
        <h1 class="header-title">Chefgeir</h1>
        <p class="header-subtitle">Tell me what's in your fridge and I'll figure out dinner.</p>
      </div>
    </header>

    <main class="chefgeir-body">
      <Transition name="recipe-fade">
        <div class="input-section" v-if="!pickedRecipe">
          <div class="section-label">
            <span class="section-label__text">Enter your ingredients</span>
          </div>

          <div class="input-row">
            <div class="input-wrapper">
              <input
                type="text"
                v-model="ingredientInput"
                placeholder="e.g. chicken thighs"
                @keydown="handleInputKeydown"
              />
              <span class="input-hint" v-if="!ingredientInput">press enter to add</span>
            </div>
            <button class="add-button" @click="addIngredient" :disabled="!ingredientInput.trim()">
              <Plus :size="20" />
            </button>
          </div>

          <TransitionGroup name="tag" tag="div" class="ingredient-tags" v-if="ingredientArray.length > 0">
            <span
              class="tag"
              v-for="(ingredient, index) in ingredientArray"
              :key="ingredient"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <span class="tag__dot"></span>
              {{ ingredient }}
              <button class="tag-remove" @click="removeIngredient(index)" aria-label="Remove ingredient">&times;</button>
            </span>
          </TransitionGroup>

          <div class="action-row">
            <button
              class="cook-button"
              @click="fetchRecipes"
              :disabled="ingredientCount < 3 || suggestionsLoading"
            >
              <span v-if="suggestionsLoading" class="spinner"></span>
              <template v-else>
                <span>Find me recipes</span>
                <ArrowRight :size="20" />
              </template>
            </button>
            <p class="ingredient-hint" v-if="ingredientCount < 3 && ingredientCount > 0">
              {{ 3 - ingredientCount }} more ingredient{{ 3 - ingredientCount !== 1 ? 's' : '' }} needed
            </p>
          </div>
        </div>
      </Transition>

      <Transition name="recipe-fade">
        <div class="suggestions-area" v-if="parsedResponse.length > 0 && !pickedRecipe">
          <div class="suggestions-col">
            <div class="section-label">
              <span class="section-label__text">Pick a Recipe</span>
            </div>

            <div class="suggestions-wrapper">
              <TransitionGroup name="card">
                <SuggestionCard
                  v-for="(item, i) in parsedResponse"
                  :key="item.name"
                  :name="item.name"
                  :time="item.time"
                  :style="{ animationDelay: `${i * 120}ms` }"
                  @click="handleCardClick(item.name)"
                />
              </TransitionGroup>
            </div>
          </div>

          <div class="chef-area">
            <div class="speech-bubble">
              <p>Based on your ingredients, here are <strong>3 ideas</strong> I think you'll love!</p>
            </div>
            <img :src="chefThinking" alt="Chef pondering" class="chef-image" />
          </div>
        </div>
      </Transition>

      <Transition name="recipe-fade">
        <div v-if="pickedRecipe" class="recipe-section">
          <button class="start-over-button" @click="startOver">
          <ArrowLeft :size="15" />
            Start again
          </button>

          <div class="recipe-hero">
            <h2 class="recipe-title">{{ pickedRecipe }}</h2>
          </div>

          <div v-if="loading" class="recipe-loader">
            <div class="recipe-loader__track">
              <div class="recipe-loader__bar"></div>
            </div>
            <div class="recipe-loader__text">
              <img :src="chefCooking" alt="Chef cooking" class="loader-chef" />
              <span>Preparing your recipe...</span>
            </div>
          </div>

          <Transition name="recipe-fade">
            <div class="recipe-details" v-if="parsedRecipeDetails">
              <div class="recipe-details__grid">
                <div class="recipe-details__ingredients">
                  <h3 class="recipe-details__heading">
                    <span class="recipe-details__heading-accent">Ingredients</span>
                  </h3>
                  <ul>
                    <li
                      v-for="(ingredient, i) in parsedRecipeDetails.ingredients"
                      :key="ingredient.name"
                      :style="{ animationDelay: `${i * 60}ms` }"
                      class="ingredient-item"
                    >
                      <span class="ingredient-item__quantity">{{ ingredient.quantity }}</span>
                      <span class="ingredient-item__name">{{ ingredient.name }}</span>
                    </li>
                  </ul>
                </div>

                <div class="recipe-details__instructions">
                  <h3 class="recipe-details__heading">
                    <span class="recipe-details__heading-accent">Instructions</span>
                  </h3>
                  <ol>
                    <li
                      v-for="(instruction, i) in parsedRecipeDetails.instructions"
                      :key="instruction"
                      :style="{ animationDelay: `${i * 80}ms` }"
                      class="instruction-item"
                    >
                      <span class="instruction-item__number">{{ String(i + 1).padStart(2, '0') }}</span>
                      <span class="instruction-item__text">{{ instruction }}</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
/* ===================================
   CSS CUSTOM PROPERTIES
   =================================== */
.chefgeir-page {
  --color-cream: #fdf6ec;
  --color-cream-deep: #f5e6ce;
  --color-forest: #1a3a2a;
  --color-forest-soft: rgba(26, 58, 42, 0.7);
  --color-forest-muted: rgba(26, 58, 42, 0.4);
  --color-forest-faint: rgba(26, 58, 42, 0.08);
  --color-terracotta: #c4652a;
  --color-terracotta-soft: rgba(196, 101, 42, 0.12);
  --color-olive: #5a7a52;
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "DM Sans", "Noto Sans", sans-serif;
}

/* ===================================
   PAGE & GRAIN OVERLAY
   =================================== */
.chefgeir-page {
  min-height: 100vh;
  background: var(--color-cream);
  font-family: var(--font-body);
  color: var(--color-forest);
  position: relative;
}

.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  opacity: 0.3;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
}

/* ===================================
   HEADER
   =================================== */
.chefgeir-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2.5rem 10vw 2rem;
  border-bottom: 1px solid var(--color-forest-faint);
  position: relative;
  z-index: 1;
}

.back-button {
  background: none;
  border: 1px solid var(--color-forest-faint);
  color: var(--color-forest-soft);
  cursor: pointer;
  padding: 0.55rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
  flex-shrink: 0;
}

.back-button:hover {
  background: var(--color-forest-faint);
  border-color: var(--color-forest-muted);
  color: var(--color-forest);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.header-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--color-forest);
  font-style: italic;
}

.header-subtitle {
  margin: 0;
  font-size: clamp(0.82rem, 1.1vw, 0.95rem);
  color: var(--color-forest-muted);
  line-height: 1.5;
  font-weight: 400;
}

/* ===================================
   BODY
   =================================== */
.chefgeir-body {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  position: relative;
  z-index: 1;
}

/* ===================================
   SECTION LABELS
   =================================== */
.section-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.section-label__text {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-forest-muted);
}

/* ===================================
   INPUT SECTION
   =================================== */
.input-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeSlideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.input-row {
  display: flex;
  gap: 0.6rem;
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.input-wrapper input {
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 0.9rem 1.2rem;
  border: 1px solid var(--color-forest-faint);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--color-forest);
  outline: none;
  transition: border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.input-wrapper input::placeholder {
  color: var(--color-forest-muted);
  font-style: italic;
}

.input-wrapper input:focus {
  border-color: var(--color-olive);
  box-shadow: 0 0 0 3px rgba(90, 122, 82, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.input-hint {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7rem;
  color: var(--color-forest-muted);
  letter-spacing: 0.02em;
  pointer-events: none;
  opacity: 0.6;
}

.add-button {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-forest-faint);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--color-forest-soft);
  cursor: pointer;
  transition: all 200ms ease;
}

.add-button:hover:not(:disabled) {
  background: var(--color-forest);
  border-color: var(--color-forest);
  color: var(--color-cream);
}

.add-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ===================================
   INGREDIENT TAGS
   =================================== */
.ingredient-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 2rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.85rem 0.45rem 0.65rem;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid var(--color-forest-faint);
  border-radius: 9999px;
  font-size: 0.84rem;
  color: var(--color-forest);
  font-weight: 500;
  animation: tagPop 350ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.tag__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-olive);
  flex-shrink: 0;
}

.tag-remove {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: var(--color-forest-muted);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 150ms ease, transform 150ms ease;
  margin-left: 0.1rem;
}

.tag-remove:hover {
  color: var(--color-terracotta);
  transform: scale(1.2);
}

/* tag transition */
.tag-enter-active {
  transition: opacity 300ms ease, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tag-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.tag-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(4px);
}
.tag-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

/* ===================================
   ACTION ROW
   =================================== */
.action-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.cook-button {
  font-family: var(--font-body);
  font-size: 0.92rem;
  font-weight: 600;
  padding: 0.85rem 1.8rem;
  border: none;
  border-radius: 12px;
  background: var(--color-forest);
  color: var(--color-cream);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.01em;
}

.cook-button:hover:not(:disabled) {
  background: #0f2a1c;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 58, 42, 0.25);
}

.cook-button:active:not(:disabled) {
  transform: translateY(0);
}

.cook-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.ingredient-hint {
  font-size: 0.8rem;
  color: var(--color-terracotta);
  font-weight: 500;
  margin: 0;
  font-style: italic;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(253, 246, 236, 0.3);
  border-top-color: var(--color-cream);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===================================
   SUGGESTIONS AREA
   =================================== */
.suggestions-area {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 3rem;
  animation: fadeSlideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.suggestions-col {
  flex: 1;
}

.suggestions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ===================================
   CHEF AREA
   =================================== */
.chef-area {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding-top: 3rem;
}

.speech-bubble {
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--color-forest-faint);
  border-radius: 16px;
  padding: 1rem 1.3rem;
  max-width: 240px;
  text-align: center;
  backdrop-filter: blur(8px);
  animation: fadeSlideUp 500ms 300ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.speech-bubble p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-forest-soft);
  line-height: 1.55;
}

.speech-bubble strong {
  color: var(--color-terracotta);
  font-weight: 600;
}

.speech-bubble::after {
  content: "";
  position: absolute;
  bottom: -7px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid rgba(255, 255, 255, 0.8);
}

.speech-bubble::before {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--color-forest-faint);
}

.chef-image {
  height: 500px;
  object-fit: contain;
  opacity: 0.85;
  animation: chefFloat 4s ease-in-out infinite;
}

@keyframes chefFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* ---------- card transition ---------- */
.card-enter-active,
.card-leave-active {
  transition: opacity 300ms ease, transform 300ms ease;
}

.card-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(8px);
}

/* ---------- recipe fade ---------- */
.recipe-fade-enter-active {
  transition: opacity 500ms ease, transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
}

.recipe-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* ===================================
   RECIPE SECTION
   =================================== */
.recipe-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: fadeSlideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.start-over-button {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 500;
  padding: 0.55rem 1rem;
  border: 1px solid var(--color-forest-faint);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.5);
  color: var(--color-forest-soft);
  cursor: pointer;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 200ms ease;
  margin-bottom: 2rem;
}

.start-over-button:hover {
  background: rgba(255, 255, 255, 0.8);
  border-color: var(--color-forest-muted);
  color: var(--color-forest);
}

/* ===================================
   RECIPE HERO
   =================================== */
.recipe-hero {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-forest-faint);
}


.recipe-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 700;
  font-style: italic;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--color-forest);
  line-height: 1.15;
}

/* ===================================
   LOADING BAR
   =================================== */
.recipe-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 0;
}

.recipe-loader__track {
  width: 100%;
  max-width: 280px;
  height: 3px;
  background: var(--color-forest-faint);
  border-radius: 4px;
  overflow: hidden;
}

.recipe-loader__bar {
  width: 40%;
  height: 100%;
  background: var(--color-terracotta);
  border-radius: 4px;
  animation: loader-slide 1.4s ease-in-out infinite;
}

.recipe-loader__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.recipe-loader__text span {
  font-size: 0.82rem;
  font-style: italic;
  color: var(--color-forest-muted);
}

.loader-chef {
  height: 120px;
  object-fit: contain;
  opacity: 0.6;
  animation: chefFloat 3s ease-in-out infinite;
}

@keyframes loader-slide {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(250%); }
  100% { transform: translateX(-100%); }
}

/* ===================================
   RECIPE DETAILS
   =================================== */
.recipe-details {
  width: 100%;
}

.recipe-details__grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
}

.recipe-details__heading {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  font-style: italic;
  color: var(--color-forest);
  margin: 0 0 1.25rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid var(--color-terracotta-soft);
}

.recipe-details__heading-accent {
  position: relative;
}

.recipe-details__ingredients ul,
.recipe-details__instructions ol {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* ---------- ingredients ---------- */
.ingredient-item {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--color-forest-faint);
  animation: fadeSlideUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.ingredient-item__quantity {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  font-style: italic;
  color: var(--color-terracotta);
  min-width: 5rem;
  flex-shrink: 0;
}

.ingredient-item__name {
  font-size: 0.9rem;
  color: var(--color-forest-soft);
}

/* ---------- instructions ---------- */
.instruction-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-forest-faint);
  animation: fadeSlideUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.instruction-item__number {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  font-style: italic;
  color: var(--color-forest-faint);
  line-height: 1.4;
  flex-shrink: 0;
  min-width: 2rem;
}

.instruction-item__text {
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--color-forest-soft);
}

/* ===================================
   ANIMATIONS
   =================================== */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes tagPop {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===================================
   RESPONSIVE
   =================================== */
@media (max-width: 768px) {
  .chefgeir-header {
    padding: 2rem 6vw 1.5rem;
  }

  .chefgeir-body {
    padding: 2rem 5vw 3rem;
  }

  .suggestions-area {
    flex-direction: column;
  }

  .chef-area {
    padding-top: 1rem;
    flex-direction: row-reverse;
    gap: 1rem;
  }

  .chef-image {
    height: 160px;
  }

  .speech-bubble {
    max-width: 200px;
  }

  .speech-bubble::after,
  .speech-bubble::before {
    display: none;
  }

  .recipe-details__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .input-hint {
    display: none;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 1.8rem;
  }

  .chef-area {
    flex-direction: column;
  }

  .recipe-title {
    font-size: 1.6rem;
  }
}
</style>
