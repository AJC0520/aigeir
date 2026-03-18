<script setup lang="ts">

</script>

<template>
    <div class="main-wrapper">
        <section class="title-container">
            <h1><span class="ai-title">AI</span>geir</h1>
        </section>

        <section class="nav-container">
            <div class="navbox red"></div>
            <div class="navbox purple"></div>
            <div class="navbox green"></div>
            <div class="navbox blue"></div>
        </section>
    </div>
</template>

<style scoped>

h1 {
    margin: 0;
    font-size: clamp(4rem, 12vw, 20rem);
    font-weight: 400;
    letter-spacing: -0.04em;
    line-height: 0.95;
}

.ai-title {
    font-weight: 700;
}

.title-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100%;
    text-align: center;
}

.main-wrapper {
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(320px, 1fr) minmax(320px, 560px);
    align-items: stretch;
    column-gap: clamp(2rem, 7vw, 8rem);
    padding: clamp(2rem, 4vw, 4rem) clamp(2rem, 7vw, 6rem);
    box-sizing: border-box;
    background: #fafafa;
    background: radial-gradient(circle,rgba(250, 250, 250, 1) 80%, rgba(133, 208, 255, 1) 100%);
}

.nav-container {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-self: stretch;
    min-height: 100%;
    width: 100%;
}

.navbox {
    width: 100%;
    height: clamp(85px, 12vh, 600px);
    border: 1px solid black;
}

@media (max-width: 980px) {
    .main-wrapper {
        grid-template-columns: 1fr;
        row-gap: 2rem;
    }

    .nav-container {
        min-height: auto;
        justify-content: flex-start;
        gap: 1rem;
    }

    .title-container {
        min-height: auto;
    }
}
</style>