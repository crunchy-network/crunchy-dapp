const BigNumber = require("bignumber.js");

function fix_cur_tick_index(cur_tick_index, sqrt_price_new, ladder) {
  function fix_cur_tick_index_rec(cur_tick_index_new, cur_index_sqrt_price) {
    if (sqrt_price_new.x80 < cur_index_sqrt_price.x80) {
      const prev_tick_index = { i: cur_tick_index_new.i - 1 };
      const prev_index_sqrt_price = half_bps_pow(prev_tick_index.i, ladder);
      return fix_cur_tick_index_rec(prev_tick_index, prev_index_sqrt_price);
    } else {
      const next_tick_index = { i: cur_tick_index_new.i + 1 };
      const next_index_sqrt_price = half_bps_pow(next_tick_index.i, ladder);
      if (next_index_sqrt_price.x80 <= sqrt_price_new.x80) {
        return fix_cur_tick_index_rec(next_tick_index, next_index_sqrt_price);
      } else {
        return cur_tick_index_new;
      }
    }
  }

  return fix_cur_tick_index_rec(
    cur_tick_index,
    half_bps_pow(cur_tick_index.i, ladder)
  );
}

// Helper function to get a tick by index.
function get_tick(ticks, index, err_msg) {
  for (let i = 0; i < ticks.length; i++) {
    if (ticks[i].index === index.i) {
      return ticks[i];
    }
  }
  throw new Error(err_msg);
}

// Calculates the new `cur_tick_index` after a given price change.
function calc_new_cur_tick_index(
  cur_tick_index,
  sqrt_price_old,
  sqrt_price_new,
  ladder
) {
  const cur_tick_index_delta = floor_log_half_bps_x80(
    sqrt_price_new,
    sqrt_price_old,
    too_big_price_change_err
  );
  const cur_tick_index_new = { i: cur_tick_index.i + cur_tick_index_delta };
  return fix_cur_tick_index(cur_tick_index_new, sqrt_price_new, ladder);
}
