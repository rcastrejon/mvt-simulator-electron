import { MemoryArea } from './MemoryArea'

export class OperatingSystem extends MemoryArea {
  constructor(location: number, size: number) {
    super(location, size)
  }
}
