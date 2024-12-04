import { PriceData } from "../../../types"

export const doGetPrices = async () => {
    const response = await fetch("/api/prices")
    return await response.json() as PriceData

}