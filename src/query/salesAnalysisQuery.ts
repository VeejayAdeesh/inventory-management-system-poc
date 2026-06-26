const buildPipeline = (startDate: Date, shopId: string | undefined) => {
	const match = {
		createdAt: {
			$gte: {
				$date: startDate.toISOString(),
			},
		},
		...(shopId && {
			shopId: {
				$oid: shopId,
			},
		}),
	};
	return [
		{
			$match: match,
		},
		{
			$group: {
				_id: null,
				totalSales: {
					$sum: "$saleAmount",
				},
				creditAmt: {
					$sum: {
						$ifNull: ["$balanceAmount", 0],
					},
				},
				paidAmt: {
					$sum: "$paidAmount",
				},
				paidInCash: {
					$sum: {
						$cond: [{ $eq: ["$paymentMethod", "CASH"] }, "$paidAmount", 0],
					},
				},
				paidInMobileMoney: {
					$sum: {
						$cond: [
							{ $eq: ["$paymentMethod", "MOBILEMONEY"] },
							"$paidAmount",
							0,
						],
					},
				},
			},
		},
	];
};

export const generateSalesDataQueryAllShops = (
	startOfToday: Date,
	startOfMonth: Date,
	startOfYear: Date,
) => {
	return [
		{
			$facet: {
				today: buildPipeline(startOfToday, undefined),
				month: buildPipeline(startOfMonth, undefined),
				year: buildPipeline(startOfYear, undefined),
			},
		},
	];
};

export const generateSalesDataQueryForShop = (
	startOfToday: Date,
	startOfMonth: Date,
	startOfYear: Date,
	shopId: string,
) => {
	return [
		{
			$facet: {
				today: buildPipeline(startOfToday, shopId),
				month: buildPipeline(startOfMonth, shopId),
				year: buildPipeline(startOfYear, shopId),
			},
		},
	];
};
