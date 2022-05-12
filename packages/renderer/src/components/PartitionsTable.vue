<script setup lang="ts">
import { Partition } from '../models/Partition'

defineProps<{
  partitions: Partition[]
}>()
</script>

<template>
  <table class="table table-hover table-sm text-center table-bordered">
    <thead>
      <tr>
        <th scope="col" style="width: 20%">#</th>
        <th scope="col" style="width: 20%">Location</th>
        <th scope="col" style="width: 20%">Size</th>
        <th scope="col" style="width: 20%">State</th>
        <th scope="col" style="width: 20%">Process</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="partitions.length == 0">
        <td v-for="n in 5">-</td>
      </tr>
      <template v-else v-for="(partition, i) in partitions">
        <tr>
          <td scope="row">{{ i + 1 }}</td>
          <td>{{ partition.location }}</td>
          <td>{{ partition.size }}KB</td>
          <td>Occupied</td>
          <td>{{ partition.process.id }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
