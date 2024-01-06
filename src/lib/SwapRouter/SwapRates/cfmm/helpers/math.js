/* eslint-disable */
import { BigNumber } from "bignumber.js";
import { safeObserve } from "../utils";


import { Int, Nat, quipuswapV3Types } from "../types";

export const defaultLadder = {
  "0,true": {
    v: new BigNumber("38687560557337355742483221"),
    offset: new BigNumber(-85),
  },
  "1,true": {
    v: new BigNumber("38689494983725479307861971"),
    offset: new BigNumber(-85),
  },
  "2,true": {
    v: new BigNumber("38693364126677775184793561"),
    offset: new BigNumber(-85),
  },
  "3,true": {
    v: new BigNumber("38701103573421987005215721"),
    offset: new BigNumber(-85),
  },
  "4,true": {
    v: new BigNumber("38716587111352494729706462"),
    offset: new BigNumber(-85),
  },
  "5,true": {
    v: new BigNumber("38747572773653928660613512"),
    offset: new BigNumber(-85),
  },
  "6,true": {
    v: new BigNumber("38809618513447185627569983"),
    offset: new BigNumber(-85),
  },
  "7,true": {
    v: new BigNumber("38934008210058939100663682"),
    offset: new BigNumber(-85),
  },
  "8,true": {
    v: new BigNumber("39183984934869404935943141"),
    offset: new BigNumber(-85),
  },
  "9,true": {
    v: new BigNumber("39688763633815974521145659"),
    offset: new BigNumber(-85),
  },
  "10,true": {
    v: new BigNumber("40717912888646086984030507"),
    offset: new BigNumber(-85),
  },
  "11,true": {
    v: new BigNumber("42856962434838368098529959"),
    offset: new BigNumber(-85),
  },
  "12,true": {
    v: new BigNumber("47478079282778087338933597"),
    offset: new BigNumber(-85),
  },
  "13,true": {
    v: new BigNumber("29134438707490415855866100"),
    offset: new BigNumber(-84),
  },
  "14,true": {
    v: new BigNumber("43882733799120415566608322"),
    offset: new BigNumber(-84),
  },
  "15,true": {
    v: new BigNumber("49778031622173924435819796"),
    offset: new BigNumber(-83),
  },
  "16,true": {
    v: new BigNumber("32025492072892644517427309"),
    offset: new BigNumber(-80),
  },
  "17,true": {
    v: new BigNumber("53023938993515524338629870"),
    offset: new BigNumber(-76),
  },
  "18,true": {
    v: new BigNumber("36338278329035183585718600"),
    offset: new BigNumber(-66),
  },
  "19,true": {
    v: new BigNumber("34133361681864713959105863"),
    offset: new BigNumber(-47),
  },
  "0,false": {
    v: new BigNumber("19341845997356488514015570"),
    offset: new BigNumber(-84),
  },
  "1,false": {
    v: new BigNumber("2417609866154190654524678"),
    offset: new BigNumber(-81),
  },
  "2,false": {
    v: new BigNumber("38677889876083546261210550"),
    offset: new BigNumber(-85),
  },
  "3,false": {
    v: new BigNumber("38670155071614559132217310"),
    offset: new BigNumber(-85),
  },
  "4,false": {
    v: new BigNumber("19327345051392939314248854"),
    offset: new BigNumber(-84),
  },
  "5,false": {
    v: new BigNumber("19311889358453304431405214"),
    offset: new BigNumber(-84),
  },
  "6,false": {
    v: new BigNumber("77124060166079386301517011"),
    offset: new BigNumber(-86),
  },
  "7,false": {
    v: new BigNumber("38438828813936263312862610"),
    offset: new BigNumber(-85),
  },
  "8,false": {
    v: new BigNumber("76387211720013513967242610"),
    offset: new BigNumber(-86),
  },
  "9,false": {
    v: new BigNumber("75415686436335201065707301"),
    offset: new BigNumber(-86),
  },
  "10,false": {
    v: new BigNumber("73509547540888574991368714"),
    offset: new BigNumber(-86),
  },
  "11,false": {
    v: new BigNumber("17460146398643019245576278"),
    offset: new BigNumber(-84),
  },
  "12,false": {
    v: new BigNumber("126085780994910985395717054"),
    offset: new BigNumber(-87),
  },
  "13,false": {
    v: new BigNumber("102735988268212419722671870"),
    offset: new BigNumber(-87),
  },
  "14,false": {
    v: new BigNumber("68208042073114503830679361"),
    offset: new BigNumber(-87),
  },
  "15,false": {
    v: new BigNumber("60130046442422405275353178"),
    offset: new BigNumber(-88),
  },
  "16,false": {
    v: new BigNumber("11682706336100247487260846"),
    offset: new BigNumber(-88),
  },
  "17,false": {
    v: new BigNumber("56449132412055094618915006"),
    offset: new BigNumber(-95),
  },
  "18,false": {
    v: new BigNumber("20592303012757789234393034"),
    offset: new BigNumber(-103),
  },
  "19,false": {
    v: new BigNumber("1370156647050591448120178"),
    offset: new BigNumber(-118),
  },
};
/**
 *
 * @category Math
 *
 * @param cfmm
 * @param st
 * @param lowerTi
 * @param upperTi
 * @returns
 */
