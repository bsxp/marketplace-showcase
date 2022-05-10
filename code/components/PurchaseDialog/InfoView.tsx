import React from "react"
import { ReactComponent as HereIcon } from "../../../icons/here.svg"
import { BeerStyles } from "../../../utils/beerStyleColors";
import { OfficeBuildingIcon } from "@heroicons/react/outline";
import { BeerTokenProductData } from "./ConfirmView";

interface IInfoViewProps {
    isAbleToPurchase: boolean;
    token:            BeerTokenProductData;
    ref?: any;
}

const metadataClasses = "flex items-center text-sm text-gray-700 bg-gray-100 rounded-xl p-2 h-8";

const InfoView: React.FC<IInfoViewProps> = React.forwardRef<HTMLDivElement, IInfoViewProps>(({ token }, ref) => {

	return (
		<div ref={ref} className="flex-grow">
			<h4>
				<span className="font-bold text-2xl"> 
					{token.name}
				</span>
			</h4>
			<h6 className="mb-4">
				<span>
					{token.price && token.active && `$${Number(token.price / 100).toFixed(2)}` || "Unavailable"}
				</span>
			</h6>
			<p className="text-sm text-gray-700">
				{token.description}
			</p>
			<div className="font-body mt-3 space-y-1 w-full flex flex-col">
				<p className={metadataClasses}>
					<OfficeBuildingIcon className="h-[14px] max-w-[14px] mr-2 fill-gray-500"/>
					{token.metadata?.brewery}
				</p>
				<p className={metadataClasses}>
					<HereIcon className="h-[14px] max-w-[14px] mr-2 fill-gray-500"/>
					{token.metadata?.location}
				</p>
				<p className={metadataClasses}>
					<span className="rounded-full h-[14px] w-[14px] mr-2" style={{ backgroundColor: BeerStyles.paleLager }}/> 
					{token.metadata?.style}
				</p>
			</div>
		</div>
	)
})

export default InfoView;
