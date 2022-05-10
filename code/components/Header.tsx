import React from "react"
import Divider from "../general/Divider"

/**
 * @description Header text for the marketplace
 * @todo reimplement? -- currently swapped out for a banner
 */
export default function Header() {
	return (
		<div className="space-y-4">
			<p className="font-semibold text-black text-4xl">
                Explore the BakeSale world
			</p>
			<Divider />
		</div>
	)
}
