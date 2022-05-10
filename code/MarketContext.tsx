import React, { PropsWithChildren, ReactNode } from "react";
import { useContext, createContext, useEffect, useState, useMemo } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { Context, IBeerTokenSetData, MarketContentState, SetId, TokenMetadata } from "./types";
import { apiGatewayResolver } from "../__api__/gateway";
import { BeerTokenProductData } from "../components/market/PurchaseDialog/ConfirmView";

const defaultValues: MarketContentState = {
	searchQuery: "",
	purchasing: false,
	tokenIds: [],
	tokenDatas: {},
}

type SortFunction = (a: BeerTokenProductData, b: BeerTokenProductData) => -1 | 1 | 0

interface MarketProviderProps {
	children: ReactNode
}

export const MarketContext = createContext<Context<MarketContentState> | any>(defaultValues);

/**
 * @description Controls the market state for the customer. Manages filters + list of tokens + pagination
 */
export const MarketProvider: React.FC<PropsWithChildren<MarketProviderProps>> = ({ children=[] })  => {

	const [tokenIds, setTokenIds] = useState<number[]>([]);
	const [cachedTokens, setCachedTokens] = useState<{[key: SetId]: IBeerTokenSetData}>({});

	const [filters, setFilters] = useState<{[key: string]: (token: BeerTokenProductData) => boolean}>({});
	const [sortFunction, setSortFunction] = useState<SortFunction | null>(null);

	const [numPagesToDisplay, setNumPagesToDisplay] = useState<number>(1);

	const displayNextPage = () => {
		setNumPagesToDisplay((num) => num + 1);
	}

	const fetchAllSets = async () => {
        
		// Fetch sets
		const setsRes = await apiGatewayResolver({
			func: "sets",
			methodType: "GET",
			queryParams: {
				network: process.env.REACT_APP_CHAIN_ENV
			}
		})

		for (const set of setsRes.data || []) {

			// If a set has already been added, skip state updates
			if (!cachedTokens[set.id]) {
                
				// Avoid additional rerenders in async setState DON'T REMOVE revisit after React 18.1
				unstable_batchedUpdates(() => {

					setTokenIds((state) => [...state, set.id]);

					// TODO: Update API to return metadata as object instead of array of { name, value }
					// TODO: Cache in-browser and make initial fetch to browser if not stale (sub 1 hr maybe?)
					setCachedTokens((state) => ({
						...state,
						[set.id]: {
							...set,
							metadata: Object.fromEntries(set?.metadata?.map((metadata: TokenMetadata) => [metadata.name, metadata.value]) || [])
						}
					}));
				})
			}
		}
	};

	useEffect(() => {
		fetchAllSets();
	}, []);
    
	return (
		<MarketContext.Provider
			value={{
				tokenIds: tokenIds,
				tokenDatas: useMemo(() => cachedTokens, [cachedTokens]),
				filters,
				setFilters,
				sortFunction,
				setSortFunction,
				numPagesToDisplay,
				displayNextPage
			}}
		>
			{children}
		</MarketContext.Provider>
	)
}

export const MarketConsumer = MarketContext.Consumer;

export const useMarket = () => useContext(MarketContext);
