import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    TRANSACTIONS_MS_HOST: string;
    TRANSACTIONS_MS_PORT: number;
    AUTH_MS_HOST: string;
    AUTH_MS_PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    TRANSACTIONS_MS_HOST: joi.string().required(),
    TRANSACTIONS_MS_PORT: joi.number().required(),
    AUTH_MS_HOST: joi.string().required(),
    AUTH_MS_PORT: joi.number().required()
})
.unknown(true);

const { error, value } = envsSchema.validate(process.env);

if ( error ) {
    throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvVars = value;

export const envs = {
    port: envVars.PORT,
    authMsHost: envVars.AUTH_MS_HOST,
    authMsPort: envVars.AUTH_MS_PORT,
    transactionMsHost: envVars.TRANSACTIONS_MS_HOST,
    transactionMsPort: envVars.TRANSACTIONS_MS_PORT,
}