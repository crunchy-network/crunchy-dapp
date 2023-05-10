/* eslint-disable new-cap */
const { default: BigNumber } = require("bignumber.js");

const { Nat, quipuswapV3Types } = require("../types");
const {
  calcNewPriceX,
  calcNewPriceY,
  calcSwapFee,
  shiftLeft,
  shiftRight,
  sqrtPriceForTick,
} = require("./math");

class TooBigPriceChangeErr extends Error {}

const HUNDRED_PERCENT_BPS = 10000;

function floorLogHalfBps(x, y, outOfBoundsError) {
  // const tenx = new BigNumber(x).times(10);

  // if (
  //   tenx.isLessThan(new BigNumber(y).times(7)) ||
  //   tenx.isGreaterThan(new BigNumber(y).times(15))
  // ) {
  //   throw outOfBoundsError;
  // }

  const xPlusY = new BigNumber(x).plus(y);
  const num = new BigNumber(x).minus(y).times(60003).times(xPlusY);
  const denom = xPlusY.times(xPlusY).plus(new BigNumber(x).times(2).times(y));

  return num.dividedToIntegerBy(denom);
}

function fixCurTickIndexRec(curTickIndexNew, curIndexSqrtPrice, sqrtPriceNew) {
  if (sqrtPriceNew.isLessThan(curIndexSqrtPrice)) {
    const prevTickIndex = curTickIndexNew.minus(1);
    const prevIndexSqrtPrice = sqrtPriceForTick(prevTickIndex);

    return fixCurTickIndexRec(prevTickIndex, prevIndexSqrtPrice, sqrtPriceNew);
  } else {
    const nextTickIndex = curTickIndexNew.plus(1);
    const nextIndexSqrtPrice = sqrtPriceForTick(nextTickIndex);

    if (nextIndexSqrtPrice.isLessThanOrEqualTo(sqrtPriceNew)) {
      return fixCurTickIndexRec(
        nextTickIndex,
        nextIndexSqrtPrice,
        sqrtPriceNew
      );
    } else {
      return curTickIndexNew;
    }
  }
}

function fixCurTickIndex(curTickIndex, sqrtPriceNew) {
  return fixCurTickIndexRec(
    curTickIndex,
    sqrtPriceForTick(curTickIndex),
    sqrtPriceNew
  );
}

function calcNewCurTickIndex(curTickIndex, sqrtPriceOld, sqrtPriceNew) {
  const curTickIndexDelta = floorLogHalfBps(
    sqrtPriceNew,
    sqrtPriceOld,
    new TooBigPriceChangeErr()
  );

  const curTickIndexNew = curTickIndex.plus(curTickIndexDelta);

  return fixCurTickIndex(curTickIndexNew, sqrtPriceNew);
}

function oneMinusFeeBps(feeBps) {
  return new Nat(HUNDRED_PERCENT_BPS).minus(feeBps);
}

function xToYRec(p) {
  if (p.s.liquidity === 0) {
    return p;
  }

  // TODO: change fees logic after new Quipuswap V3 contracts are deployed

  let totalFee = calcSwapFee(p.s.constants.feeBps, p.dx);

  let sqrtPriceNew = calcNewPriceX(
    p.s.sqrtPrice,
    p.s.liquidity,
    p.dx.minus(totalFee)
  );

  const curTickIndexNew = calcNewCurTickIndex(
    p.s.curTickIndex,
    p.s.sqrtPrice,
    sqrtPriceNew
  );

  if (curTickIndexNew.gte(p.s.curTickWitness)) {
    const dy = shiftRight(
      p.s.sqrtPrice.minus(sqrtPriceNew).multipliedBy(p.s.liquidity),
      new BigNumber(80)
    ).integerValue(BigNumber.ROUND_FLOOR);

    const newStorage = {
      ...p.s,
      sqrtPrice: sqrtPriceNew,
      curTickIndex: curTickIndexNew,
    };

    return {
      s: newStorage,
      dx: new Nat(0),
      dy: p.dy.plus(dy),
    };
  }
  const tick = p.s.ticks[p.s.curTickWitness.toFixed()];

  const loNew = tick.prev;
  sqrtPriceNew = new quipuswapV3Types.x80n(BigNumber(tick.sqrtPrice).minus(1));
  const dy = shiftRight(
    p.s.sqrtPrice.minus(sqrtPriceNew).multipliedBy(p.s.liquidity),
    new BigNumber(80)
  ).integerValue(BigNumber.ROUND_FLOOR);
  const dxForDy = shiftLeft(dy, new BigNumber(160))
    .dividedBy(p.s.sqrtPrice.multipliedBy(sqrtPriceNew))
    .integerValue(BigNumber.ROUND_CEIL);
  const dxConsumed = dxForDy
    .multipliedBy(HUNDRED_PERCENT_BPS)
    .dividedBy(oneMinusFeeBps(p.s.constants.feeBps))
    .integerValue(BigNumber.ROUND_CEIL);
  totalFee = dxConsumed.minus(dxForDy);
  const sums = p.s.lastCumulativesBuffer;
  if (!sums) {
    return p;
  }
  const tickCumulativeOutsideNew = BigNumber(sums.tick.sum).minus(
    tick.tickCumulativeOutside
  );
  const tickNew = {
    ...tick,
    tickCumulativeOutside: tickCumulativeOutsideNew,
  };
  const ticksNew = {
    ...p.s.ticks,
    [p.s.curTickWitness.toFixed()]: tickNew,
  };
  const storageNew = {
    ...p.s,
    curTickWitness: loNew,
    sqrtPrice: sqrtPriceNew,
    curTickIndex: curTickIndexNew.minus(1),
    ticks: ticksNew,
    liquidity: p.s.liquidity.minus(tick.liquidityNet),
  };
  const paramNew = {
    s: storageNew,
    dx: p.dx.minus(dxConsumed),
    dy: p.dy.plus(dy),
  };

  return xToYRec(paramNew);
}

