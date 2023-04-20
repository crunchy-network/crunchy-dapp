// import { Contract, TezosToolkit, TransferParams } from '@taquito/taquito';
// import { BigNumber } from 'bignumber.js';
// import {
//   fa2Types,
//   quipuswapV3Types,
//   CallSettings,
//   ReturnMethodType,
//   QsReturn,
//   Nat,
//   Int,
// } from './types';
// import { Address, Timestamp } from './utils';
// import { defaultCallSettings } from './helpers/defaults';
// import { extendCallQS } from './helpers/decorators';

// export class QuipuswapV3Methods {
//   static swapXY(
//     contract,
//     amount,
//     deadline,
//     minExpectedReceive,
//     recipient,
//   ) {
//     const params = contract.methodsObject
//       .x_to_y({
//         dx: amount.toFixed(),
//         deadline: deadline.toString(),
//         min_dy: minExpectedReceive.toFixed(),
//         to_dy: recipient.toString(),
//       })
//       .toTransferParams();

//     return params;
//   }

//   static swapYX(
//     contract,
//     amount,
//     deadline,
//     minExpectedReceive,
//     recipient,
//   ) {
//     const transferParams = contract.methodsObject
//       .y_to_x({
//         dy: amount.toFixed(),
//         deadline: deadline.toString(),
//         min_dx: minExpectedReceive.toFixed(),
//         to_dx: recipient.toString(),
//       })
//       .toTransferParams();

//     return transferParams;
//   }

//   static setPosition(
//     contract,
//     lowerTickIndex,
//     upperTickIndex,
//     lowerTickWitness,
//     upperTickWitness,
//     liquidity,
//     deadline,
//     maximumTokensContributedX,
//     maximumTokensContributedY,
//   ) {
//     const transferParams = contract.methods
//       .set_position(
//         lowerTickIndex.toFixed(),
//         upperTickIndex.toFixed(),
//         lowerTickWitness.toFixed(),
//         upperTickWitness.toFixed(),
//         liquidity.toFixed(),
//         deadline.toString(),
//         maximumTokensContributedX.toFixed(),
//         maximumTokensContributedY.toFixed(),
//       )
//       .toTransferParams();
//     return transferParams;
//   }

//   static updatePosition(
//     contract,
//     positionId,
//     liquidityDelta,
//     toX,
//     toY,
//     deadline,
//     maximumTokensContributedX,
//     maximumTokensContributedY,
//   ) {
//     const transferParams = contract.methods
//       .update_position(
//         positionId.toFixed(),
//         liquidityDelta.toFixed(),
//         toX.toString(),
//         toY.toString(),
//         deadline.toString(),
//         maximumTokensContributedX.toFixed(),
//         maximumTokensContributedY.toFixed(),
//       )
//       .toTransferParams();

//     return transferParams;
//   }

//   static transfer(
//     contract,
//     ...params
//   ) {
//     params = [...params];
//     const transferParams = params.map(param => {
//       return {
//         from_: param.from_.toString(),
//         txs: param.txs.map(tx => {
//           return {
//             to_: tx.to_.toString(),
//             token_id: tx.token_id.toString(),
//             amount: tx.amount.toFixed(),
//           };
//         }),
//       };
//     });
//     const trParams = contract.methods
//       .transfer(transferParams)
//       .toTransferParams();
//     return trParams;
//   }

//   static updateOperators(
//     contract,
//     ...params
//   ) {
//     params = [...params];
//     const updateOperatorsParams = params.map(param => {
//       if ('add_operator' in param) {
//         return {
//           add_operator: {
//             owner: param.add_operator.owner.toString(),
//             operator: param.add_operator.operator.toString(),
//             token_id: param.add_operator.token_id.toString(),
//           },
//         };
//       } else {
//         return {
//           remove_operator: {
//             owner: param.remove_operator.owner.toString(),
//             operator: param.remove_operator.operator.toString(),
//             token_id: param.remove_operator.token_id.toString(),
//           },
//         };
//       }
//     });
//     const trParams = contract.methods
//       .update_operators(updateOperatorsParams)
//       .toTransferParams();
//     return trParams;
//   }

//   static increaseObservationCount(
//     contract,
//     amount,
//   ) {
//     const transferParams = contract.methods
//       .increase_observation_count(amount.toFixed())
//       .toTransferParams();