export async function tickAccumulatorsInside(
  cfmm,
  st,
  lowerTi,
  upperTi,
) {
  const lowerTs = st.ticks.get(lowerTi);
  const upperTs = st.ticks.get(upperTi);

  // const currentTime = new BigNumber(Math.floor(Date.now() / 1000)).plus(1);
  // const {
  //   tick_cumulative: cvTickCumulative,
  //   seconds_per_liquidity_cumulative: cvSecondsPerLiquidityCumulative,
  // } = (await cfmm.observe([currentTime.toString()]))[0];
  const blockInfo = await cfmm.tezos.rpc.getBlockHeader();

  const now = new BigNumber(
    Math.floor(Date.parse(blockInfo.timestamp) / 1000),
  ).plus(1);
  const {
    time: currentTime,
    tickCumulative: cvTickCumulative,
    secondsPerLiquidity: cvSecondsPerLiquidityCumulative,
  } = await safeObserve(cfmm, now);

  const tickAccumulatorAbove = (
    tickIndex,
    globalAcc,
    tickAccOutside,
  ) => {
    if (st.curTickIndex.gte(tickIndex)) {
      return globalAcc.minus(tickAccOutside);
    } else {
      return tickAccOutside;
    }
  };

  const tickAccumulatorBelow = (
    tickIndex,

    globalAcc,
    tickAccOutside,
  ) => {
    if (st.curTickIndex.gte(tickIndex)) {
      return tickAccOutside;
    } else {
      return globalAcc.minus(tickAccOutside);
    }
  };
  const tickAccumulatorInside = (
    globalAcc,
    lowerTickAccOutside,
    upperTickAccOutside,
  ) => {
    return globalAcc
      .minus(tickAccumulatorBelow(lowerTi, globalAcc, lowerTickAccOutside))
      .minus(tickAccumulatorAbove(upperTi, globalAcc, upperTickAccOutside));
  };

  return {
    aSeconds: tickAccumulatorInside(
      currentTime,
      lowerTs.secondsOutside.toBignumber(),
      upperTs.secondsOutside.toBignumber(),
    ),
    aTickCumulative: tickAccumulatorInside(
      cvTickCumulative,
      lowerTs.tickCumulativeOutside,
      upperTs.tickCumulativeOutside,
    ),
    aFeeGrowth: tickAccumulatorInside(
      st.feeGrowth.x.plus(st.feeGrowth.y).toBignumber(),
      lowerTs.feeGrowthOutside.x.plus(lowerTs.feeGrowthOutside.y).toBignumber(),
      upperTs.feeGrowthOutside.x.plus(upperTs.feeGrowthOutside.y).toBignumber(),
    ),
    aSecondsPerLiquidity: tickAccumulatorInside(
      cvSecondsPerLiquidityCumulative,
      lowerTs.secondsPerLiquidityOutside.toBignumber(),
      upperTs.secondsPerLiquidityOutside.toBignumber(),
    ),
  };
}

