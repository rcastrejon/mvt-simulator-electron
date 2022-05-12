<script setup lang="ts">
import { FreeArea } from '../models/FreeArea'

defineProps<{
  freeAreas: FreeArea[]
}>()
</script>

<template>
  <table class="table table-hover table-sm text-center table-bordered">
    <thead>
      <tr>
        <th scope="col" style="width: 25%">#</th>
        <th scope="col" style="width: 25%">Location</th>
        <th scope="col" style="width: 25%">Size</th>
        <th scope="col" style="width: 25%">State</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(freeArea, i) in freeAreas">
        <tr>
          <td scope="row">{{ i + 1 }}</td>
          <td>{{ freeArea.location }}</td>
          <td>{{ freeArea.size }}KB</td>
          <td>Available</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