//     return transferParams;
//   }
// }
// export class QuipuswapV3Storage {
//   /**
//    * @param tezos
//    * @param contract
//    * @returns
//    */
//   static async getStorage(
//     contract,
//     positionIds,
//     tickIndices,
//     bufferMapIndices,
//   ) {
//     const origStorage = (await contract.storage());

//     return {
//       liquidity: new Nat(origStorage.liquidity),
//       sqrtPrice: new quipuswapV3Types.x80n(origStorage.sqrt_price),
//       curTickIndex: new Int(origStorage.cur_tick_index),
//       curTickWitness: new Int(origStorage.cur_tick_witness),
//       feeGrowth: {
//         x: new quipuswapV3Types.x80n(origStorage.fee_growth.x),
//         y: new quipuswapV3Types.x80n(origStorage.fee_growth.y),
//       },
//       ticks: await quipuswapV3Types.TickMap.init(
//         origStorage.ticks,
//         tickIndices,
//       ),
//       positions: await quipuswapV3Types.PositionMap.init(
//         origStorage.positions,
//         positionIds,
//       ),

//       cumulativesBuffer: {
//         map: await quipuswapV3Types.CumulativeBufferMap.init(
//           origStorage.cumulatives_buffer.map,
//           bufferMapIndices,
//         ),
//         first: new Nat(origStorage.cumulatives_buffer.first),
//         last: new Nat(origStorage.cumulatives_buffer.last),
//         reservedLength: new Nat(origStorage.cumulatives_buffer.reserved_length),
//       },
//       metadata: origStorage.metadata,
//       newPositionId: new Nat(origStorage.new_position_id),
//       operators: origStorage.operators,
//       constants: {
//         feeBps: new Nat(origStorage.constants.fee_bps),
//         tokenX: origStorage.constants.token_x,
//         tokenY: origStorage.constants.token_y,
//         tickSpacing: new Nat(origStorage.constants.tick_spacing),
//       },
//       ladder: new quipuswapV3Types.LadderMap(origStorage.ladder),
//     };
//   }
//   static async updateStorage(
//     storage,
//     contract,
//     positionIds,
//     tickIndices,
//     bufferMapIndices,
//   ) {
//     const origStorage = (await contract.storage());
//     storage.liquidity = new Nat(origStorage.liquidity);
//     storage.sqrtPrice = new quipuswapV3Types.x80n(origStorage.sqrt_price);
//     storage.curTickIndex = new Int(origStorage.cur_tick_index);
//     storage.curTickWitness = new Int(origStorage.cur_tick_witness);
//     storage.feeGrowth = {
//       x: new quipuswapV3Types.x80n(origStorage.fee_growth.x),
//       y: new quipuswapV3Types.x80n(origStorage.fee_growth.y),
//     };
//     await storage.ticks.updateMap(tickIndices);
//     await storage.positions.updateMap(positionIds);
//     await storage.cumulativesBuffer.map.updateMap(bufferMapIndices);
//     storage.metadata = origStorage.metadata;
//     storage.newPositionId = new Nat(origStorage.new_position_id);
//     storage.operators = origStorage.operators;
//     storage.constants = {
//       feeBps: new Nat(origStorage.constants.fee_bps),
//       tokenX: origStorage.constants.token_x,
//       tokenY: origStorage.constants.token_y,
//       tickSpacing: new Nat(origStorage.constants.tick_spacing),
//     };
//     storage.ladder = new quipuswapV3Types.LadderMap(origStorage.ladder);
//     return storage;
//   }
//   static async getRawStorage(contract) {
//     return await contract.storage(); 
// }

// export class QuipuswapV3 {
//   constructor(
//     callSettings = defaultCallSettings,
//     confirmationCount = 5
//   ) {
//     this.callSettings = callSettings;
//     this.confirmationCount = confirmationCount;
//   }

//   async init(tezos, contractAddress) {
//     this.tezos = tezos;
//     this.contract = await tezos.contract.at(contractAddress);
//     this.storage = await QuipuswapV3Storage.getStorage(
//       this.contract,
//       [],
//       [],
//       []
//     );
//     return this;
//   }
// }


