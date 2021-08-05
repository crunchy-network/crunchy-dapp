export default {

  transformUri (uri) {
    uri = uri.replace('ipfs://', 'https://ipfs.fleek.co/ipfs/');
    uri = uri.replace('https://gateway.pinata.cloud/ipfs/', 'https://ipfs.fleek.co/ipfs/');
    return uri;
  }

}