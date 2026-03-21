<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ToolShowcase from '@/components/ToolShowcase.vue'
import cookgeirPreview from '@/assets/png/chef_cooking.png'

const dropped = ref(false)
const showExplore = ref(false)
const toolsAnchor = ref<HTMLElement | null>(null)

function scrollToTools() {
    toolsAnchor.value?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
    setTimeout(() => {
        dropped.value = true
    }, 800)
})

function onAnvilDropEnd() {
    showExplore.value = true
}

</script>

<template>
    <div class="home-shell">
        <section class="hero">
            <div class="hero-left">
                <h1 :class="{ 'title-impact': dropped }">
                    <span class="letter-a" :class="{ 'letter-a--bold': dropped }">A</span><!--
                    --><span class="swap">
                        <span class="swap__s" :class="{ 'swap__s--crushed': dropped }">s</span>
                        <span class="swap__i" :class="{ 'swap__i--drop': dropped }" @animationend="onAnvilDropEnd">I</span>
                    </span><!--
                    --><span class="title-geir" :class="{ 'title-geir--post-drop': dropped }">geir</span>
                </h1>
                <div class="hero-content" :class="{ 'hero-content--visible': showExplore }">
                    <p class="subtitle">A personal collection of AI-powered tools built for everyday tasks. Each tool is
                        designed to be simple, fast, and useful. </p>
                    <button class="toolbox-button" type="button" @click="scrollToTools">
                        <p>Explore</p>
                    </button>
                </div>
            </div>
            <div class="hero-right" :class="{ 'hero-right--visible': showExplore }">
                <div class="figure-container">
                    <img src="@/assets/png/figure.png" alt="figure" class="hero-figure" />
                    <div class="social-container">
                        <a href="https://github.com/AJC0520" target="_blank" rel="noopener noreferrer"><img src="@/assets/png/github_logo.png" alt="GitHub link" width="40px"></a>
                        <a href="https://www.linkedin.com/in/asgeir-jacobsen-96b95b325/" target="_blank" rel="noopener noreferrer"><img src="@/assets/png/linkedin_logo.png" alt="LinkedIn link" width="40px"></a>

                    </div>
                </div>
                </div>
        </section>
        <div id="tools" ref="toolsAnchor" class="tools-snap">
            <ToolShowcase
                name="Cookgeir"
                description="Your AI-powered kitchen companion. List your ingredients in the fridge and get a recipe in seconds."
                route="/cookgeir"
                background="#f5f5f0"
                :image-src="cookgeirPreview"
                image-alt="Cookgeir preview"
            />
            <ToolShowcase
                name="Tool 2"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut facilisis, quam ac volutpat scelerisque, quam diam commodo massa, at maximus leo nibh vehicula enim."
                route="/"
                background="#f0f2f5"
                reverse
            />
            <ToolShowcase
                name="Tool 3"
                description=". Nulla odio sapien, ornare in magna aliquam, ultrices convallis massa. Suspendisse placerat arcu nisl, eget fermentum arcu gravida et"
                route="/"
                background="#f3f0f5"
            />
        </div>
    </div>
</template>

<style scoped>
.home-shell {
    position: relative;
    background: #fafafa;
}

.tools-snap {
    scroll-snap-type: y mandatory;
    overflow-y: auto;
}

.figure-container {
    display: flex;
    flex-direction: column;
    gap: 1.8rem;
}

.social-container {
    display: flex;
    gap: 1.8rem;
    justify-content: center;
}

.social-container a {
    transition: transform 100ms ease-in-out;
}

.social-container a:hover {
    transform: translateY(-4px);
}
.hero {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 12vw;
    margin-bottom: 8vh;
    box-sizing: border-box;
    min-height: 100vh;
}

.hero-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
}

.hero-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 220ms ease, transform 220ms ease;
}

.hero-right--visible {
    opacity: 1;
    transform: translateY(0);
}

.hero-figure {
    max-height: 70vh;
    max-width: 40vw;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
}

h1 {
    margin: 0;
    font-size: clamp(4rem, 12vw, 20rem);
    font-weight: 400;
    letter-spacing: -0.04em;
    line-height: 0.95;
}

.subtitle {
    margin: 5rem 0 2rem;
    font-family: "Noto-sans", sans-serif;
    font-size: clamp(0.95rem, 1.4vw, 1.25rem);
    color: rgb(120, 120, 120);
    max-width: 480px;
    line-height: 1.6;
}


.title-geir--post-drop {
    animation: geir-snap 0s step-end 0.29s forwards;
}

@keyframes geir-snap {
    to {
        margin-left: -0.2em;
    }
}

.hero-content {
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 220ms ease, transform 220ms ease;
    pointer-events: none;
}

.hero-content--visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

.toolbox-button {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 1.4rem;
    color: #d8e5ef;
    background: rgba(6, 13, 24, 0.86);
    padding: 0.8rem 2rem;
    border: 1px solid #264a66;
    border-radius: 9999px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    isolation: isolate;
    transition: transform 0.15s ease, background 0.15s ease;
}

.toolbox-button p {
    margin: 0;
    position: relative;
    z-index: 1;
}

.toolbox-button::before {
    content: "";
    position: absolute;
    top: -35%;
    bottom: -35%;
    width: 38%;
    left: 0;
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.52) 50%,
            rgba(255, 255, 255, 0) 100%);
    transform: translateX(-180%) skewX(-24deg);
    z-index: 0;
    pointer-events: none;
    animation: explore-shine 2.9s ease-in-out infinite;
}

.toolbox-button:hover {
    transform: translateY(-2px);
    background: rgba(9, 22, 38, 0.96);
}

@keyframes explore-shine {
    0% {
        transform: translateX(-180%) skewX(-24deg);
        opacity: 0;
    }

    8% {
        opacity: 1;
    }

    30% {
        transform: translateX(290%) skewX(-24deg);
        opacity: 1;
    }

    38% {
        opacity: 0;
    }

    100% {
        transform: translateX(290%) skewX(-24deg);
        opacity: 0;
    }
}

.swap {
    display: inline-grid;
    overflow: visible;
}

.swap>span {
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
        opacity: 0;
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

    0%,
    100% {
        transform: translateY(0);
    }

    20% {
        transform: translateY(3px);
    }

    40% {
        transform: translateY(-2px);
    }

    60% {
        transform: translateY(1px);
    }

    80% {
        transform: translateY(-1px);
    }
}

@media (max-width: 980px) {
    .hero {
        flex-direction: column;
        align-items: flex-start;
        padding: 0 6vw;
    }

    .hero-right {
        justify-content: flex-start;
        margin-top: 3rem;
    }

    .hero-figure {
        max-width: 80vw;
        max-height: 40vh;
    }
}
</style>