//   async getStorage(
//     positionIds: Nat[] = [],
//     tickIndices: Int[] = [],
//     bufferMapIndices: Nat[] = [],
//   ): Promise<quipuswapV3Types.Storage> {
//     return QuipuswapV3Storage.getStorage(
//       this.contract,
//       positionIds,
//       tickIndices,
//       bufferMapIndices,
//     );
//   }

//   async updateStorage(
//     positionIds: Nat[] = [],
//     tickIndices: Int[] = [],

//     bufferMapIndices: Nat[] = [],
//   ) {
//     await QuipuswapV3Storage.updateStorage(
//       this.storage,
//       this.contract,
//       positionIds,
//       tickIndices,
//       bufferMapIndices,
//     );
//     return this.storage;
//   }
//   async getRawStorage(): Promise<any> {
//     return QuipuswapV3Storage.getRawStorage(this.contract);
//   }

//   /**
//    * Swap X tokens for Y tokens
//    * @param amount Amount of tokens to swap
//    * @param deadline The transaction won't be executed past this point
//    * @param minExpectedReceive Minimum amount of tokens to receive. The transaction won't be executed if buying less than the given amount of Y tokens.
//    * @param recipient Recipient of the tokens
//    * @returns TransferParam | WalletOperationBatch
//    */
//   @extendCallQS
//   async swapXY(
//     amount: BigNumber,
//     deadline: string,
//     minExpectedReceive: BigNumber,
//     recipient: string,
//   ): Promise<QsReturn> {
//     const transferParams = [
//       new Nat(amount),
//       new Timestamp(deadline),
//       new Nat(minExpectedReceive),
//       new Address(recipient),
//     ];
//     return {
//       callParams: transferParams,
//       callback: QuipuswapV3Methods.swapXY,
//     } as unknown as TransferParams;
//   }

//   /**
//    * Swap Y tokens for X tokens
//    * @param amount Amount of tokens to swap
//    * @param deadline The transaction won't be executed past this point
//    * @param minExpectedReceive Minimum amount of tokens to receive. The transaction won't be executed if buying less than the given amount of X tokens.
//    * @param recipient Recipient of the tokens
//    * @returns TransferParam | WalletOperationBatch
//    */
//   @extendCallQS
//   async swapYX(
//     amount: BigNumber,
//     deadline: string,
//     minExpectedReceive: BigNumber,
//     recipient: string,
//   ): Promise<QsReturn> {
//     const params = [
//       new Nat(amount),
//       new Timestamp(deadline),
//       new Nat(minExpectedReceive),
//       new Address(recipient),
//     ];
//     return {
//       callParams: params,
//       callback: QuipuswapV3Methods.swapYX,
//     } as unknown as TransferParams;
//   }

//   /**
//    * Creates a new position in the given range.
//    * @param lowerTickIndex Lower tick index
//    * @param upperTickIndex Upper tick index
//    * @param lowerTickWitness Lower tick witness
//    * @param upperTickWitness Upper tick witness
//    * @param liquidity Liquidity
//    * @param deadline The transaction won't be executed past this point
//    * @param maximumTokensContributedX Maximum tokens contributed X
//    * @param maximumTokensContributedY Maximum tokens contributed Y
//    * @returns TransferParam | WalletOperationBatch
//    */
//   @extendCallQS
//   async setPosition(
//     lowerTickIndex: BigNumber,
//     upperTickIndex: BigNumber,
//     lowerTickWitness: BigNumber,
//     upperTickWitness: BigNumber,
//     liquidity: BigNumber,
//     deadline: string,
//     maximumTokensContributedX: BigNumber,
//     maximumTokensContributedY: BigNumber,
//   ): Promise<QsReturn> {
//     const params = [
//       new Int(lowerTickIndex),
//       new Int(upperTickIndex),
//       new Int(lowerTickWitness),
//       new Int(upperTickWitness),
//       new Nat(liquidity),
//       new Timestamp(deadline),
//       new Nat(maximumTokensContributedX),
//       new Nat(maximumTokensContributedY),
//     ];
//     return {
//       callParams: params,
//       callback: QuipuswapV3Methods.setPosition,
//     } as unknown as TransferParams;
//   }

