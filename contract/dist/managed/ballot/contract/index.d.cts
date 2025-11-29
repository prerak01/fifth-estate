import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum PollState { OPEN = 0, CLOSED = 1, EMPTY = 2 }

export type Witnesses<T> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  openPoll(context: __compactRuntime.CircuitContext<T>, newQuestion_0: string): __compactRuntime.CircuitResults<T, []>;
  closePoll(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
  voteYes(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
  voteNo(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
}

export type PureCircuits = {
  publicKey(sk_0: Uint8Array, sequence_0: Uint8Array): Uint8Array;
}

export type Circuits<T> = {
  openPoll(context: __compactRuntime.CircuitContext<T>, newQuestion_0: string): __compactRuntime.CircuitResults<T, []>;
  closePoll(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
  voteYes(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
  voteNo(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
  publicKey(context: __compactRuntime.CircuitContext<T>,
            sk_0: Uint8Array,
            sequence_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
}

export type Ledger = {
  readonly pollOwner: Uint8Array;
  readonly question: { is_some: boolean, value: string };
  readonly yesCount: bigint;
  readonly noCount: bigint;
  readonly pollState: PollState;
  readonly sequence: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
