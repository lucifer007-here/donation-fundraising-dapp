import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCEG5OCIXMVF73CFGI52AOTTPTCIN46QBK2CF7HC7TMSO4YJFU7ZQRPQ",
  }
} as const


export interface Campaign {
  active: boolean;
  goal: i128;
  id: u32;
  owner: string;
  raised: i128;
}

export interface Client {
  /**
   * Construct and simulate a donate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  donate: ({id, donor, amount}: {id: u32, donor: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw: ({id, owner}: {id: u32, owner: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_campaign transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_campaign: ({id}: {id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Campaign>>

  /**
   * Construct and simulate a create_campaign transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_campaign: ({id, owner, goal}: {id: u32, owner: string, goal: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAACENhbXBhaWduAAAABQAAAAAAAAAGYWN0aXZlAAAAAAABAAAAAAAAAARnb2FsAAAACwAAAAAAAAACaWQAAAAAAAQAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAGcmFpc2VkAAAAAAAL",
        "AAAAAAAAAAAAAAAGZG9uYXRlAAAAAAADAAAAAAAAAAJpZAAAAAAABAAAAAAAAAAFZG9ub3IAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAACAAAAAAAAAAJpZAAAAAAABAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAMZ2V0X2NhbXBhaWduAAAAAQAAAAAAAAACaWQAAAAAAAQAAAABAAAH0AAAAAhDYW1wYWlnbg==",
        "AAAAAAAAAAAAAAAPY3JlYXRlX2NhbXBhaWduAAAAAAMAAAAAAAAAAmlkAAAAAAAEAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAABGdvYWwAAAALAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    donate: this.txFromJSON<null>,
        withdraw: this.txFromJSON<null>,
        get_campaign: this.txFromJSON<Campaign>,
        create_campaign: this.txFromJSON<null>
  }
}