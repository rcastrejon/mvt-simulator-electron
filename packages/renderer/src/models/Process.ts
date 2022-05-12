export class Process {
  id: string
  size: number
  arrivalStep: number
  durationSteps: number

  constructor(
    id: string,
    size: number,
    arrivalStep: number,
    durationSteps: number
  ) {
    this.id = id
    this.size = size
    this.arrivalStep = arrivalStep
    this.durationSteps = durationSteps
  }
}
