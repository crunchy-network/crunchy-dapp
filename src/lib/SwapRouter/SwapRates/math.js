import { BigNumber } from "bignumber.js";

export class Nat extends BigNumber {
    // _nat: BigNumber;
    constructor(number: BigNumber | number | string) {
      number = new BigNumber(number);
      if (number < new BigNumber(0) || !number.isInteger() || number.isNaN()) {
        throw new Error(`Invalid nat: ${number.toString()}`);
      }
      super(number);
    }
  
    static max(...n: BigNumber.Value[]): Nat {
      return new Nat(super.max(...n));
    }
  
    static getNat(n: BigNumber): Nat {
      if (n.isNegative()) {
        throw new Error(`Invalid nat: ${n.toString()}`);
      } else {
        return new Nat(n);
      }
    }
  
    plus(x: BigNumber.Value): Nat {
      return Nat.getNat(super.plus(x));
    }
  
    minus(x: BigNumber.Value | Nat): Nat {
      return Nat.getNat(super.minus(x));
    }
  
    multipliedBy(n: BigNumber.Value): Nat {
      return Nat.getNat(super.multipliedBy(n));
    }
  
    dividedBy(n: BigNumber.Value): Nat {
      return Nat.getNat(super.dividedBy(n));
    }
  
    pow(n: BigNumber.Value): Nat {
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