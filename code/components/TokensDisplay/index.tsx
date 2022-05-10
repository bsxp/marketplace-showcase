
import React, { createRef, useEffect, useMemo, useRef } from "react"
import { useNavigate } from "react-router";
import { IBeerTokenSetData } from "../../../contexts/types";
import TokenCard from "../../general/TokenCard"
import ReactGA from "react-ga";
import { BeerTokenProductData } from "../PurchaseDialog/ConfirmView";
import { SortFunction } from "../Filters/SortDropdownMenu";
import { useMarket } from "../../../contexts/MarketContext";

type MarketTokenCardWrapperProps = {
    token: BeerTokenProductData;
};

export const MarketTokenCardWrapper: React.FC<MarketTokenCardWrapperProps> = ({ token }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		try {
			ReactGA.plugin.execute("ec", "addProduct", {
				id: token.id,
				name: token.name,
				category: "BakeSale Can",
				brand: token.metadata?.brewery,
				price: Math.ceil(Number(token.price) / 100),
				quantity: 1
			})

			ReactGA.plugin.execute("ec", "setAction", "click", { list: "Market Results" })

			ReactGA.ga("send", "event", "UX", "click", "Marketplace", {
				hitCallback: () => {
					navigate("/token/" + token.id)
				}
			})
		} catch (err) {
			navigate("/token/" + token.id)
		}

	}

	return (
		<a
			className="cursor-pointer col-span-1"
			onClick={handleClick}
		>
			<TokenCard
				token={token}
				className="duration-300 ease-in-out border-gray-200 shadow-[0px_5px_12px_4px_rgba(0,0,0,0.05)]"
			/>
		</a>
	);
};


type TokenDisplayProps = {
    label?: string;
    allowsLoadMore?: boolean;
    tokenIds: number[];
    tokenDatas: {[key: number]: IBeerTokenSetData};
    filters?: ((token: any) => boolean)[];
    withVideo?: boolean;
    noDisplayingTokensMessage?: string;
    sortFunction?: SortFunction
}

const TokensDisplay: React.FC<TokenDisplayProps> = ({
	label,
	allowsLoadMore = false,
	tokenIds=[],
	tokenDatas=[],
	filters=[],
	noDisplayingTokensMessage,
	sortFunction=() => 1
}) => {

	const { displayNextPage, numPagesToDisplay } = useMarket();
    
	const vidRefs = useRef<any[]>([]);

	const applyFilters = (token: IBeerTokenSetData): boolean => {
		for (const filter of Object.values(filters)) {
			if (!filter(token)) {
				return false
			}
		}
		return true
	} 

	// Memoize the token list, only update when new token IDs are added (they shouldn't) or a filter is changed
	const usableTokenList = useMemo(() => {
		return tokenIds
			.map((id: number) => tokenDatas[id])
			.filter((x: any) => x !== undefined)
			.filter((token) => {
				return applyFilters(token)
			})
			.sort(sortFunction)
	}, [tokenIds, filters, sortFunction]);

	const hasTokens = usableTokenList.length > 0;

	useEffect(() => {
		vidRefs.current = usableTokenList.map((token: IBeerTokenSetData, i: number) => vidRefs.current[i] || createRef())
	}, []);

	const tokensToDisplay = usableTokenList.slice(0, 20 * numPagesToDisplay);

	return (
		<div className="space-y-4">
			{label && (
				<h6 className="text-lg color-black font-semibold">
					{label}
				</h6>
			)}
			<div className="
            gap-2
            grid grid-cols-2
            md:gap-4 md:grid-cols-3
            lg:gap-8 lg:grid-cols-4
            ">
				{tokensToDisplay.map((token: any, i: number) => {
					return (
						<MarketTokenCardWrapper
							token={token}
							key={`token-carousel-card-${i}`}
						/>
					)
				})}
			</div>
			{noDisplayingTokensMessage && Object.keys(tokenDatas).length > 0 && usableTokenList.length === 0 && (
				<p>
					{noDisplayingTokensMessage}
				</p>
			)}
			{allowsLoadMore && hasTokens && (usableTokenList.length > 20 * numPagesToDisplay) && (
				<div className="flex justify-center w-full !mt-20">
					<button className="bg-theme-blue text-black rounded-lg px-8 py-2 font-medium" onClick={displayNextPage}>
                        Load more
					</button>
				</div>
			)}
		</div>
	);
};

export default TokensDisplay;
