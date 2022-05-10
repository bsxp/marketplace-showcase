import React, { ReactElement } from "react"
import { INFTDatabaseStorefrontListing } from "../../../contexts/types"
import Select from "../../general/Select";

interface IListingsDisplayProps {
    listings:         any;
    onSelectListing:  (listing: INFTDatabaseStorefrontListing) => void;
    price:            number | string;
    isAbleToPurchase: boolean;
}

const ListingsDisplay: React.FC<IListingsDisplayProps> = ({ listings, onSelectListing, price, isAbleToPurchase=true }): ReactElement => {
    
	if (Object.keys(listings).length === 0 || !isAbleToPurchase) {
		return (
			<p className="text-gray-600 font-sm text-center font-semibold my-2">
                This token is currently sold out or unavailable.
			</p>
		);
	}

	const handleSelectListing = (listing: INFTDatabaseStorefrontListing) => {
		onSelectListing(listing)
	}

	return (
		<div className="text-center w-full flex-grow p-1">
			<p className="my-2 font-semibold text-gray-600 text-sm text-center items-center">
                Select Can edition 
			</p>
			<div className="flex justify-between space-x-8">
				<Select
					options={Object.values((listings || []) as any[]).sort((a: any, b: any) => a.token_edition - b.token_edition) || []}
					onSelect={handleSelectListing}
				/>
			</div>
		</div>
	);
};

export default ListingsDisplay;
