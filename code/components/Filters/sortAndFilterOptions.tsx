import React from "react";
import { BeerTokenProductData } from "../PurchaseDialog/ConfirmView";
import { FilterSelection } from "./FilterDropdownMenu";
import { SortSelection } from "./SortDropdownMenu";
import { BiSortAlt2 } from "react-icons/bi";
import { OfficeBuildingIcon } from "@heroicons/react/solid";

interface Category {
    filterId: string;
    label: string;
    labelCallback?: (val: any) => string;
    icon: JSX.Element;
}

export declare interface FilterCategory extends Category {
    filterCallback: (token: BeerTokenProductData, filter: any) => boolean;
    multiselect?: boolean;
    options: FilterSelection[];
}

export declare interface SortCategory extends Category {
    options: SortSelection[];
}

function capitalizeOutSideOfParentheses(string: string) {
	const indexOfOpen = string.indexOf("(");
	const indexOfClose = string.indexOf(")");

	return string.slice(0, indexOfOpen).toLowerCase() + string.slice(indexOfOpen, indexOfClose) + string.slice(indexOfClose, string.length).toLowerCase();
}

/**
 * @todo  Switch options to API call (see BS-365 for details)
 */
export const filterContents: FilterCategory[] = [
	{
		filterId: "brewery",
		filterCallback: (token, options) => {
			const tokenBreweryName = token.metadata?.brewery.toLowerCase();
			const isFoundInActiveOptions = Boolean(options.find((option: FilterSelection) => option.label.toLowerCase() === tokenBreweryName));
			return isFoundInActiveOptions
		},
		label: "Breweries",
		labelCallback: (options) => options.length > 0 ? `Breweries (${options.length})` : "Breweries",
		icon: <OfficeBuildingIcon className="h-auto w-4" />,
		multiselect: true,
		options: [
			{
				label: "Strike Brewing Co.",
				icon: undefined,
			},
			{
				label: "Devil's Canyon Brewing Company",
				icon: undefined,
			},
			{
				label: "ShaKa Brewing",
				icon: undefined,
			},
			{
				label: "Lakes & Legends Brewing Company",
				icon: undefined,
			}

		]
	}
]

/**
 * @todo Add price sorting (min -> max, max -> min)
 */
export const sortContents: SortCategory[] = [
	{
		filterId: "sort",
		label: "Sort by",
		labelCallback: (selectedOption) => selectedOption ? `Sorting by ${capitalizeOutSideOfParentheses(selectedOption.label)}` : "Sort by",
		icon: <BiSortAlt2 />,
		options: [
			{
				label: "Name (A-Z)",
				icon: undefined,
				callback: (tokenA: BeerTokenProductData, tokenB: BeerTokenProductData) => tokenA.name.localeCompare(tokenB.name)
			},
			{
				label: "Name (Z-A)",
				icon: undefined,
				callback: (tokenA: BeerTokenProductData, tokenB: BeerTokenProductData) => -1 * tokenA.name.localeCompare(tokenB.name)
			},
			{
				label: "Newest first",
				icon: undefined,
				callback: (tokenA: BeerTokenProductData, tokenB: BeerTokenProductData) => new Date(tokenB.created_at || new Date()).getTime() - new Date(tokenA.created_at || new Date()).getTime()
			},
			{
				label: "Oldest first",
				icon: undefined,
				callback: (tokenA: BeerTokenProductData, tokenB: BeerTokenProductData) => -1 * (new Date(tokenB.created_at || new Date()).getTime() - new Date(tokenA.created_at || new Date()).getTime())

			},
		]
	}
]