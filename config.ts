import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

interface ENV {
  DB_CONNECT: string | undefined;
  JWT_SECRET: string | undefined;
}

interface Config {
  DB_CONNECT: string;
  JWT_SECRET: string;
}

const getConfig = (): ENV => {
  return {
    DB_CONNECT: process.env.DB_CONNECT,
    JWT_SECRET: process.env.JWT_SECRET,
  };
};

const getCheckedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing env of key: ${key}`);
    }
  }
  return config as Config;
};

const config = getConfig();

const checkedConfig = getCheckedConfig(config);

export default checkedConfig;
