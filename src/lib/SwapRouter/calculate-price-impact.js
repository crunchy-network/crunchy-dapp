import axios from "axios";

export const calculatePriceImpact = async (trade) => {
  try {
    const response = await axios.post(
      `${process.env.VUE_APP_DEX_AGG_API}/calculatePriceImpact`,
      trade
    );
    
    const { success, priceImpact, error } = response.data;
    if (!success) {
      throw new Error(`Error: ${error}`);
    }

    return priceImpact;
  } catch (error) {
    throw new Error(`Failed to fetch price impact: ${error.message}`);
  }
};