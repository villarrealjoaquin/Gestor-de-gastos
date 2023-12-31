export interface Data {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  data: number[];
  backgroundColor: string[];
}
