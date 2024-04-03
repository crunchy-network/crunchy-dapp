import { Tezos } from "./tezos";
import { TaquitoTezosDomainsClient } from "@tezos-domains/taquito-client";

const client = new TaquitoTezosDomainsClient({
  tezos: Tezos,
  network: process.env.VUE_APP_TEZOS_NETWORK,
  caching: { enabled: true },
});

export default {
  async resolveAddressToName(address, fallback) {
    return client.resolver.resolveAddressToName(address).then((res) => {
      return res || fallback || address;
    });
  },
  async resolveNameToAddress(name) {
    return client.resolver.resolveNameToAddress(name).then((res) => {
      return res || null;
    });
  },
};
