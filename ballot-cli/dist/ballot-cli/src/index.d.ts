import { type BallotProviders } from '../../ballot-api/src/index';
import { type Ledger } from '../../contract/src/managed/ballot/contract/index.cjs';
import { type Logger } from 'pino';
import { type Config } from './config.js';
import type { DockerComposeEnvironment } from 'testcontainers';
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
export declare const getBallotLedgerState: (providers: BallotProviders, contractAddress: ContractAddress) => Promise<Ledger | null>;
export declare const run: (config: Config, logger: Logger, dockerEnv?: DockerComposeEnvironment) => Promise<void>;
