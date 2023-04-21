/* eslint-disable lines-between-class-members */
/* eslint-disable new-cap */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-undef */
import { WalletOperationBatch, TransferParams } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { MichelsonMap } from "@taquito/michelson-encoder";
import { shiftRight } from "./helpers/math";

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

// export const ReturnMethodType = {
//   callParams,
//   callback: (contract, ...params) => TransferParams,
// };

export const QsReturn = TransferParams | WalletOperationBatch;

// export const tezosTypes = {
//   TezosContract: TezosToolkit.contract.at(),
//   Batch: OperationBatch || WalletOperationBatch,
// };

export const fa2Types = {
  TransferDestination: {
    to_: "",
    token_id: new BigNumber(0),
    amount: new BigNumber(0),
  },
};

// export const Transfer = {
//   from_,
//   txs,
// };

// export const Operator = {
//   owner,
//   operator,
//   token_id,
// };

// export const UpdateOperators =
//   { add_operator: Operator } | { remove_operator: Operator };

// export const FA2Storage = {
//   account_info,
//   token_info,
//   metadata,
//   token_metadata,
//   minters_info,
//   last_token_id,
//   admin,
//   permit_counter,
//   permits,
//   default_expiry,
//   total_minter_shares,
// };

// export const fa12Types = {
//   UserFA12Info: {
//     balance,
//     allowances,
//   },

//   FA12Storage: {
//     total_supply,
//     ledger,
//     metadata,
//     token_metadata,
//   },
// };

export const quipuswapV3Types = {
  Fa2Token: {
    fa2: { token_id: null, token_address: null },
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
    // eslint-disable-next-line lines-between-class-members
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
  },
};

// Tick types, representing pieces of the curve offered between different tick segments.
export const TickIndex = Int;

// export const BalanceNat = { x, y };
// export const BalanceNatX128 = { x, y };
// export const BalanceIntX128 = { x, y };

export class CumulativeBufferMap {
  map;
  constructor(michelsonMap, map) {
    this.map = map;
  }
  static async init(michelsonMap, indices = []) {
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
              value.spl.block_start_liquidity_value
            ),
          },
        };
      }
    });
    return new CumulativeBufferMap(michelsonMap, newCumulativesMap);
  }
  static initCustom(extraReservedSlots) {
    const newCumulativesMichelsonMap = new MichelsonMap();
    const newCumulativesMap = {};
    const reservedSlotsList = [];
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
      newCumulativesMap
    );
  }

  get(key) {
    return this.map[key.toString()];
  }
  async getActual(key) {
    const ts = await this.michelsonMap.get(key.toString());
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
  async updateMap(mapIndices = []) {
    let knownIndices = Object.keys(this.map);
    knownIndices = knownIndices.concat(mapIndices.map((id) => id.toString()));
    const timedCumulative = await this.michelsonMap.getMultipleValues(
      knownIndices
    );

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
              value.spl.block_start_liquidity_value
            ),
          },
        };
      }
    });
  }
}
export class TickMap {
  map;
  constructor(michelsonMap, map) {
    this.map = map;
  }
  static async init(michelsonMap, tickIndices = []) {
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
            value.seconds_per_liquidity_outside
          ),
          sqrtPrice: new x80n(value.sqrt_price),
          nPositions: new Nat(value.n_positions),
        };
      }
    });
    return new TickMap(michelsonMap, newTicksMap);
  }
  get(key) {
    return this.map[key.toString()];
  }
  async getActual(key) {
    const st = await this.michelsonMap.get(key.toString());
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
  async updateMap(tickIndices = []) {
    let knownTickIndices = Object.keys(this.map);
    knownTickIndices = knownTickIndices.concat(
      tickIndices.map((id) => id.toString())
    );
    const ticks = await this.michelsonMap.getMultipleValues(knownTickIndices);

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
            value.seconds_per_liquidity_outside
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
  map;
  constructor(michelsonMap, map) {
    this.map = map;
  }
  static async init(michelsonMap, positionIds) {
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
  get(key) {
    return this.map[key.toString()];
  }
  async updateMap(positionIds = []) {
    let knownPositionIds = Object.keys(this.map);
    knownPositionIds = knownPositionIds.concat(
      positionIds.map((id) => id.toString())
    );
    const positions = await this.michelsonMap.getMultipleValues(
      knownPositionIds
    );

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
  constructor(map) {}
  async get(key) {
    return this.map.get({
      exp: key.exp.toString(),
      positive: key.positive,
    });
  }
}