export function adjustScale(
  i,
  n1 = new Nat(0),
  n2 = new Nat(0),
) {
  const scaleAdjustment = n2.toBignumber().minus(n1);
  const iNormal = i.toBignumber();
  if (scaleAdjustment.gte(0)) {
    return new Nat(iNormal.multipliedBy(new BigNumber(2).pow(scaleAdjustment)));
  } else {
    return new Nat(
      iNormal
        .dividedBy(new BigNumber(2).pow(scaleAdjustment.negated()))
        .integerValue(BigNumber.ROUND_FLOOR),
    );
  }
}

/** 
 * let fixed_point_mul (a : fixed_point) (b : fixed_point) : fixed_point =
    { v = a.v * b.v ; offset = a.offset + b.offset }
 */
export function fixedPointMul(
  a,
  b,
) {
  return {
    v: a.v.multipliedBy(b.v),
    offset: a.offset.plus(b.offset),
  };
}

export function halfBpsPowRec(
  tick,
  acc,
  ladderKey,
  ladder,
) {
  if (tick.eq(0)) return acc;
  const half = tick.div(2).integerValue(BigNumber.ROUND_FLOOR);
  const rem = tick.mod(2);
  const fixedPoint = ladder[`${ladderKey.exp},${ladderKey.positive}`];
  const newAcc = rem.eq(0) ? acc : fixedPointMul(fixedPoint, acc);
  const newLadderKey = { ...ladderKey, exp: ladderKey.exp + 1 };
  return halfBpsPowRec(new Nat(half), newAcc, newLadderKey, ladder);
}

/**
 * `shiftRight(x, y)` is only defined for `y <= 256n`.
 *  This function handles larger values of `y`.
 */
export function steppedShiftRight(x, y) {
  const maxShift = 256;
  if (y.lte(maxShift)) {
    return new BigNumber(shiftRight(x, y).integerValue(BigNumber.ROUND_FLOOR));
  } else {
    const newX = shiftRight(x, new BigNumber(maxShift)).integerValue(
      BigNumber.ROUND_FLOOR,
    );
    return steppedShiftRight(newX, y.minus(maxShift));
  }
}

/**
 * `shiftLeft(x, y)` is only defined for `y <= 256n`.
 *  This function handles larger values of `y`.
 */
export function steppedShiftLeft(x, y) {
  const maxShift = 256;
  if (y.lte(maxShift)) {
    return new BigNumber(shiftLeft(x, y).integerValue(BigNumber.ROUND_FLOOR));
  } else {
    const newX = shiftLeft(x, new BigNumber(maxShift)).integerValue(
      BigNumber.ROUND_FLOOR,
    );
    return steppedShiftLeft(newX, y.minus(maxShift));
  }
}
/**
 *  For a tick index `i`, calculate the corresponding `sqrt_price`:
 *  sqrt(e^bps)^i * 2^80
 *  using the exponentiation by squaring method, where:
 *  bps = 0.0001
 */
export function sqrtPriceForTick(tick) {
  const absTick = tick.abs();
  const product = halfBpsPowRec(
    absTick,
    { v: 1, offset: new Int(0) },
    { exp: 0, positive: tick.gt(0) },
    defaultLadder,
  );
  const doffset = new BigNumber(-80).minus(product.offset);
  if (doffset.gt(0)) {
    return steppedShiftRight(product.v, doffset.abs());
  } else {
    return steppedShiftLeft(product.v, doffset.abs());
  }
}
export function shiftLeft(x, y) {
  return x.multipliedBy(new BigNumber(2).pow(y));
}

function sqrtPriceForTickFailSafe(tick) {
  const MIN_TICK_INDEX = new Int(-1048575);
  const MAX_TICK_INDEX = new Int(1048575);
  console.log(tick.toFixed(), tick.lt(MIN_TICK_INDEX), tick.gt(MAX_TICK_INDEX) )
  if (tick.lt(MIN_TICK_INDEX)) {
    return new BigNumber(0);
  }

  if (tick.gt(MAX_TICK_INDEX)) {
    return new BigNumber(Infinity);
  }

  return sqrtPriceForTick(tick).toBignumber();
}

