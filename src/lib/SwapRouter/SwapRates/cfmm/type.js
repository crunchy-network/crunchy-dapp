import {
    Contract,
    TezosToolkit,
    WalletOperationBatch,
    OperationBatch,
    TransferParams,
  } from "@taquito/taquito";
  import { BigNumber } from "bignumber.js";
  import { MichelsonMap, MichelsonMapKey } from "@taquito/michelson-encoder";
  import { Address, Timestamp } from "./utils";
  import { shiftLeft, shiftRight } from "./helpers/math";
  
  export const swapDirection = {
    XtoY: 0,
    YtoX: 1,
  };
  /**
   * @description Type class to represent a Tezos Nat type which is a BigNumber
   * @example
   * const nat = new Nat('100')
   * nat.toNumber() // 100
   * nat.toString() // '100'
   * nat.plus(1).toString() // '101'
   * nat.toPow(2).toString() // '10000'
   * nat.fromPow(2).toString() // '1'
   */
  export class Nat extends BigNumber {
    // _nat: BigNumber;
    constructor(number) {
      number = new BigNumber(number);
      if (number < new BigNumber(0) || !number.isInteger() || number.isNaN()) {
        throw new Error(`Invalid nat: ${number.toString()}`);
      }
      super(number);
    }
  
    static max(...n) {
      return new Nat(super.max(...n));
    }
  
    static getNat(n) {
      if (n.isNegative()) {
        throw new Error(`Invalid nat: ${n.toString()}`);
      } else {
        return new Nat(n);
      }
    }
  
    plus(x) {
      return Nat.getNat(super.plus(x));
    }
  
    minus(x) {
      return Nat.getNat(super.minus(x));
    }
  
    multipliedBy(n) {
      return Nat.getNat(super.multipliedBy(n));
    }
  
    dividedBy(n) {
      return Nat.getNat(super.dividedBy(n));
    }
  
    pow(n) {
      return Nat.getNat(super.pow(n));
    }
  
    toBignumber() {
      return new BigNumber(this.toString());
    }
    // fromPow(
    //   precision: number,
    //   roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
    // ): BigNumber {
    //   return this.dividedBy(new BigNumber(10).pow(precision)).integerValue(
    //     roundingMode,
    //   );
    // }
    // toPow(
    //   precision: number,
    //   roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
    // ): BigNumber {
    //   return this.multipliedBy(new BigNumber(10).pow(precision)).integerValue(
    //     roundingMode,
    //   );
    // }
  }
  
  /**
   * @description Type class to represent a Tezos Int type which is a BigNumber
   * @example
   * const int = new Int('new BigNumber(-100)')
   * int.toString() // '-100'
   * int.toFixed() // '-100'
   */
  
  export class Int extends BigNumber {
    constructor(number) {
      number = new BigNumber(number);
      if (!number.isInteger() || number.isNaN()) {
        throw new Error(`Invalid int: ${number}`);
      }
      super(number);
    }
    static max(...n) {
      return new Int(super.max(...n));
    }
  
    plus(x) {
      return new Int(super.plus(x));
    }
  
    minus(x) {
      return new Int(super.minus(x));
    }
  
    multipliedBy(n, base) {
      return new Int(super.multipliedBy(n, base));
    }
  
    dividedBy(n, base) {
      return new Int(super.dividedBy(n, base));
    }
  
    pow(n, m) {
      if (m) {
        return new Int(super.pow(n, m));
      } else {
        return new Int(super.pow(n));
      }
    }
  
    toBignumber() {
      return new BigNumber(super.toString());
    }
    // fromPow(
    //   precision: number,
    //   roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
    // ): BigNumber {
    //   return this.dividedBy(new BigNumber(10).pow(precision)).integerValue(
    //     roundingMode,
    //   );
    // }
    // toPow(
    //   precision: number,
    //   roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
    // ): BigNumber {
    //   return this.multipliedBy(new BigNumber(10).pow(precision)).integerValue(
    //     roundingMode,
    //   );
    // }
  }
  
  export const CallMode = {
    returnParams: 0,
    returnOperation: 1,
    returnConfirmatedOperation: 2,
  };
  
  export const CallSettings = {
    swapXY: CallMode,
    swapYX: CallMode,
    setPosition: CallMode,
    updatePosition: CallMode,
    transfer: CallMode,
    updateOperators: CallMode,
    increaseObservationCount: CallMode,
  };
  
  export const ReturnMethodType = {
    callParams,
    callback: (contract, ...params) => TransferParams,
  };
  
  export const QsReturn = TransferParams | WalletOperationBatch;
  
  export const tezosTypes = {
    TezosContract: TezosToolkit["contract"]["at"](),
    Batch: OperationBatch || WalletOperationBatch,
  };
  
  export const fa2Types = {
    TransferDestination: {
      to_: '',
      token_id: new BigNumber(0),
      amount: new BigNumber(0),
    },
  };
  
    export const Transfer = {
      from_,
      txs
    };
  
    export const Operator = {
      owner,
      operator,
      token_id
    };
  
    export const UpdateOperators =
      { add_operator: Operator }
      | { remove_operator: Operator };
  
    export const FA2Storage = {
      account_info,
      token_info,
      metadata,
      token_metadata,
      minters_info,
      last_token_id,
      admin,
      permit_counter,
      permits,
      default_expiry,
      total_minter_shares,
    };
  
  
  export const fa12Types = {
    UserFA12Info: {
      balance,
      allowances,
    },
  
    FA12Storage: {
      total_supply,
      ledger,
      metadata,
      token_metadata,
    }
  }
  
  export const quipuswapV3Types = {
    Fa2Token: {
      fa2: { token_id: null, token_address: null }
    },
    Fa12Token: { fa12: null },
  
    TokenType: null,
    /**
     * Keeps a positive value with -2^80 precision.
     */
    x80n: class x80n extends Nat {
      constructor(number) {
        super(number);
      }
      static init(number) {
        number = new BigNumber(number);
        return new x80n(number.multipliedBy(new BigNumber(2).pow(80)));
      }
      toNormal() {
        return shiftRight(this, new BigNumber(80));
      }
    },
  
    /**
     *  Keeps a value with -2^128 precision.
     *
     */
    x128: class x128 extends Int {
      constructor(number) {
        super(number);
      }
      static init(number) {
        number = new BigNumber(number);
        return new x128(number.multipliedBy(new BigNumber(2).pow(128)));
      }
      toNormal() {
        return shiftRight(this, new BigNumber(128));
      }
    },
  
    /**
     * Keeps a positive value with -2^128 precision.
     */
    x128n: class x128n extends Nat {
      constructor(number) {
        super(number);
      }
      static init(number) {
        number = new BigNumber(number);
        return new x128n(number.multipliedBy(new BigNumber(2).pow(128)));
      }
      toNormal() {
        return shiftRight(this, new BigNumber(128));
      }
    }
  };
  
  
    // Tick types, representing pieces of the curve offered between different tick segments.
    export const TickIndex = Int;
  
    export const BalanceNat = { x, y };
    export const BalanceNatX128 = { x, y };
    export const BalanceIntX128 = { x, y };
  
    export type TickState = {
      //  Index of the previous initialized tick.
      //     Here we diverge from the article, and effectively store a doubly-linked
      //     list of initialized ticks for speed-up
      //     (while the article proposes storing a bitmap for this purpose).
      //
      prev: TickIndex;
  
      //  Index of the next initialized tick.
      next: TickIndex;
  
      //  Total amount of liquidity to add to the contract's global liquidity when
      //     this tick is crossed going up.
      //     (i.e. when the current tick index `i_c` becomes greater than this tick),
      //     or subtracted when the tick is crossed going down.
      //
      liquidityNet: Int;
  
      //  Numbers of positions with an edge at the given tick.
      //     Used for garbage collection.
      //
      nPositions: Nat;
  
      //  When the current tick index `i_c` is below this tick, this field tracks
      //     the overall number of seconds `i_c` spent above or at this tick.
      //     When `i_c` is above or equal to this tick, it tracks the number of
      //     seconds `i_c` spent below this tick.
  
      //     This field is updated every time `i_c` crosses this tick.
  
      //     Here we assume that, during all the time since Unix epoch start till
      //     the moment of tick initialization, i_c was below this tick
      //     (see equation 6.25 of the uniswap v3 whitepaper).
      //     So we actually track the number of seconds with some additive error Δ,
      //     but this Δ remains contant during the lifetime of the tick. Ticks
      //     created at different moments of time will have different Δ though.
  
      //     As example, let's say the tick was initialized at 1628440000 timestamp;
      //     then `seconds_outside` can be initialized with the same timestamp.
      //     If i_c crossed this tick 5 seconds later, this `seconds_outside` will
      //     be set respectively to 5.
      //     If i_c crossed this tick back 3 seconds later, we will get
      //     `1628440000 + 3 = 1628440003`
      //     (effectively this will be computed as `cur_time - last seconds_outside =
      //     1628440008 - 5 = 1628440003`).
  
      //     This field helps to evaluate, for instance, how many seconds i_c
      //     has spent in an any given ticks range.
      //
      secondsOutside: Nat;
  
      //  Tick indices accumulator i_o, it keeps track of time-weighted sum of
      //     tick indices, but accounts them only for "outside" periods.
      //     For the intuition for "outside" word, see `seconds_outside`.
      //
      tickCumulativeOutside: Int;
  
      //  Overall number of fees f_o that were accumulated during the period
      //     when the current tick index i_c was below (or above) this tick.
  
      //     For intuition for "outside" word, see `seconds_outside`.
      //
      feeGrowthOutside: BalanceNatX128;
  
      //  Seconds-weighted 1/L value accumulator s_lo, it accounts only for
      //     "outside" periods. For intuition for "outside" word, see `seconds_outside`.
  
      //     This helps us to implement liquidity oracle.
      //
      secondsPerLiquidityOutside: x128n;
  
      // sqrt(P) = sqrt(X/Y) associated with this tick.
      sqrtPrice: x80n;
    };
  
    export type PositionState = {
      // Position edge tick indices
      lowerTickIndex: TickIndex;
      upperTickIndex: TickIndex;
  
      // The position's owner.
      // By default - position's creator, but ownership can be transferred later.
      owner: Address;
  
      // Position's liquidity.
      liquidity: Nat;
  
      // Total fees earned by the position at the moment of last fees collection for this position.
      // This helps to evaluate the next portion of fees to collect.
      feeGrowthInsideLast: BalanceIntX128;
    };
  
    export type TickCumulative = {
      /** The time-weighted cumulative value. */
      sum: Int;
      /** Tick index value at the beginning of the block. */
      blockStartValue: TickIndex;
    };
    export type SplCumulative = {
      /** The time-weighted cumulative value */
      sum: x128n;
      /** Liquidity value at the beginning of the block */
      blockStartLiquidityValue: Nat;
    };
    export type TimedCumulative = {
      time: BigNumber;
      tick: TickCumulative;
      spl: SplCumulative;
    };
  
    export type TimedCumulativesBuffer = {
      /**
       *  For each index this stores:
          1. Cumulative values for every second in the history of the contract
            till specific moment of time, as well as last known value for
            the sake of future linear extrapolation.
          2. Timestamp when this sum was registered.
            This allows for bin search by timestamp.
  
          Indices in the map are assigned to values sequentially starting from 0.
  
          Invariants:
          a. The set of indices that have an associated element with them is continuous;
          b. Timestamps in values grow strictly monotonically
            (as well as accumulators ofc);
       */
      map: CumulativeBufferMap;
  
      // Index of the oldest stored value.
      first: Nat;
  
      // Index of the most recently stored value.
      last: Nat;
  
      // Number of actually allocated slots.
      //
      // This value is normally equal to `last - first + 1`.
      // However, in case recently there was a request to extend the set of
      // stored values, this var will keep the demanded number of stored values,
      // while values in the map past `last` will be initialized with garbage.
      //
      // We need to have initialized slots with trash because when the size of
      // the map increases, someone has to pay for the storage diff.
      // And we want it to be paid by the one who requested the extension.
      reservedLength: Nat;
    };
  
    export type Constants = {
      feeBps: Nat;
      tokenX: TokenType;
      tokenY: TokenType;
      tickSpacing: Nat;
    };
  
    //// See defaults.mligo for more info
    export type FixedPoint = { v: Nat; offset: Int };
    export type LadderKey = { exp: number; positive: boolean };
    export type Ladder = MichelsonMap<MichelsonMapKey, unknown>;
  
    export type SetPosition = {
      lowerTickIndex: TickIndex;
      upperTickIndex: TickIndex;
      lowerTickWitness: TickIndex;
      upperTickWitness: TickIndex;
      liquidity: Nat;
      deadline: Timestamp;
      maximumTokensContributed: BalanceNat;
    };
  
    export class CumulativeBufferMap {
      map: { [key: number]: TimedCumulative };
      constructor(
        public michelsonMap: MichelsonMap<MichelsonMapKey, unknown>,
        map: CumulativeBufferMap["map"],
      ) {
        this.map = map;
      }
      static async init(michelsonMap, indices: Nat[] = []) {
        const timedCumulatives = await michelsonMap.getMultipleValues(indices);
        const newCumulativesMap = {};
        timedCumulatives.forEach((value, key) => {
          if (value !== undefined) {
            newCumulativesMap[key] = {
              time: new BigNumber(Date.parse(value.time) / 1000),
              tick: {
                sum: new Int(value.tick.sum),
                blockStartValue: new Int(value.tick.block_start_value),
              },
              spl: {
                sum: new x128n(value.spl.sum),
                blockStartLiquidityValue: new Nat(
                  value.spl.block_start_liquidity_value,
                ),
              },
            };
          }
        });
        return new CumulativeBufferMap(michelsonMap, newCumulativesMap);
      }
      static initCustom(extraReservedSlots: number) {
        const newCumulativesMichelsonMap = new MichelsonMap();
        const newCumulativesMap = {};
        let reservedSlotsList: Nat[] = [];
        for (let i = 0; i <= extraReservedSlots; i++) {
          reservedSlotsList.push(new Nat(1));
          newCumulativesMichelsonMap.set(i, {
            time: "0",
            tick: {
              sum: "0",
              block_start_value: "0",
            },
            spl: {
              sum: "0",
              block_start_liquidity_value: "0",
            },
          });
  
          newCumulativesMap[i] = {
            time: new BigNumber(0),
            tick: {
              sum: new Int("0"),
              blockStartValue: new Int("0"),
            },
            spl: {
              sum: new x128n("0"),
              blockStartLiquidityValue: new Nat("0"),
            },
          };
        }
  
        return new CumulativeBufferMap(
          newCumulativesMichelsonMap,
          newCumulativesMap,
        );
      }
  
      get(key: Nat): TimedCumulative {
        return this.map[key.toString()];
      }
      async getActual(key: Nat): Promise<TimedCumulative> {
        const ts: any = await this.michelsonMap.get(key.toString());
        return {
          time: new BigNumber(Date.parse(ts.time) / 1000),
          tick: {
            sum: new Int(ts.tick.sum),
            blockStartValue: new Int(ts.tick.block_start_value),
          },
          spl: {
            sum: new x128n(ts.spl.sum),
            blockStartLiquidityValue: new Nat(ts.spl.block_start_liquidity_value),
          },
        };
      }
      async updateMap(mapIndices: Nat[] = []) {
        let knownIndices = Object.keys(this.map);
        knownIndices = knownIndices.concat(mapIndices.map(id => id.toString()));
        const timedCumulative = await (
          this.michelsonMap as unknown as any
        ).getMultipleValues(knownIndices);
  
        timedCumulative.forEach((value, key) => {
          if (value !== undefined) {
            this.map[key] = {
              time: new BigNumber(Date.parse(value.time) / 1000),
              tick: {
                sum: new Int(value.tick.sum),
                blockStartValue: new Int(value.tick.block_start_value),
              },
              spl: {
                sum: new x128n(value.spl.sum),
                blockStartLiquidityValue: new Nat(
                  value.spl.block_start_liquidity_value,
                ),
              },
            };
          }
        });
      }
    }
    export class TickMap {
      map: { [key: number]: TickState };
      constructor(
        public michelsonMap: MichelsonMap<MichelsonMapKey, unknown>,
        map: TickMap["map"],
      ) {
        this.map = map;
      }
      static async init(michelsonMap, tickIndices: Int[] = []) {
        const tickStates = await michelsonMap.getMultipleValues(tickIndices);
        const newTicksMap = {};
        tickStates.forEach((value, key) => {
          if (value !== undefined) {
            newTicksMap[key] = {
              prev: new Int(value.prev),
              next: new Int(value.next),
              liquidityNet: new Int(value.liquidity_net),
              secondsOutside: new Nat(value.seconds_outside),
              tickCumulativeOutside: new Int(value.tick_cumulative_outside),
              feeGrowthOutside: {
                x: new x128n(value.fee_growth_outside.x),
                y: new x128n(value.fee_growth_outside.y),
              },
              secondsPerLiquidityOutside: new x128n(
                value.seconds_per_liquidity_outside,
              ),
              sqrtPrice: new x80n(value.sqrt_price),
              nPositions: new Nat(value.n_positions),
            };
          }
        });
        return new TickMap(michelsonMap, newTicksMap);
      }
      get(key: Int): TickState {
        return this.map[key.toString()];
      }
      async getActual(key: TickIndex): Promise<TickState> {
        const st: any = await this.michelsonMap.get(key.toString());
        return {
          prev: new Int(st.prev),
          next: new Int(st.next),
          liquidityNet: new Int(st.liquidity_net),
          secondsOutside: new Nat(st.seconds_outside),
          tickCumulativeOutside: new Int(st.tick_cumulative_outside),
          feeGrowthOutside: {
            x: new x128n(st.fee_growth_outside.x),
            y: new x128n(st.fee_growth_outside.y),
          },
          secondsPerLiquidityOutside: new x128n(st.seconds_per_liquidity_outside),
          sqrtPrice: new x80n(st.sqrt_price),
          nPositions: new Nat(st.n_positions),
        };
      }
      async updateMap(tickIndices: Int[] = []) {
        let knownTickIndices = Object.keys(this.map);
        knownTickIndices = knownTickIndices.concat(
          tickIndices.map(id => id.toString()),
        );
        const ticks = await (
          this.michelsonMap as unknown as any
        ).getMultipleValues(knownTickIndices);
  
        ticks.forEach((value, key) => {
          if (value !== undefined) {
            this.map[key] = {
              prev: new Int(value.prev),
              next: new Int(value.next),
              liquidityNet: new Int(value.liquidity_net),
              secondsOutside: new Nat(value.seconds_outside),
              tickCumulativeOutside: new Int(value.tick_cumulative_outside),
              feeGrowthOutside: {
                x: new x128n(value.fee_growth_outside.x),
                y: new x128n(value.fee_growth_outside.y),
              },
              secondsPerLiquidityOutside: new x128n(
                value.seconds_per_liquidity_outside,
              ),
              sqrtPrice: new x80n(value.sqrt_price),
              nPositions: new Nat(value.n_positions),
            };
          }
        });
      }
    }
  
    /**
     * @description QuipuswapV3 PositionMap
     * @field map [key: number]: PositionState
     * @field michelsonMap MichelsonMap
     */
    export class PositionMap {
      map: { [key: number]: PositionState };
      constructor(
        public michelsonMap: MichelsonMap<MichelsonMapKey, unknown>,
        map: PositionMap["map"],
      ) {
        this.map = map;
      }
      static async init(michelsonMap, positionIds: Nat[]) {
        const positions = await michelsonMap.getMultipleValues(positionIds);
        const newPositions = {};
        positions.forEach((value, key) => {
          if (value !== undefined) {
            newPositions[key] = {
              lowerTickIndex: new Int(value.lower_tick_index),
              upperTickIndex: new Int(value.upper_tick_index),
              owner: value.owner,
              liquidity: new Nat(value.liquidity),
              feeGrowthInsideLast: {
                x: new x128n(value.fee_growth_inside_last.x),
                y: new x128n(value.fee_growth_inside_last.y),
              },
            };
          }
        });
        return new PositionMap(michelsonMap, newPositions);
      }
      get(key: Nat): PositionState {
        return this.map[key.toString()];
      }
      async updateMap(positionIds: Nat[] = []) {
        let knownPositionIds = Object.keys(this.map);
        knownPositionIds = knownPositionIds.concat(
          positionIds.map(id => id.toString()),
        );
        const positions = await (
          this.michelsonMap as unknown as any
        ).getMultipleValues(knownPositionIds);
  
        positions.forEach((value, key) => {
          if (value !== undefined) {
            this.map[key] = {
              lowerTickIndex: new Int(value.lower_tick_index),
              upperTickIndex: new Int(value.upper_tick_index),
              owner: value.owner,
              liquidity: new Nat(value.liquidity),
              feeGrowthInsideLast: {
                x: new x128(value.fee_growth_inside_last.x),
                y: new x128(value.fee_growth_inside_last.y),
              },
            };
          }
        });
      }
    }
    export class LadderMap {
      constructor(public map: MichelsonMap<MichelsonMapKey, unknown>) {}
      async get(key: LadderKey): Promise<FixedPoint> {
        return this.map.get({
          exp: key.exp.toString(),
          positive: key.positive,
        }) as FixedPoint;
      }
    }
  
    export type Storage = {
      //// Virtual liquidity, the value L for which the curve locally looks like x * y = L^2.
      liquidity: Nat;
  
      // Square root of the virtual price, the value P for which P = x / y.
      sqrtPrice: x80n;
  
      // Index of the highest tick corresponding to a price less than or equal to sqrt_price^2,
      // does not necessarily corresponds to a boundary.
      // Article's notation: i_c, tick.
      curTickIndex: TickIndex;
  
      // The highest initialized tick lower than or equal to i_c.
      curTickWitness: TickIndex;
  
      // The total amount of fees that have been earned per unit of virtual liquidity (L),
      // over the entire history of the contract.
      feeGrowth: BalanceNatX128;
  
      // States of all initialized ticks.
      ticks: TickMap;
  
      // States of positions (with non-zero liquidity).
      positions: PositionMap;
  
      // Cumulative values stored for the recent timestamps.
      cumulativesBuffer: TimedCumulativesBuffer;
      // TZIP-16 metadata.
      metadata: MichelsonMap<MichelsonMapKey, unknown>;
  
      // Incremental position id to be assigned to new position.
      newPositionId: BigNumber;
  
      // FA2-related
      operators: MichelsonMap<MichelsonMapKey, unknown>;
  
      // Constants for options that are settable at origiBigNumberion
      constants: Constants;
  
      // Exponents ladder for the calculation of 'half_bps_pow'
      ladder: LadderMap;
    };
  
    export type CumulativesValue = {
      tick_cumulative: Int;
      seconds_per_liquidity_cumulative: x128n;
    };
  }
  
  export namespace quipuswapV3CallTypes {
    export type UpdatePosition = {
      /**
       * positionId - position id
       * @ligoType Nat
       */
      positionId: Nat;
      /**
       * How to change the liquidity of the existing position.
       * If adding a delta (that can be negative) would result in a negative liquidity value, the call will abort.
       * @ligoType int
       */
      liquidityDelta: Nat;
      /** Where to send the freed X tokens, if any. */
      toX: Address;
      /** Where to send the freed Y tokens, if any. */
      toY: Address;
      /** The transaction won't be executed past this point. */
      deadline: Timestamp;
      /** The maximum number of tokens to contribute.
          If a higher amount is required, the entrypoint fails.
      */
      maximumTokensContributed: quipuswapV3Types.BalanceNat;
    };
  }