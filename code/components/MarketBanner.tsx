import React from "react";
import BSLogo from "../../icons/bakesale_logo.png";

export default function MarketBanner() {

	return (
		<div
			className="w-full p-4 md:p-8 flex shadow-xl rounded-2xl space-y-8 md:min-h-[300px]"
			style={{
				background: "linear-gradient(145deg,#A2D3FF,#C3E1FB,#F2C3E9,#F0D884)"
			}}
		>
			<div className="flex flex-col flex-grow space-between items-start">
				<h1 className="font-extrabold text-xl md:text-3xl">
                    Freshly Baked Cans
				</h1>
				<h3 className="mt-4">
					<span className="font-regular text-sm md:text-lg">
                        Cans are a digital representation of real beer, offered to you from our partner craft breweries; sort of like a collectable sticker. Cans feature authentic label art from amazing brewers.
						<br/>
						<br/>
                        Owning a Can shows your support for a local brewery and craft beer.
						<br/>
                        Collect your favorite Can today!
					</span>
				</h3>
			</div>
			<div className="flex justify-center items-center h-full ml-4">
				<img src={BSLogo} className="max-h-72 object-contain h-auto" />
			</div>
		</div>
	)
}
