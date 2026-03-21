<script setup lang="ts">
defineProps<{
  name: string
  time: string
}>()
</script>

<template>

    <div class="card-wrapper">
        <h1>{{ name }}</h1>
        <p>Cooking Time: {{ time }}</p>
    </div>

</template>

<style scoped>

.card-wrapper {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    background-color: #f9f9f9;
    width: 100%;
    text-align: center;
    transition: ease-in-out 0.1s;

    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 160px;
}

.card-wrapper:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    cursor: pointer;
}

.card-wrapper p {
    margin: 8px 0 0;
    margin-top: auto;
    text-align: center;
}
</style>