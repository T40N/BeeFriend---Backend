namespace NodeJS {
  interface ProcessEnv {
    DB_CONNECT: string;
  }
}

interface Error {
  status?: number;
  data?: ValidationError[];
}
