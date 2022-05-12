import { MemoryArea } from './MemoryArea'
import { Partition } from './Partition'
import { Process } from './Process'

export class FreeArea extends MemoryArea {
  constructor(location: number, size: number) {
    super(location, size)
  }

  allocateProcessAndSplitIntoPartition(process: Process): [Partition, boolean] {
    const partition = new Partition(this.location, process)

    if (this.size == process.size) {
      return [partition, true]
    }

    this.location += process.size
    this.size -= process.size
    return [partition, false]
  }

  getContiguous(freeAreas: FreeArea[]) {
    const leftContiguous = freeAreas.find(
      (a) => this.location == a.location + a.size
    )
    const rightContiguous = freeAreas.find(
      (a) => a.location == this.location + this.size
    )
    return [leftContiguous, rightContiguous]
  }

  mergeIntoContiguousFreeAreas(
    leftContiguous?: FreeArea,
    rightContiguous?: FreeArea
  ) {
    if (leftContiguous && rightContiguous) {
      leftContiguous.expandForwardInto(this)
      leftContiguous.expandForwardInto(rightContiguous)
      return rightContiguous
    } else if (rightContiguous || leftContiguous) {
      leftContiguous?.expandForwardInto(this)
      rightContiguous?.expandBackwardInto(this)
    }
    return null
  }

  expandForwardInto(freeArea: FreeArea) {
    this.size += freeArea.size
  }

  expandBackwardInto(freeArea: FreeArea) {
    this.location -= freeArea.size
    this.size += freeArea.size
  }
}

export function createFreeAreaFromPartition(partition: Partition) {
  return new FreeArea(partition.location, partition.size)
}