export function alignToSpacing(tickIndex, tickSpacing) {
  const MIN_TICK_INDEX = new Int(-1048575);
  const floorIndex = new Int(
    tickIndex
      .toBignumber()
      .dividedBy(tickSpacing)
      .integerValue(BigNumber.ROUND_FLOOR)
      .multipliedBy(tickSpacing),
  );

  return floorIndex.lt(MIN_TICK_INDEX)
    ? floorIndex.plus(tickSpacing)
    : floorIndex;
}

function enhancedDiv(x, y) {
  // @ts-ignore: Object is possibly 'null'.
  const shiftAmount = Math.max(y.e, 0) + y.decimalPlaces();
  return x.shiftedBy(shiftAmount).dividedBy(y).shiftedBy(-shiftAmount);
}

/**
 * Calculates the index of the closest tick with the price below the specified one.
 * @param sqrtPrice Price square root in X80 format
 * @returns Tick index
 */
export function tickForSqrtPrice(
  sqrtPrice,
  tickSpacing = 1,
) {
  const MIN_TICK_INDEX = new Int(-1048575);
  const MAX_TICK_INDEX = new Int(1048575);

  const maxSqrtPrice = sqrtPriceForTickFailSafe(MAX_TICK_INDEX);

  if (sqrtPrice.gte(maxSqrtPrice)) {
    return alignToSpacing(MAX_TICK_INDEX, tickSpacing);
  }

  const minSqrtPrice = sqrtPriceForTickFailSafe(MIN_TICK_INDEX);

  if (sqrtPrice.lte(minSqrtPrice)) {
    return alignToSpacing(MIN_TICK_INDEX, tickSpacing);
  }

  const _280 = new BigNumber(2).pow(80);
  const base = Math.E ** 0.0001;
  const maxRatio = Math.sqrt(base);

  const realPrice = enhancedDiv(sqrtPrice, _280).pow(2);
  let estimationUpper = new Int(MAX_TICK_INDEX);
  let estimationLower = new Int(MIN_TICK_INDEX);
  let defaultSpacingTickIndex = new Int(
    Math.floor(Math.log(realPrice.toNumber()) / Math.log(base)),
  );
  let tickSqrtPrice = sqrtPriceForTickFailSafe(defaultSpacingTickIndex);
  let nextTickSqrtPrice = sqrtPriceForTickFailSafe(
    defaultSpacingTickIndex.plus(1),
  );

  while (tickSqrtPrice.gt(sqrtPrice) || nextTickSqrtPrice.lte(sqrtPrice)) {
    if (tickSqrtPrice.gt(sqrtPrice)) {
      estimationUpper = new Int(defaultSpacingTickIndex).minus(1);
    } else if (nextTickSqrtPrice.gt(sqrtPrice)) {
      estimationUpper = new Int(defaultSpacingTickIndex);
    }
    if (tickSqrtPrice.lt(sqrtPrice)) {
      estimationLower = new Int(defaultSpacingTickIndex);
    }
    const ratio = enhancedDiv(sqrtPrice, tickSqrtPrice);
    const rawTickDelta = Math.log(ratio.toNumber()) / Math.log(maxRatio);
    let tickDelta =
      rawTickDelta < 0 ? Math.floor(rawTickDelta) : Math.ceil(rawTickDelta);
    if (tickDelta === 0 && ratio.lt(1)) {
      tickDelta = -1;
    } else if (tickDelta === 0 && ratio.gt(1)) {
      tickDelta = 1;
    }
    if (!Number.isFinite(tickDelta)) {
      defaultSpacingTickIndex = tickDelta < 0 ? MIN_TICK_INDEX : MAX_TICK_INDEX;
    } else if (tickDelta === 0) {
      break;
    } else {
      defaultSpacingTickIndex = new Int(
        BigNumber.max(
          BigNumber.min(defaultSpacingTickIndex.plus(tickDelta), estimationUpper),
          estimationLower
        )
      );
    }
    tickSqrtPrice = sqrtPriceForTickFailSafe(defaultSpacingTickIndex);
    nextTickSqrtPrice = sqrtPriceForTickFailSafe(
      defaultSpacingTickIndex.plus(1),
    );
  }

  return alignToSpacing(defaultSpacingTickIndex, tickSpacing);
}

