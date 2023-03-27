export default {
  transformUri(uri) {
    const gateway = "https://nftstorage.link/ipfs/";
    uri = uri.replace("ipfs://", gateway);
    uri = uri.replace("https://gateway.pinata.cloud/ipfs/", gateway);
    uri = uri.replace("https://ipfs.io/ipfs/", gateway);
    return uri;
  },
};
