export abstract class MemoryArea {
  location: number
  size: number

  constructor(location: number, size: number) {
    this.location = location
    this.size = size
  }
}
