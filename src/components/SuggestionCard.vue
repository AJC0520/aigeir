<script setup lang="ts">
defineProps<{
  name: string
  time: string
}>()
</script>

<template>
  <div class="recipe-card">
    <div class="recipe-card__accent"></div>
    <div class="recipe-card__content">
      <h3 class="recipe-card__name">{{ name }}</h3>
      <div class="recipe-card__footer">
        <span class="recipe-card__time-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </span>
        <span class="recipe-card__time">{{ time }}</span>
      </div>
    </div>
    <div class="recipe-card__arrow">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  display: flex;
  align-items: stretch;
  background: rgba(253, 246, 236, 0.6);
  border: 1px solid rgba(26, 58, 42, 0.1);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 280ms ease,
              border-color 280ms ease;
}

.recipe-card:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 8px 28px rgba(26, 58, 42, 0.1), 0 2px 8px rgba(196, 101, 42, 0.08);
  border-color: rgba(196, 101, 42, 0.25);
}

.recipe-card:hover .recipe-card__accent {
  background: #c4652a;
}

.recipe-card:hover .recipe-card__arrow {
  opacity: 1;
  transform: translateX(0);
}



.recipe-card__content {
  flex: 1;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.recipe-card__name {
  margin: 0;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a3a2a;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.recipe-card__footer {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.recipe-card__time-icon {
  color: #c4652a;
  display: flex;
  align-items: center;
}

.recipe-card__time {
  font-family: "DM Sans", sans-serif;
  font-size: 0.82rem;
  color: rgba(26, 58, 42, 0.55);
  font-weight: 500;
}

.recipe-card__arrow {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  color: #c4652a;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 280ms ease, transform 280ms ease;
}
</style>
