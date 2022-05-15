<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { FreeArea, createFreeAreaFromPartition } from './models/FreeArea'
import { Partition } from './models/Partition'
import { OperatingSystem } from './models/OperatingSystem'
import { Process } from './models/Process'

import ProcessesTable from './components/ProcessesTable.vue'
import FreeAreasTable from './components/FreeAreasTable.vue'
import PartitionsTable from './components/PartitionsTable.vue'
import MemoryDiagram from './components/MemoryDiagram.vue'

import { ipcRenderer } from 'electron'

const processes = [
  new Process('A', 8, 1, 7),
  new Process('B', 14, 2, 7),
  new Process('C', 18, 3, 4),
  new Process('D', 6, 4, 6),
  new Process('E', 14, 5, 5),
]

const step = ref(0)
const message = ref('Ready...')
const finished = ref(false)

const availableProcesses = reactive([...processes])

const memoryLayout = ref({
  operatingSystem: new OperatingSystem(0, 10),
  freeAreas: [new FreeArea(10, 54)],
  partitions: Array<Partition>(),
})

const orderedMemoryLayout = computed(() => {
  return {
    freeAreas: memoryLayout.value.freeAreas.sort(
      (a, b) => a.location - b.location
    ),
    partitions: memoryLayout.value.partitions.sort(
      (a, b) => a.location - b.location
    ),
  }
})

watch(step, (newStep) => {
  const processToAllocate = availableProcesses.find(
    (p) => p.arrivalStep <= newStep
  )
  if (processToAllocate) {
    if (allocateProcess(processToAllocate)) {
      processToAllocate.arrivalStep = step.value
      const idx = availableProcesses.indexOf(processToAllocate)
      availableProcesses.splice(idx, 1)
      message.value = `Allocated process "${processToAllocate.id}"`
      return
    }
    message.value = `Process "${processToAllocate.id}" could not be allocated, no space left`
  }

  const partitionToDeallocate = memoryLayout.value.partitions.find(
    (p) => p.process.arrivalStep + p.process.durationSteps - 1 <= newStep
  )
  if (partitionToDeallocate) {
    deallocatePartition(partitionToDeallocate)
    message.value = `Deallocated process "${partitionToDeallocate.process.id}"`
  }

  if (availableProcesses.length < 1 && memoryLayout.value.partitions.length < 1)
    finished.value = true
})

function allocateProcess(process: Process) {
  const freeArea = memoryLayout.value.freeAreas.find(
    (fa) => fa.size >= process.size
  )
  if (!freeArea) {
    return false
  }

  const [partition, shouldDisposeOriginal] =
    freeArea.allocateProcessAndSplitIntoPartition(process)
  if (shouldDisposeOriginal)
    memoryLayout.value.freeAreas = memoryLayout.value.freeAreas.filter(
      (fa) => fa !== freeArea
    )

  memoryLayout.value.partitions.push(partition)
  return true
}

function deallocatePartition(partition: Partition) {
  memoryLayout.value.partitions = memoryLayout.value.partitions.filter(
    (p) => p !== partition
  )

  const newFreeArea = createFreeAreaFromPartition(partition)
  const [leftContiguous, rightContiguous] = newFreeArea.getContiguous(
    memoryLayout.value.freeAreas
  )

  if (!(leftContiguous || rightContiguous)) {
    memoryLayout.value.freeAreas.push(newFreeArea)
    return
  }

  const residualArea = newFreeArea.mergeIntoContiguousFreeAreas(
    leftContiguous,
    rightContiguous
  )

  if (residualArea)
    memoryLayout.value.freeAreas = memoryLayout.value.freeAreas.filter(
      (fa) => fa !== residualArea
    )
}
</script>

<template>
  <div class="container min-vh-100 vstack">
    <div class="row">
      <div class="col">
        <h4 class="text-center">Simulation of Memory Allocation with MVT</h4>
        <ProcessesTable :processes="processes" />
      </div>
    </div>
    <div class="row flex-grow-1">
      <div class="col d-grid gap-2" style="grid-auto-rows: 1fr">
        <div class="card">
          <div class="card-header">Free areas table</div>
          <div class="card-body overflow-hidden">
            <FreeAreasTable :free-areas="orderedMemoryLayout.freeAreas" />
          </div>
        </div>
        <div class="card">
          <div class="card-header">Partition table</div>
          <div class="card-body overflow-hidden">
            <PartitionsTable :partitions="orderedMemoryLayout.partitions" />
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <div class="card-header">Memory diagram</div>
          <div class="card-body d-flex">
            <MemoryDiagram
              :free-areas="memoryLayout.freeAreas"
              :partitions="memoryLayout.partitions"
              :operating-system="memoryLayout.operatingSystem"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="vstack mt-2 align-items-center">
          <div>
            <button
              v-if="!finished"
              type="button"
              class="btn btn-primary btn-sm"
              @click="step++"
            >
              Step {{ step }}
            </button>
            <button
              v-else
              type="button"
              class="btn btn-success btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#finishedModal"
            >
              Finished
            </button>
          </div>
          <span>{{ message }}</span>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="finishedModal"
    tabindex="-1"
    aria-labelledby="finishedModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="finishedModal">Attention</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          The simulation has finished, please select an action...
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="ipcRenderer.invoke('reload-app')"
          >
            Restart
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="ipcRenderer.invoke('quit-app')"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  user-select: none;
}
</style>
