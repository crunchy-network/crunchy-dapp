import _ from 'lodash'
import { BigNumber } from 'bignumber.js';

export default {

  isFa1 (token) {
    return Object.prototype.hasOwnProperty.call(token.tokenType, 'fa1');
  },

  isFa2 (token) {
    return Object.prototype.hasOwnProperty.call(token.tokenType, 'fa2');
  },

  getTokenLedgerKey (address) {
    // HEH
    if (address === "KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9") {
      return 'balances';
    }

    // Plenty kUSD/USDtz
    if (address === "KT1HEdGi7rq1zgZ68dhAtKMZYKeD3EM5vYdf") {
      return 'balances';
    }

    // LB
    if (address === "KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo") {
      return 'tokens';
    }

    return 'ledger';
  },

  overrideMetadata (meta) {
    if (!Object.prototype.hasOwnProperty.call(meta, 'thumbnailUri') && Object.prototype.hasOwnProperty.call(meta, 'icon')) {
      meta.thumbnailUri = meta.icon;
    }

    if (meta.tokenAddress === "KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng") {
      meta.name = "Crunchy";
    }

    if (meta.tokenAddress === "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV") {
      meta.thumbnailUri = "https://kolibri-data.s3.amazonaws.com/logo.png";
      meta.decimals = 18;
      meta.symbol = 'kUSD';
      meta.name = "Kolibri USD";
    }

    if (meta.tokenAddress === "KT1KEsRsSMvSkgZ9CwYy5fPA1e4j3TEpuiKK") {
      meta.symbol = "oldWEED";
      meta.name = "Weed (Old)";
    }

    if (meta.tokenAddress === "KT1UHNDNjrCAAiRbzZrtQF9qHSHVMYeJyX1y") {
      meta.thumbnailUri = "ipfs://bafybeib56p33fpcg6oeero7ewwtuel2kzarcqvjr4p6llrj4o4jtgj7ljy";
    }

    if (meta.tokenAddress === "KT1GUNKmkrgtMQjJp3XxcmCj6HZBhkUmMbge") {
      meta.thumbnailUri = "ipfs://bafybeihbpuxewl5y5ks52tdfsyi4ocfdjwg6oxbok27cxv5gf5t5r3shne";
    }

    if (meta.tokenAddress === "KT1Ph8ptSU4rf7PPg2YBMR6LTpr6rc4MMyrq") {
      meta.thumbnailUri = "ipfs://Qme7epqauUCDt6J1oqwqEiDVUBSUbCQg6e9j3QoJGkv3vP";
    }

    // HEH
    if (meta.tokenAddress === "KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9") {
      meta.thumbnailUri = "ipfs://QmXL3FZ5kcwXC8mdwkS1iCHS2qVoyg69ugBhU2ap8z1zcs";
    }

    // Plenty
    if (meta.tokenAddress === "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b") {
      meta.thumbnailUri = "https://raw.githubusercontent.com/Plenty-DeFi/Plenty-Logo/main/PlentyTokenIcon.png";
    }

    // LB
    if (meta.tokenAddress === "KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo") {
      meta.symbol = "tzBTC";
      meta.name = "tzBTC";
      meta.thumbnailUri = "https://tzbtc.io/wp-content/uploads/2020/03/tzbtc_logo_single.svg";
    }

    // USDtz
    if (meta.tokenAddress === "KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9") {
      meta.symbol = "USDtz";
      meta.name = "USDtz";
      meta.thumbnailUri = "https://quipuswap.com/tokens/usdtz.png";
      meta.decimals = 6;
    }

    return meta;
  },

  getBadges (farm) {
    let badges = {
      verified: false,
      core: false,
      partner: false,
      lpLocked: false
    };

    // crunchy1
    if (farm.owner === "tz1hD63wN8p9V8o5ARU7wA7RKAQvBAwkeTr7") {
      badges.verified = true;
      badges.core = true;
    }

    // crunchy4
    if (farm.owner === "tz1ZZZPNqHprYjJzxXS6HfucYKKgHZUsVu1z") {
      badges.verified = true;
      badges.partner = true;
    }

    // crunchy7
    if (farm.owner === "tz1RMXfVec1xFHznQvk48hzQjBuqeVL9LLUE") {
      badges.verified = true;

      // DER
      if (farm.rewardToken.address === "KT1SiFqDqeFcUi5vQVSvuxB2g4xz7WLBrDek") {
        badges.partner = true;
      }
      if (farm.rewardToken.address === "KT1TCPf4DjgsseHj8ixRnCBgToqZbdFHQtPA") {
        badges.partner = true;
      }
      if (farm.rewardToken.address === "KT1Wa2ncR8GbeQrW6Dbtpc8uTrK7q5CH4F2Q") {
        badges.partner = true;
      }
      if (farm.rewardToken.address === "KT1M2Ws52krJrwJi1ZFsmVfazBiafWYKZTvd") {
        badges.partner = true;
      }
    }

    // XTZ/CRUNCH
    if (farm.poolToken.address === "KT1RRgK6eXvCWCiEGWhRZCSVGzhDzwXEEjS4") {
      badges.lpLocked = true;
    }

    // FARM
    if (farm.rewardToken.address === "KT1CnuKyaAuYBAwJf9g5LobtxRZsF2KCD3o6") {
      badges.partner = true;
    }

    // Catz
    if (farm.rewardToken.address === "KT1Ph8ptSU4rf7PPg2YBMR6LTpr6rc4MMyrq") {
      badges.verified = false;
    }

    // PUMP
    if (farm.rewardToken.address === "KT1Qryr8PrH3YGcDbbddwvp8X1acQ5v2zKhA") {
      badges.verified = false;
    }

    // BDoge
    if (farm.rewardToken.address === "KT1EMarewvdmyV42FDgGuhUhTKxrjutQWEBA") {
      badges.verified = false;
    }

    // DER
    if (farm.owner === "tz1Vb19E2Hh4JcerACeF1AJPkPSL63d5KAcF") {
      badges.verified = true;
      badges.partner = true;
    }

    // Hera
    if (farm.owner === "tz1Xkw7smsrdxdW3Stq6PKwbayESUnK2y5VT") {
      badges.verified = true;
    }

    // Kalam
    if (farm.owner === "tz1XNtKE6t9TnocwZ2Ae5s249M45EKvfp2o5") {
      badges.verified = true;
      badges.partner = true;
    }

    // Rocket
    if (farm.owner === "tz1b3jALDX5NdMocNSpyYRDeq18NTtzjtnWE") {
      badges.verified = true;
      badges.partner = true;
    }

    // Teztopia (UNO)
    if (farm.owner === "tz1VPZyh4ZHjDDpgvznqQQXUCLcV7g91WGMz") {
      badges.verified = true;
    }

    // tezonians
    if (farm.owner === "tz1UvkN6NDmGtkBB84svr5MRWsqQxMmM5chq") {
      badges.verified = true;
    }

    // XTZ/RCKT
    if (farm.poolToken.address === "KT1B7NqoQQkALYPS9fdxrcjGMQST6Wv4yy3h") {
      badges.lpLocked = true;
    }

    // XTZ/UNO
    if (farm.poolToken.address === "KT1Cq3pyv6QEXugsAC2iyXr7ecFqN7fJVTnA") {
      badges.lpLocked = true;
    }

    // XTZ/GOT
    if (farm.poolToken.address === "KT1JyPE1BWdYoRGBvvKhEPbcVRd3C9NCCwQC") {
      badges.lpLocked = true;
    }

    // XTZ/TDAO
    if (farm.poolToken.address === "KT1X6dAh8fwQMkWC9yh4yuvkJaS5NjqY4NvW") {
      badges.lpLocked = true;
    }

    // XTZ/XI
    if (farm.poolToken.address === "KT1PmYoCF5FkiL6GxZfgWZSV4W7R7HU6Xnnd") {
      badges.lpLocked = true;
    }

    return badges;
  },

  calcMultiplier (farm) {
    let m = 0;
    if (farm.id < 16) {
      m = 1;
    }
    for (const bonus of farm.bonuses) {
      if (new Date(bonus.endTime) > new Date()) {
        m += parseInt(bonus.multiplier);
      }
    }
    return m || 1;
  },

  getUserRecord (farm, userRecordsStorage) {
    const res = userRecordsStorage.find(x => x.key.nat == farm.id);

    if (!res) {
      return {
        amount: 0,
        rewardDebt: 0,
        lockEndTime: null,
        vault: ""
      };
    }

    const ret = _.clone(res.value);
    ret.amountRaw = ret.amount;
    ret.amount = BigNumber(ret.amount).div(BigNumber(10).pow(farm.poolToken.decimals)).toNumber();
    return ret;
  },

  estimatePendingRewards (userRecord, farmStorage, currentRewardMultiplier) {
    const pendingRewards = new BigNumber(0);
    const rpsMultiplier = new BigNumber(1000000000000000);
    const bonusAccuracy = new BigNumber(1000);
    const userRecordAmount = new BigNumber(userRecord.amountRaw);
    const userRecordDebt = new BigNumber(userRecord.rewardDebt);
    const rewardPaid = new BigNumber(farmStorage.rewardPaid);
    const rewardSupply = new BigNumber(farmStorage.rewardSupply);
    let accRewardPerShare = new BigNumber(farmStorage.accRewardPerShare);

    let tokenRewards = new BigNumber(0);
    if (!currentRewardMultiplier.isZero()) {
      const rewardPerSec = new BigNumber(farmStorage.rewardPerSec);
      const poolBalance = new BigNumber(farmStorage.poolBalance);
      tokenRewards = currentRewardMultiplier.times(rewardPerSec).times(rpsMultiplier).idiv(bonusAccuracy).idiv(poolBalance);
    }

    accRewardPerShare = accRewardPerShare.plus(tokenRewards);

    const accRewards = userRecordAmount.times(accRewardPerShare).idiv(rpsMultiplier);

    if (rewardPaid.lt(rewardSupply) && accRewards.gt(userRecordDebt)) {
      const maxRewards = rewardSupply.minus(rewardPaid).abs();
      const owedRewards = accRewards.minus(userRecordDebt).abs();
      if (maxRewards.lt(owedRewards)) {
        return maxRewards;
      } else {
        return owedRewards;
      }
    }

    return pendingRewards;
  },

  getActiveBonuses (bonuses, startTime) {
    return bonuses.filter(bonus => (new Date(bonus.endTime)) >= startTime);
  },

  countOutlierSeconds (b, endTime) {
    let s = 0;
    if ((new Date(b.endTime)) < endTime) {
      s = s + Math.floor(Math.abs(endTime - (new Date(b.endTime))) / 1000);
    }
    return s;
  },

  getCurrentRewardMultiplier (farmStorage) {
    const bonusAccuracy = 1000;
    const minDate = (...dates) => new Date(Math.min(...dates));

    let m = 0;
    if ((new Date(farmStorage.startTime) < new Date())) {
      const startTime = new Date(farmStorage.lastRewardTime);
      const endTime = minDate(new Date(farmStorage.endTime), new Date());
      const activeBonuses = this.getActiveBonuses(farmStorage.bonuses, startTime);
      const totalNumSec = Math.floor(Math.abs(endTime - startTime) / 1000);

      let secNoBonus = totalNumSec;
      let bonusSec = 0;
      for (const b of activeBonuses) {
        const e = minDate(endTime, new Date(b.endTime));
        const s = Math.floor(Math.abs(e - startTime) / 1000);
        bonusSec = bonusSec + (Number(b.multiplier) * s * bonusAccuracy);
        secNoBonus = Math.min(secNoBonus, this.countOutlierSeconds(b, endTime));
      }

      m = bonusSec + (secNoBonus * bonusAccuracy);
    }
    return new BigNumber(m);
  }

}

// https://api.florencenet.tzkt.io/v1/operations/transactions?target=KT1KB6q8jvyrRQku48ysVJo4xaULPbUfcdps&entrypoint.in=deposit,withdraw,harvest&sort.desc=id
