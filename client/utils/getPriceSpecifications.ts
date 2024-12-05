interface Params {
	minPrice: number;
	maxPrice: number;
	price?: number;
}

export const getPriceSpecifications = ({
	maxPrice,
	minPrice,
	price = 0,
}: Params) => {
	if (!price) return null;

	const diff = maxPrice - minPrice;
	const priceMargin = diff / 3;
	const mediumStart = minPrice + priceMargin;
	const mediumEnd = maxPrice - priceMargin;
	const isLowPrice = price < mediumStart;
	const isHightPrice = price > mediumEnd;
	const isMediumPrice = price - mediumStart <= priceMargin;

	return { isLowPrice, isHightPrice, isMediumPrice };
};
