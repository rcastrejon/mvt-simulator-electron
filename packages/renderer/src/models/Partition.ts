import { MemoryArea } from './MemoryArea'
import { Process } from './Process'

export class Partition extends MemoryArea {
  process: Process

  constructor(location: number, process: Process) {
    super(location, process.size)
    this.process = process
  }
}
