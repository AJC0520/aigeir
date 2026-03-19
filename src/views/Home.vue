<script setup lang="ts">
import { ref, onMounted } from 'vue'

const dropped = ref(false)

onMounted(() => {
    setTimeout(() => {
        dropped.value = true
    }, 800)
})
</script>

<template>
    <div class="main-wrapper">
        <section class="title-container">
            <h1 :class="{ 'title-impact': dropped }">
                <span class="letter-a" :class="{ 'letter-a--bold': dropped }">A</span><!--
                --><span class="swap">
                    <span class="swap__s" :class="{ 'swap__s--crushed': dropped }">s</span>
                    <span class="swap__i" :class="{ 'swap__i--drop': dropped }">I</span>
                </span><!--
                --><span>geir</span>
            </h1>
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

.title-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100%;
    text-align: center;
    overflow: visible;
}

.main-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    background: #fafafa;
    background: radial-gradient(circle,rgba(250, 250, 250, 1) 70%, rgba(133, 208, 255, 1) 100%);
}


.swap {
    display: inline-grid;
    overflow: visible;
}

.swap > span {
    grid-area: 1 / 1;
}

.swap__s {
    transform-origin: bottom center;
}

.swap__s--crushed {
    animation: crush 0.12s ease-in 0.29s forwards;
}

@keyframes crush {
    0% {
        opacity: 1;
        transform: scaleY(1) scaleX(1);
    }
    100% {
        opacity: 0.15;
        transform: scaleY(0.15) scaleX(1.5);
    }
}

.swap__i {
    font-weight: 700;
    opacity: 0;
    transform: translateY(-500%);
    will-change: transform, opacity;
}

.swap__i--drop {
    animation: anvil-drop 0.7s linear forwards;
}

@keyframes anvil-drop {
    0% {
        transform: translateY(-500%);
        opacity: 0;
    }
    4% {
        transform: translateY(-470%);
        opacity: 1;
    }
    14% {
        transform: translateY(-350%);
        opacity: 1;
    }
    26% {
        transform: translateY(-180%);
    }
    38% {
        transform: translateY(-40%);
    }
    42% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-7%);
    }
    60% {
        transform: translateY(0);
    }
    70% {
        transform: translateY(-3%);
    }
    82% {
        transform: translateY(0);
    }
    90% {
        transform: translateY(-1%);
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

.letter-a {
    font-weight: 400;
}

.letter-a--bold {
    animation: to-bold 0.01s step-end 0.29s forwards;
}

@keyframes to-bold {
    to {
        font-weight: 700;
    }
}

.title-impact {
    animation: impact-shake 0.35s ease-out 0.29s;
}

@keyframes impact-shake {
    0%, 100% { transform: translateY(0); }
    20% { transform: translateY(3px); }
    40% { transform: translateY(-2px); }
    60% { transform: translateY(1px); }
    80% { transform: translateY(-1px); }
}

/* --- End anvil animation --- */

@media (max-width: 980px) {
    .title-container {
        min-height: auto;
    }
}
</style>