/**
 * A bitwise shift right operation
 */
export function shiftRight(x, y) {
  return x.dividedBy(new BigNumber(2).pow(y));
}

/**
 * When adding @liquidity_delta@ to a position, calculate how many tokens will need to be deposited/withdrawn.
 * Due to the floating-point math used in `sqrtPriceFor`, this function has a certain margin of error.
 * @param liquidityDelta The amount of liquidity to add to the position
 */
export function liquidityDeltaToTokensDelta(
  liquidityDelta,
  lowerTickIndex,
  upperTickIndex,
  currentTickIndex,
  sqrtPrice,
) {
  const sqrtPriceLower = sqrtPriceForTick(lowerTickIndex);
  const sqrtPriceUpper = sqrtPriceForTick(upperTickIndex);
  const _280 = new BigNumber(2).pow(80);

  // Equation 6.29
  const deltaY = (() => {
    if (currentTickIndex.lt(lowerTickIndex)) {
      return new Int(0);
    } else if (
      lowerTickIndex.lte(currentTickIndex) &&
      currentTickIndex.lt(upperTickIndex)
    ) {
      /**
       * ΔL * (√P - √pil)

       * Since sqrtPrice = √P * 2^80, we can subtitute √P with sqrtPrice / 2^80:
       *   liquidityDelta * (sqrtPrice / 2^80 - sqrtPriceLower / 2^80)
       * Using the distributive property of division:
       *   liquidityDelta * (sqrtPrice - sqrtPriceLower) / 2^80
       */
      return new Int(
        liquidityDelta

          .toBignumber()
          .multipliedBy(
            sqrtPrice.toBignumber().minus(sqrtPriceLower.toBignumber()),
          )
          .dividedBy(_280)
          .integerValue(BigNumber.ROUND_CEIL),
      );
    } else {
      return new Int(
        liquidityDelta
          .toBignumber()
          .multipliedBy(
            sqrtPriceUpper.toBignumber().minus(sqrtPriceLower.toBignumber()),
          )
          .dividedBy(_280)
          .integerValue(BigNumber.ROUND_CEIL),
      );
    }
  })();

  const deltaX = (() => {
    if (currentTickIndex.lt(lowerTickIndex)) {
      return new Int(
        liquidityDelta
          .toBignumber()
          .multipliedBy(_280)
          .multipliedBy(
            sqrtPriceUpper.toBignumber().minus(sqrtPriceLower.toBignumber()),
          )
          .dividedBy(
            sqrtPriceLower
              .toBignumber()
              .multipliedBy(sqrtPriceUpper.toBignumber()),
          )
          .integerValue(BigNumber.ROUND_CEIL),
      );
    } else if (
      lowerTickIndex.lte(currentTickIndex) &&
      currentTickIndex.lt(upperTickIndex)
    ) {
      return new Int(
        liquidityDelta
          .toBignumber()
          .multipliedBy(_280)
          .multipliedBy(
            sqrtPriceUpper.toBignumber().minus(sqrtPrice.toBignumber()),
          )
          .dividedBy(
            sqrtPrice.toBignumber().multipliedBy(sqrtPriceUpper.toBignumber()),
          )
          .integerValue(BigNumber.ROUND_CEIL),
      );
    } else {
      return new Int(0);
    }
  })();
  return { x: deltaX, y: deltaY };
}
/**
 * Subtract the protocol fee from an amount of @Y@ tokens.
 * Note that this rounds down, as we always want to risk giving the user a bit
 * less rather than giving more than we have.
 */
