<script setup lang="ts">
import { computed } from 'vue'
import { FreeArea } from '../models/FreeArea'
import { Partition } from '../models/Partition'
import { MemoryArea } from '../models/MemoryArea'
import { OperatingSystem } from '../models/OperatingSystem'

const props = defineProps<{
  operatingSystem: OperatingSystem
  freeAreas: FreeArea[]
  partitions: Partition[]
}>()

const totalSize =
  props.operatingSystem.size +
  props.freeAreas.reduce((partSum, fa) => partSum + fa.size, 0) +
  props.partitions.reduce((partSum, p) => partSum + p.size, 0)

const isFragmented = computed(() => {
  return props.freeAreas.length > 1
})

const memoryAreas = computed(() => {
  const layout: MemoryArea[] = []
  return layout
    .concat(props.operatingSystem, props.freeAreas, props.partitions)
    .sort((a, b) => a.location - b.location)
})

function areaClass(area: MemoryArea, fragmented: boolean) {
  return `bg-${
    area instanceof OperatingSystem
      ? 'primary'
      : area instanceof FreeArea
      ? fragmented
        ? 'danger'
        : 'secondary'
      : 'light'
  }`
}
</script>

<template>
  <div class="flex-grow-1" style="min-height: 470px">
    <template v-for="area in memoryAreas">
      <div class="row" :style="{ height: `${(area.size / totalSize) * 100}%` }">
        <div class="col-2 text-end">
          <div class="vstack h-100">
            <span class="flex-grow-1">{{ area.location }}KB</span>
            <span v-if="memoryAreas.at(-1) === area">{{ totalSize }}KB</span>
          </div>
        </div>
        <div class="col text-center py-1">
          <div
            class="h-100 rounded border-end border-dark border-5 position-relative"
            :class="areaClass(area, isFragmented)"
            style="display: grid; align-items: center"
          >
            <span class="fs-5" v-if="area instanceof OperatingSystem">OS</span>
            <span v-else-if="area instanceof FreeArea">Free Area</span>
            <span v-else>{{(area as Partition).process.id}}</span>
            <span class="position-absolute" style="right: 0.25rem"
              >{{ area.size }}KB</span
            >
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