const calculateXToY = (s, dx) => {
  const r = xToYRec({ s, dx, dy: new Nat(0) });

  return {
    output: r.dy,
    inputLeft: r.dx,
    newStoragePart: r.s,
  };
};

function yToXRec(p) {
  if (p.s.liquidity.isZero()) {
    return p;
  }

  let totalFee = calcSwapFee(p.s.constants.feeBps, p.dy);
  let dyMinusFee = p.dy.minus(totalFee);
  let sqrtPriceNew = calcNewPriceY(p.s.sqrtPrice, p.s.liquidity, dyMinusFee);
  
  const curTickIndexNew = calcNewCurTickIndex(
    p.s.curTickIndex,
    p.s.sqrtPrice,
    sqrtPriceNew
  );
  const tick = p.s.ticks[p.s.curTickWitness.toFixed()];
  const nextTickIndex = tick.next;
  if (curTickIndexNew.lt(nextTickIndex)) {
    const dx = p.s.liquidity
      .multipliedBy(
        shiftLeft(sqrtPriceNew.minus(p.s.sqrtPrice), new BigNumber(80))
      )
      .dividedBy(sqrtPriceNew.multipliedBy(p.s.sqrtPrice))
      .integerValue(BigNumber.ROUND_FLOOR);
    const sNew = {
      ...p.s,
      sqrtPrice: new quipuswapV3Types.x80n(sqrtPriceNew),
      curTickIndex: curTickIndexNew,
    };

    return { s: sNew, dy: new Nat(0), dx: p.dx.plus(dx) };
  }

  const nextTick = p.s.ticks[nextTickIndex.toFixed()];
  sqrtPriceNew = nextTick.sqrtPrice;

  const dx = new Nat(
    p.s.liquidity
      .multipliedBy(
        shiftLeft(sqrtPriceNew.minus(p.s.sqrtPrice), new BigNumber(80))
      )
      .dividedBy(sqrtPriceNew.multipliedBy(p.s.sqrtPrice))
      .integerValue(BigNumber.ROUND_FLOOR)
  );
  const _280 = new BigNumber(2).pow(80);
  const dyForDx = new Nat(
    p.s.liquidity
      .multipliedBy(sqrtPriceNew.minus(p.s.sqrtPrice))
      .dividedBy(_280)
      .integerValue(BigNumber.ROUND_CEIL)
  );
  dyMinusFee = dyForDx;
  const dyConsumed = dyMinusFee
    .multipliedBy(HUNDRED_PERCENT_BPS)
    .dividedBy(oneMinusFeeBps(p.s.constants.feeBps))
    .integerValue(BigNumber.ROUND_CEIL);
  totalFee = dyConsumed.minus(dyForDx);
  const sums = p.s.lastCumulativesBuffer;
  if (!sums) {
    return p;
  }
  const tickCumulativeOutsideNew = BigNumber(sums.tick.sum).minus(
    nextTick.tickCumulativeOutside
  );
  const nextTickNew = {
    ...nextTick,
    tickCumulativeOutside: tickCumulativeOutsideNew,
  };
  const ticksNew = {
    ...p.s.ticks,
    [nextTickIndex.toFixed()]: nextTickNew,
  };
  const storageNew = {
    ...p.s,
    sqrtPrice: new quipuswapV3Types.x80n(sqrtPriceNew),
    curTickWitness: nextTickIndex,
    curTickIndex: nextTickIndex,
    ticks: ticksNew,
    liquidity: new Nat(p.s.liquidity.plus(nextTick.liquidityNet)),
  };
  const paramNew = {
    s: storageNew,
    dy: p.dy.minus(dyConsumed),
    dx: p.dx.plus(dx),
  };

  return yToXRec(paramNew);
}

const calculateYToX = (s, dy) => {
  const r = yToXRec({ s: s, dy: dy, dx: new Nat(0) });

  return {
    output: r.dx,
    inputLeft: r.dy,
    newStoragePart: r.s,
  };
};

module.exports = {
  calculateYToX,
  calculateXToY,
};
