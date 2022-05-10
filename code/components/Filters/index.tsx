import React from "react";
import FilterDropdownMenu from "./FilterDropdownMenu";
import SortDropdownMenu from "./SortDropdownMenu";
import { FilterCategory, filterContents, SortCategory, sortContents } from "./sortAndFilterOptions";

/**
 * @description List of filters for the marketplace
 */
const Filters: React.FC = () => {
	return (
		<div className="flex gap-x-4 items-center mx-4 md:mx-0">
			{filterContents.map((filter) => {
				return <FilterDropdownMenu {...filter as FilterCategory} key={filter.filterId}/>
			}
			)}
			{sortContents.map((sort) => {
				return <SortDropdownMenu {...sort as SortCategory} key={sort.filterId}/>
			})}
		</div>
	)
}

export default Filters
