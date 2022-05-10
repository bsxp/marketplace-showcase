import React from "react";
import Divider from "../components/general/Divider";
import Filters from "../components/market/Filters";
import MarketBanner from "../components/market/MarketBanner";
import TokensDisplay from "../components/market/TokensDisplay";
import { MarketConsumer, useMarket } from "../contexts/MarketContext";

/**
 * @description Wraps the tokens display so we can access state from the market consumer
 */
const MarketTokensDisplayWrapper = () => {
	const { tokenIds, tokenDatas, filters, sortFunction } = useMarket();

	return (
		<TokensDisplay
			allowsLoadMore={true}
			tokenIds={tokenIds}
			tokenDatas={tokenDatas}
			filters={filters}
			sortFunction={sortFunction?.callback}
			withVideo={false}
			noDisplayingTokensMessage="No tokens match these filters. Try adjusting your search."
		/>
	)
}

/**
 * @description Marketplace to purchase tokens 
 */
const Market: React.FC = () =>  {
    
	return (
		<MarketConsumer>
			{() => (
				<div className="flex justify-center">
					<div className="max-w-4xl w-full p-y-8 space-y-8">
						<section className="px-4 lg:px-0 space-y-8">
							<MarketBanner />
						</section>
						<section id="search-and-filter">
							<Filters />
						</section>
						<section>
							<Divider className="my-4"/>
						</section>
						<section className="px-4 md:px-0">
							<MarketTokensDisplayWrapper />
						</section>
					</div> 
				</div>
			)}
		</MarketConsumer>
	)
}

export default Market