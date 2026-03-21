<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
    name: string
    description: string
    route: string
    background?: string
    reverse?: boolean
    imageSrc?: string
    imageAlt?: string
}>()

const sectionEl = ref<HTMLElement | null>(null)
const visible = ref(false)

onMounted(() => {
    if (!sectionEl.value) return
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry?.isIntersecting) {
                visible.value = true
                observer.disconnect()
            }
        },
        { threshold: 0.2 }
    )
    observer.observe(sectionEl.value)
})
</script>

<template>
    <section
        ref="sectionEl"
        class="showcase"
        :class="{ 'showcase--visible': visible, 'showcase--reverse': reverse }"
        :style="{ background: background || '#fafafa' }"
        @click="router.push(route)"
    >
        <div class="showcase__text">
            <h2 class="showcase__name">{{ name }}</h2>
            <p class="showcase__desc">{{ description }}</p>
        </div>
        <div class="showcase__visual">
            <div class="showcase__placeholder" :class="{ 'showcase__placeholder--image': props.imageSrc }">
                <img
                    v-if="props.imageSrc"
                    :src="props.imageSrc"
                    :alt="props.imageAlt || `${name} preview`"
                    class="showcase__image"
                />
                <slot v-else />
            </div>
        </div>
    </section>
</template>

<style scoped>
.showcase {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12vw;
    box-sizing: border-box;
    gap: 6vw;
    cursor: pointer;
    scroll-snap-align: start;
}

.showcase--reverse {
    flex-direction: row-reverse;
}

/* ---------- text side ---------- */
.showcase__text {
    flex: 1;
    opacity: 0;
    transform: translateX(-60px);
    transition: opacity 600ms ease, transform 600ms ease;
}

.showcase--reverse .showcase__text {
    transform: translateX(60px);
}

.showcase--visible .showcase__text {
    opacity: 1;
    transform: translateX(0);
}

.showcase__name {
    margin: 0;
    font-size: clamp(2.8rem, 6vw, 5.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
    color: #111;
}

.showcase__desc {
    margin: 1.5rem 0 2rem;
    font-family: "Noto-sans", sans-serif;
    font-size: clamp(0.95rem, 1.3vw, 1.2rem);
    color: rgb(120, 120, 120);
    max-width: 420px;
    line-height: 1.6;
}

.showcase__cta {
    font-family: "Noto-sans", sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    transition: color 150ms ease;
}

.showcase:hover .showcase__cta {
    color: #000;
}

/* ---------- visual side ---------- */
.showcase__visual {
    flex: 1;
    display: flex;
    justify-content: center;
    opacity: 0;
    transform: translateX(60px);
    transition: opacity 600ms ease 100ms, transform 600ms ease 100ms;
}

.showcase--reverse .showcase__visual {
    transform: translateX(-60px);
}

.showcase--visible .showcase__visual {
    opacity: 1;
    transform: translateX(0);
}

.showcase__placeholder {
    width: 100%;
    max-width: 400px;
    height: 400px;
    border-radius: 1.5rem;
    background: rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.showcase__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.showcase__placeholder--image {
    width: auto;
    max-width: min(48vw, 760px);
    height: min(78vh, 760px);
    background: transparent;
    border-radius: 0;
    overflow: visible;
}

/* ---------- responsive ---------- */
@media (max-width: 980px) {
    .showcase {
        flex-direction: column !important;
        padding: 8vh 6vw;
        gap: 3rem;
        height: auto;
        min-height: 100vh;
    }

    .showcase__text {
        transform: translateY(40px);
    }

    .showcase--reverse .showcase__text {
        transform: translateY(40px);
    }

    .showcase__visual {
        transform: translateY(40px);
    }

    .showcase--reverse .showcase__visual {
        transform: translateY(40px);
    }

    .showcase--visible .showcase__text,
    .showcase--visible .showcase__visual {
        transform: translateY(0);
    }

    .showcase__placeholder {
        max-width: 100%;
        height: 300px;
    }

    .showcase__placeholder--image {
        max-width: 90vw;
        height: min(60vh, 520px);
    }
}
</style>
