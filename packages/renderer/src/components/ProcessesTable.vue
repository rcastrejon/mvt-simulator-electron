<script setup lang="ts">
import { Process } from '../models/Process'

defineProps<{
  processes: Process[]
}>()
</script>

<template>
  <table class="table table-hover table-sm text-center table-bordered">
    <thead>
      <tr>
        <th scope="col" style="width: 25%">Process</th>
        <th scope="col" style="width: 25%">Size</th>
        <th scope="col" style="width: 25%">Arrival Time</th>
        <th scope="col" style="width: 25%">Duration</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="process in processes">
        <tr>
          <td scope="row">{{ process.id }}</td>
          <td>{{ process.size }}KB</td>
          <td>{{ process.arrivalStep }}</td>
          <td>{{ process.durationSteps }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
