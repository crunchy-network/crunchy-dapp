import axios from "axios";

const BASE_URL = "https://api.crunchy.network/v1";

export default {
  async getAllTokens() {
    try {
      const response = await axios.get(`${BASE_URL}/tokens`);
      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching all tokens:", error);
      return [];
    }
  },

  async getAllTokenSpot() {
    try {
      const response = await axios.get(`${BASE_URL}/tokens/quotes/spot`);

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching all token spot:", error);
      return [];
    }
  },

  async getAllTokenPools() {
    try {
      const response = await axios.get(`${BASE_URL}/pools`);

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching all token spot:", error);
      return [];
    }
  },
  async getAllQuotes1D() {
    try {
      const response = await axios.get(`${BASE_URL}/tokens/quotes/last/1d`);

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching all quotes 1 day:", error);
      return [];
    }
  },
  async getAllQuotes1W() {
    try {
      const response = await axios.get(`${BASE_URL}/tokens/quotes/last/1w`);

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching all quotes 1 week:", error);
      return [];
    }
  },
  async getAllQuotes1MO() {
    try {
      const response = await axios.get(`${BASE_URL}/tokens/quotes/last/1mo`);

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching all quotes 1 month:", error);
      return [];
    }
  },
  async getQuotes1H(tokenAddress, tokenId) {
    try {
      const response = await axios.get(
        `${BASE_URL}/tokens/${tokenAddress}/${tokenId}/quotes/1h`
      );

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching all quotes 1h:", error);
      return [];
    }
  },
  async getQuotes1D(tokenAddress, tokenId) {
    try {
      const response = await axios.get(
        `${BASE_URL}/tokens/${tokenAddress}/${tokenId}/quotes/1d`
      );

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching all quotes 1 day:", error);
      return [];
    }
  },
  async getQuotes1W(tokenAddress, tokenId) {
    try {
      const response = await axios.get(
        `${BASE_URL}/tokens/${tokenAddress}/${tokenId}/quotes/1w`
      );

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching all quotes 1 week:", error);
      return [];
    }
  },
  async getQuotes1MO(tokenAddress, tokenId) {
    try {
      const response = await axios.get(
        `${BASE_URL}/tokens/${tokenAddress}/${tokenId}/quotes/1mo`
      );

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching all quotes 1 month:", error);
      return [];
    }
  },
  async getToken(tokenAddress, tokenId) {
    try {
      const response = await axios.get(
        `${BASE_URL}/tokens/${tokenAddress}/${tokenId}/quotes/spot`
      );

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching a token:", error);
      return [];
    }
  },
  async getAggregatedPriceAndVolume1D(bucketStart) {
    try {
      const response = await axios.get(
        `${BASE_URL}/tokens/quotes/aggregated/1d?bucketStart=${bucketStart}`
      );

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching aggregated price and volume 1 day:", error);
      return [];
    }
  },
  async getAggregatedPriceAndVolume1W(bucketStart) {
    try {
      const response = await axios.get(
        `${BASE_URL}/tokens/quotes/aggregated/1w?bucketStart=${bucketStart}`
      );

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(
        "Error fetching aggregated price and volume 1 week:",
        error
      );
      return [];
    }
  },
  async getAggregatedPriceAndVolume1MO(bucketStart) {
    try {
      const response = await axios.get(
        `${BASE_URL}/tokens/quotes/aggregated/1mo?bucketStart=${bucketStart}`
      );

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(
        "Error fetching aggregated price and volume 1 month:",
        error
      );
      return [];
    }
  },
  async getSpot1D() {
    try {
      const response = await axios.get(
        `${BASE_URL}/tokens/quotes/aggregated/spot/1d`
      );

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching spot 1d:", error);
      return [];
    }
  },
  async getSpot1W() {
    try {
      const response = await axios.get(
        `${BASE_URL}/tokens/quotes/aggregated/spot/1w`
      );

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching spot 1d:", error);
      return [];
    }
  },
  async getSpot1MO() {
    try {
      const response = await axios.get(
        `${BASE_URL}/tokens/quotes/aggregated/spot/30d`
      );

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching spot 1d:", error);
      return [];
    }
  },
};