export const removeProtocolFee = (dy, protoFeeBps) => {
  return dy
    .multipliedBy(new BigNumber(10_000).minus(protoFeeBps))
    .dividedBy(new BigNumber(10_000))
    .integerValue(BigNumber.ROUND_DOWN);
};
/**
 * Equation 6.16
  Δx = Δ(1/√P) * L
  Δx = (1/√P_new - 1/√P_old) * L
Since sqrtPrice = √P * 2^80, we can subtitute √P with sqrtPrice / 2^80:
  dx = L * ( 1                     - 1                     )
           ( ---------------------   --------------------- )
           ( sqrt_price_new / 2^80   sqrt_price_old / 2^80 )
Simplifying the fractions:
  dx = L * ( 2^80           - 2^80           )
           ( --------------   -------------- )
           ( sqrt_price_new   sqrt_price_old )
 */
export function calcReceivedX(
  sqrtPriceOld,
  sqrtPriceNew,
  liquidity,
) {
  const _280 = new BigNumber(2).pow(80);
  const dx = liquidity
    .toBignumber()
    .multipliedBy(_280)
    .dividedBy(sqrtPriceNew.toBignumber())
    .minus(
      new BigNumber(liquidity)
        .multipliedBy(_280)
        .dividedBy(sqrtPriceOld.toBignumber()),
    )
    .integerValue(BigNumber.ROUND_CEIL);
  return new Int(dx.abs());
}

/**
 * Calculate how many Y tokens should be given to the user after depositing X tokens.
 * Equation 6.14
 *   Δy = Δ√P * L
 *   Δy = (√P_new - √P_old) * L
 * Since sqrtPrice = √P * 2^80, we can subtitute √P with sqrtPrice / 2^80:
 *   dy = (sqrtPriceNew / 2^80 - sqrtPriceOld / 2^80) * L

 * Keep in mind that the protocol fee is subtracted after the conversion, so the
 * received @Y@s can be calculated from the same price difference.
 * @param {quipuswapV3Types.x80n} sqrtPriceOld - the square root of the price of the token pair before the swap
 * @param {quipuswapV3Types.x80n} sqrtPriceNew - the new sqrtPrice
 * @param {Nat} liquidity - The amount of liquidity that the user has in the pool.
 * @param {Nat} protoFeeBps - The protocol fee in basis points.
 * @returns The amount of Y tokens that will be received by the user.
 */
export function calcReceivedY(
  sqrtPriceOld,
  sqrtPriceNew,
  liquidity,
) {
  const _280 = new BigNumber(2).pow(80);
  const dy = new BigNumber(sqrtPriceNew.toBignumber())
    .dividedBy(_280)
    .minus(new BigNumber(sqrtPriceOld.toBignumber()).dividedBy(_280))
    .multipliedBy(liquidity)
    .toNumber();
  const dyOut = Math.floor(-dy);
  return new Int(dyOut);
}
/**
 *  Calculate the new price after depositing @dx@ tokens **while swapping within a single tick**.

Equation 6.15
  Δ(1 / √P) = Δx / L
  1 / √P_new - 1 / √P_old = Δx / L

  Since sqrtPrice = √P * 2^80, we can subtitute √P with sqrtPrice / 2^80:
    1 / (sqrt_price_new / 2^80) - 1 / (sqrt_price_old / 2^80) = dx / liquidity
  Simplifying the fractions:
    2^80 / sqrt_price_new - 2^80 / sqrt_price_old = dx / liquidity
  Adding `2^80 / sqrt_price_old` to both sides:
    2^80 / sqrt_price_new = dx / liquidity + 2^80 / sqrt_price_old
  Multiplying both sides by sqrt_price_new:
    2^80 = (dx / liquidity + 2^80 / sqrt_price_old) * sqrt_price_new
  Dividing both sides by (dx / liquidity + 2^80 / sqrt_price_old):
    2^80 / (dx / liquidity + 2^80 / sqrt_price_old) = sqrt_price_new
 -}

 */
export function calcNewPriceX(
  sqrtPriceOld,
  liquidity,
  dx,
) {

  const shiftedL80 = shiftLeft(
    liquidity.multipliedBy(sqrtPriceOld),
    new BigNumber(80),
  );
  const shiftedL80PlusDxSqrtPriceOld = shiftLeft(
    liquidity,
    new BigNumber(80),
  ).plus(dx.multipliedBy(sqrtPriceOld));

  return shiftedL80
      .dividedBy(shiftedL80PlusDxSqrtPriceOld)
      .integerValue(BigNumber.ROUND_CEIL);
  // return new quipuswapV3Types.x80n(
  //   shiftedL80
  //     .dividedBy(shiftedL80PlusDxSqrtPriceOld)
  //     .integerValue(BigNumber.ROUND_CEIL),
  // );
}

