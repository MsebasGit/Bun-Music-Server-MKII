<!-- src/components/ui/TextCard.svelte -->
<script lang="ts">
    import { Card } from "flowbite-svelte";

    export let href: string;
    export let title: string;
    export let subtitle: string | null = null;
</script>

<div class="relative group">
    <!-- Actions Slot -->
    <div class="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <slot name="actions" />
    </div>

    <!-- Card Content -->
    <Card class="p-6 h-full">
        <h5 class="mb-1 text-md font-bold tracking-tight text-gray-900 dark:text-white truncate">
            <a {href} class="hover:underline before:absolute before:inset-0">
                {title}
            </a>
        </h5>
        {#if subtitle}
            <p class="font-normal text-sm text-gray-700 dark:text-gray-400 truncate">
                {subtitle}
            </p>
        {/if}
    </Card>
</div>
