import { z } from 'zod';

const reqString = (message: string) => z.string({ required_error: message }).min(1, { message });
const reqUrl = (message: string) => z.string({ required_error: message }).url({ message });

const defaultPort = 3001;

const configSchema = z.object({
    server: z.object({
        port: z.coerce.number().default(defaultPort),
        apiBaseUrl: reqUrl('API_BASE_URL must be a valid URL'),
        jwtSecret: reqString('JWT_SECRET is required'),
        production: z.boolean().default(false),
    }),
    databaseURL: reqUrl('DATABASE_URL must be a valid URL'),
    azure: z.object({
        azureStorageConnectionString: reqString('AZURE_STORAGE_CONNECTION_STRING is required'),
        azureContainerName: reqString('AZURE_CONTAINER_NAME is required'),
    }),
});

const isProduction = process.env.NODE_ENV === 'production';

const rawConfig = {
    server: {
        port: process.env.PORT,
        apiBaseUrl: isProduction
            ? process.env.API_BASE_URL
            : `http://localhost:${process.env.PORT || defaultPort}`,
        jwtSecret: process.env.JWT_SECRET,
        production: isProduction,
    },
    databaseURL: process.env.DATABASE_URL,
    azure: {
        azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
        azureContainerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
    },
};

const parsedConfig = configSchema.safeParse(rawConfig);

if (!parsedConfig.success) {
    console.error(
        `Invalid configuration, please set the following variables in your .env file:
        ${parsedConfig.error.errors.map((error) => `- ${error.message}`).join('\n\t')}`, // do not even think about changing the indentation of this line 🔪
    );

    process.exit(1);
}

export const CONFIG = parsedConfig.data;
