export default {

  transformUri (uri) {
    return uri.replace('ipfs://', 'https://ipfs.fleek.co/ipfs/');
  }

}