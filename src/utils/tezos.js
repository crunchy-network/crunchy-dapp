import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit, MichelCodecPacker } from "@taquito/taquito";
import { Tzip12Module, tzip12 } from "@taquito/tzip12";
import { Tzip16Module, tzip16 } from "@taquito/tzip16";

const Tezos = new TezosToolkit(process.env.VUE_APP_TEZOS_RPC_URL);
Tezos.addExtension(new Tzip12Module());
Tezos.addExtension(new Tzip16Module());
Tezos.setPackerProvider(new MichelCodecPacker());

const wallet = new BeaconWallet({
  name: process.env.VUE_APP_TEZOS_DAPP_NAME,
  preferredNetwork: process.env.VUE_APP_TEZOS_NETWORK,
  colorMode: "light",
  featuredWallets: ["temple", "kukai", "plenty", "airgap"],
  walletConnectOptions: {
    projectId: "e6222632c97c5609b45315bc5682bf79",
  },
});

// Setting the wallet as the wallet provider for Taquito.
Tezos.setWalletProvider(wallet);

const network = {
  type: process.env.VUE_APP_TEZOS_NETWORK,
  rpcUrl: process.env.VUE_APP_TEZOS_RPC_URL,
};

const requestPermissions = async () => {
  return wallet.requestPermissions({ network });
};

const getActiveAccount = async () => {
  const activeAccount = await wallet.client.getActiveAccount();

  // no active account, we need permissions first
  if (!activeAccount) {
    await requestPermissions();
    return getActiveAccount();
  }

  return activeAccount;
};

const clearActiveAccount = async () => {
  return wallet.client.clearActiveAccount();
};

const getTokenMetadata = async (address, tokenId) => {
  const contract = await Tezos.contract.at(address, tzip12);
  return contract.tzip12().getTokenMetadata(tokenId);
};

const getContractViews = async (address) => {
  const contract = await Tezos.contract.at(address, tzip16);
  return contract.tzip16().metadataViews();
};

const getContract = async (address) => {
  return Tezos.contract.at(address);
};

const getWalletContract = async (address) => {
  return Tezos.wallet.at(address);
};

const getBatch = (operations = []) => {
  return Tezos.wallet.batch(operations);
};

export {
  Tezos,
  wallet,
  getActiveAccount,
  requestPermissions,
  clearActiveAccount,
  getTokenMetadata,
  getContractViews,
  getContract,
  getBatch,
  getWalletContract,
};