//   /**
//    * Updates an existing position.
//    * @param positionId Position id
//    * @param liquidityDelta Liquidity delta. If adding a delta (that can be negative) would result in a negative liquidity value,
//    * the call will abort.
//    * @param toX  Where to send the freed X tokens, if any.
//    * @param toY Where to send the freed Y tokens, if any.
//    * @param deadline The transaction won't be executed past this point
//    * @param maximumTokensContributedX Maximum tokens contributed X
//    * @param maximumTokensContributedY Maximum tokens contributed Y
//    * @returns TransferParam | WalletOperationBatch
//    */
//   @extendCallQS
//   async updatePosition(
//     positionId: BigNumber,
//     liquidityDelta: BigNumber,
//     toX: string,
//     toY: string,
//     deadline: string,
//     maximumTokensContributedX: BigNumber,
//     maximumTokensContributedY: BigNumber,
//   ): Promise<QsReturn> {
//     const params = [
//       new Nat(positionId),
//       new Int(liquidityDelta),
//       new Address(toX),
//       new Address(toY),
//       new Timestamp(deadline),
//       new Int(maximumTokensContributedX),
//       new Int(maximumTokensContributedY),
//     ];
//     return {
//       callParams: params,
//       callback: QuipuswapV3Methods.updatePosition,
//     } as unknown as TransferParams;
//   }

//   /**
//    * Transfer
//    * @param params Fa2 transfer param is list of transfer
//    * @transferParam from Sender address
//    * @transferParam txs List of TransferDestination
//    * @transferDestination to Recipient address
//    * @transferDestination token_id Token id
//    * @transferDestination amount Amount of tokens to transfer
//    * @returns TransactionOperation
//    */
//   @extendCallQS
//   async transfer(params: fa2Types.Transfer[]): Promise<QsReturn> {
//     const fa2TransferParams = params.map(param => {
//       return {
//         from_: new Address(param.from_),
//         txs: param.txs.map(tx => {
//           return {
//             to_: new Address(tx.to_),
//             token_id: new Nat(tx.token_id),
//             amount: new Nat(tx.amount.toFixed()),
//           };
//         }),
//       };
//     });
//     return {
//       callParams: fa2TransferParams,
//       callback: QuipuswapV3Methods.transfer,
//     } as unknown as TransferParams;
//   }

//   /** Update operator
//    * @param params Fa2 update operator param is list of update operator
//    * @updateOperatorsParam variant type or update operator or remove operator
//    * @operatorParam owner Owner address
//    * @operatorParam operator Operator address
//    * @operatorParam token_id Token id
//    * @returns TransferParam | WalletOperationBatch
//    */
//   @extendCallQS
//   async updateOperators(params: fa2Types.UpdateOperators[]): Promise<QsReturn> {
//     const updateOperatorsParams = params.map(param => {
//       if ('add_operator' in param) {
//         return {
//           add_operator: {
//             owner: new Address(param.add_operator.owner),
//             operator: new Address(param.add_operator.operator),
//             token_id: new Nat(param.add_operator.token_id),
//           },
//         };
//       } else {
//         return {
//           remove_operator: {
//             owner: new Address(param.remove_operator.owner),
//             operator: new Address(param.remove_operator.operator),
//             token_id: new Nat(param.remove_operator.token_id),
//           },
//         };
//       }
//     });
//     return {
//       callParams: updateOperatorsParams,
//       callback: QuipuswapV3Methods.updateOperators,
//     } as unknown as TransferParams;
//   }

//   @extendCallQS
//   async increaseObservationCount(count: BigNumber) {
//     return {
//       callParams: [new Nat(count)],
//       callback: QuipuswapV3Methods.increaseObservationCount,
//     } as unknown as TransferParams;
//   }

//   async observe(
//     timestamps: string[] = [],
//   ): Promise<quipuswapV3Types.CumulativesValue[]> {
//     if (timestamps.length === 0) {
//       const ts = (await this.tezos.rpc.getBlockHeader()).timestamp;
//       const now = new Timestamp(ts).toString();

//       return await this.contract.views.observe([now]).read();
//     }

//     return await this.contract.views.observe(timestamps).read();
//   }

//   setCallSetting(callSetting: CallSettings) {
//     this.callSettings = callSetting;
//   }
// }