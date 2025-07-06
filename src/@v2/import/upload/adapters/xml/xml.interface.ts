export interface XMLAdapter {
  read(buffer: Buffer): Promise<XMLAdapter.ReadResult[]>;
}

export namespace XMLAdapter {
  export interface ReadResult {
    name: string;
    data: (string | number | null)[][];
  }
}