/**
Calculate the new `sqrt_price` after a deposit of `dy` `y` tokens.
    Derived from equation 6.13:
        Δ(√P) = Δy /L
        √P_new - √P_old = Δy /L
    Since we store √P mutiplied by 2^80 (i.e. sqrt_price = √P * 2^80):
        sqrt_price_new / 2^80 - sqrt_price_old / 2^80 = Δy /L
    Solving for sqrt_price_new:
        sqrt_price_new = 2^80 * (Δy / L) + sqrt_price_old

    Example:
        Assume a pool with 10 `x` tokens and 1000 `y` tokens, which implies:
            L = sqrt(xy) = sqrt(10*1000) = 100
            P = y/x = 1000/10 = 100
            sqrt_price = sqrt(100) * 2^80 = 12089258196146291747061760

        Adding 1000 `y` tokens to the pool should result in:
            y = 2000
            x = L^2 / y = 5
            P = 2000 / 5 = 400
            sqrt_price = sqrt(400) * 2^80 = 24178516392292583494123520
*/
export function calcNewPriceY(sqrtPriceOld, liquidity, dy) {
  // const shiftedDy80 = shiftLeft(dy, new BigNumber(80)) as Nat;
  const _280 = new BigNumber(2).pow(80);
  return _280
      .multipliedBy(BigNumber(dy))
      .dividedBy(liquidity)
      .plus(sqrtPriceOld)
      .integerValue(BigNumber.ROUND_FLOOR);
}

/**
 * Equation 6.21
 *
 * Calculates the initial value of the accumulators tracked by a tick's state.
 * if the current tick is not yet over
 * @param {QuipuswapV3} cfmm - The contract instance
 * @param st - quipuswapV3Types.Storage
 * @param tickIndex - The tick index of the current tick.
 * @returns an object with the following properties:
 * - seconds: a Nat (natural number)
 * - tickCumulative: an Int (integer)
 * - feeGrowth: an object with two properties:
 *   - x: a quipuswapV3Types.x128n (128-bit number)
 *   - y: a quipuswapV
 */
export async function initTickAccumulators(
  cfmm,
  st,
  tickIndex,
) {
  const curTickIndex = st.curTickIndex;
  if (curTickIndex >= tickIndex) {
    const lastBuffer =
      st.cumulativesBuffer.map.map[st.cumulativesBuffer.last.toNumber()];
    const lastBufferSeconds = lastBuffer.time;
    const {
      tick_cumulative: tickCumulative,
      seconds_per_liquidity_cumulative: secondsPerLiquidity,
    } = (await cfmm.observe([lastBufferSeconds.toString()]))[0];
    return {
      seconds: new Nat(lastBufferSeconds),
      tickCumulative: new Int(tickCumulative),
      feeGrowth: st.feeGrowth,
      secondsPerLiquidity: new quipuswapV3Types.x128n(secondsPerLiquidity),
    };
  } else {
    return {
      seconds: new Nat(0),
      tickCumulative: new Int(0),
      feeGrowth: {
        x: new quipuswapV3Types.x128n(0),
        y: new quipuswapV3Types.x128n(0),
      },
      secondsPerLiquidity: new quipuswapV3Types.x128n(0),
    };
  }
}

/**
 * Calculate the swap fee paid when depositing @tokensDelta@ tokens.
 * transaction amount and dividing by 10,000
 * @param {BigNumber} feeBps - The fee in basis points.
 * @param {BigNumber} tokensDelta - The amount of tokens that will be transferred.
 * @returns The fee is being returned.
 */
export const calcSwapFee = (feeBps, tokensDelta) => {
  const fee = tokensDelta
    .multipliedBy(feeBps)
    .dividedBy(10000)
    .integerValue(BigNumber.ROUND_CEIL);
  return fee;
};