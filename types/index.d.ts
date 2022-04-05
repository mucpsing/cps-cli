interface Cps {
  Config?: any;
}

declare namespace NodeJS {
  export interface Process {
    cps?: Cps;
  }
}
