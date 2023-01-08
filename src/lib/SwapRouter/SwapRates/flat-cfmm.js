/* eslint-disable */

// https://github.com/tezos-checker/flat-cfmm/blob/master/flat_functions.ts
// https://github.com/Plenty-DeFi/plenty-interface/blob/master/src/apis/stableswap/stableswap.js
// https://youves-mainnet-indexer.prod.gke.papers.tech/v1/graphql
const price_num = 1;
const price_denom = 1;

let util = function (x, y) {
    return [(x + y) ** 8 - (x - y) ** 8, 8 * ((x - y) ** 7 + (x + y) ** 7)]
}



let newton = function (p) {
    if (p.n == 0n)
        return p.dy
    else {
        let [new_u, new_du_dy] = util(p.x + p.dx, p.y - p.dy);
        //  new_u - p.u > 0 because dy remains an underestimate
        let dy = p.dy + (new_u - p.u) / new_du_dy;
        // dy is an underestimate because we start at 0 and the utility curve is convex
        p.dy = dy
        p.n -= 1;
        return newton(p);
    }
}

let tokensBought = function (cashPool, tokenPool, cashShold) {
    let x = cashPool * price_num;
    let y = tokenPool * price_denom;
    // 4 round is enough for most cases and underestimates the true payoff, so the user
    //    can always break up a trade for better terms *)
    let [u, _] = util(x, y);
    var p  = { x: x, y: y, dx: cashShold * price_num, dy: 0, u: u, n: 5 };
    return newton(p) / price_denom
}

let cashBought = function (cashPool , tokenPool, tokenSold) {
    let x = tokenPool * price_denom;
    let y = cashPool * price_num;
    let [u, _] = util(x, y);
    let p = { x: x, y: y, dx: tokenSold * price_denom, dy: 0, u: u, n: 5 }
    return newton(p) / price_num
}

let marginalPrice = function (cashPool, tokenPool) {
    let x = cashPool * price_num;
    let y = tokenPool * price_denom;
    let num = (x + y) ** 7 + (x - y) ** 7;
    let den = (x + y) ** 7 - (x - y) ** 7;
    return [num, den]
}

const getFlatCfmmOutput = (input, pair) => {
    if (pair.a.cash) {
        return tokensBought(pair.a.pool, pair.b.pool, input)
    }
    if (pair.b.cash) {
        return cashBought(pair.b.pool, pair.a.pool, input)
    }
    console.error(pair)
    throw new Error("Missing cash side")
}

module.exports = {
    getFlatCfmmOutput
}