const { BigNumber } = require("bignumber.js");
const { mockTezosNow, dateToSeconds } = require("../utils");
const precision = new BigNumber(1e18);
const aPrecision = new BigNumber(100);

function getD(xp, ampF) {
  var sumC = xp.reduce(function (acc, value) {
    return acc.plus(value);
  }, new BigNumber(0));
  var tokensCount = xp.length;
  var aNnF = ampF.times(tokensCount);
  var d = sumC;
  var prevD = new BigNumber(0);

  while (d.minus(prevD).abs().gt(1)) {
    var dP = xp.reduce(
      // eslint-disable-next-line no-loop-func
      function (acc, value) {
        return acc.times(d).idiv(value.times(tokensCount));
      },
      d
    );
    prevD = d;
    const divisor = aNnF.minus(aPrecision);
    if (divisor.toNumber() < 0) {
      throw new Error("cant be negative");
    }
    d = aNnF
      .times(sumC)
      .idiv(aPrecision)
      .plus(dP.times(tokensCount))
      .times(d)
      .idiv(
        divisor
          .times(d)
          .idiv(aPrecision)
          .plus(new BigNumber(tokensCount).plus(1).times(dP))
      ); // Equality with the precision of 1
  }

  return d;
}

function calculateY(c, aNnF, s_, d, pool) {
  var tokensCount = pool.tokensInfo.length;
  c = c.times(d).times(aPrecision).idiv(aNnF.times(tokensCount));
  var b = s_.plus(d.times(aPrecision).idiv(aNnF));
  var y = d;
  var prevY = new BigNumber(0);

  while (y.minus(prevY).abs().gt(1)) {
    const divisor = y.times(2).plus(b).minus(d);
    if (divisor.toNumber() < 0) {
      throw new Error("can't be negative");
    }
    prevY = y;
    y = y.pow(2).plus(c).idiv(divisor);
  }

  return y;
}

function getXp(_ref) {
  var tokensInfo = _ref.tokensInfo;
  return tokensInfo.map(function (tokenInfo) {
    return tokenInfo.rate.times(tokenInfo.reserves).idiv(precision);
  });
}

var getA = function getA(t0, a0, t1, a1) {
  var now = mockTezosNow();

  if (now >= dateToSeconds(t1)) {
    return a1;
  }

  var tNum = now - dateToSeconds(t0);
  if (tNum < 0) {
    throw new Error("time is in the future");
  }
  var tDen = dateToSeconds(t1) - dateToSeconds(t0);
  if (tDen < 0) {
    throw new Error("t1 is before t0");
  }
  //   = assertNonNegative(
  //     now - dateToSeconds(t0),
  //     new DexTimestampError("t0=" + t0.toISOString() + " is in the future")
  //   );
  //   var tDen = assertNonNegative(
  //     dateToSeconds(t1) - dateToSeconds(t0),
  //     new DexTimestampError(
  //       "t1=" + t1.toISOString() + " is before t0=" + t0.toISOString()
  //     )
  //   );
  var diff = a1.minus(a0).abs();
  var value = diff.times(tNum).idiv(tDen);
  return a1.gt(a0) ? a0.plus(value) : a0.minus(value).abs(); // always a0 > (a0-a1) * (now-t0)/(t1-t0) if t1 > now && a0 > a1
};

var getY = function getY(i, j, x, xp, s) {
  var tokensCount = s.tokensInfo.length;
  var ampF = getA(
    new Date(s.initialATime),
    s.initialA,
    new Date(s.futureATime),
    s.futureA
  );
  var aNnF = ampF.times(tokensCount);
  var d = getD(xp, ampF);

  var prepareParams = function prepareParams(accum, value, iter) {
    if (iter !== j) {
      var _x = iter === i ? x : value;

      accum.s_ = accum.s_.plus(_x);
      accum.c = accum.c.times(d).idiv(_x.times(tokensCount));
    }

    return accum;
  };

  var res = xp.reduce(prepareParams, {
    s_: new BigNumber(0),
    c: d,
  });
  return calculateY(res.c, aNnF, res.s_, d, s);
};

function getQuipuCurveOutput(i, j, dx, pool) {
  dx = new BigNumber(dx);
  var xp = getXp(pool);
  var xpI = xp[i];
  var xpJ = xp[j];
  var tI = pool.tokensInfo[i];
  var tJ = pool.tokensInfo[j];
  var rateIF = tI.rate;
  var rateJF = tJ.rate;
  var x = xpI.plus(dx.times(rateIF).idiv(precision));

  var y = getY(i, j, x, xp, pool); // -1 just in case there were some rounding errors

  var dy = xpJ.minus(y).minus(1);
  if (dy.toNumber() < 0) {
    throw new Error("Cant be negative");
  }

  var toret = dy.times(precision).idiv(rateJF);
  return toret;
}

// tokensinfo
// rate: multiplier
// reserves: pool
//

module.exports = {
  getQuipuCurveOutput,
};
