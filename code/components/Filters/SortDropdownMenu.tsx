import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react"
import { MdOutlineArrowDropDown } from "react-icons/md"
import { BiCheck } from "react-icons/bi";
import { useMarket } from "../../../contexts/MarketContext";
import { BeerTokenProductData } from "../PurchaseDialog/ConfirmView";
import _ from "lodash"


export interface SortSelection {
    label: string;
    icon?: JSX.Element;
    callback: SortFunction; 
}


interface SortDropdownMenuProps {
    filterId: string;
    options: SortSelection[];
    label: string;
    labelCallback?: (val: any) => string;
    icon?: JSX.Element;
    multiselect?: boolean;
}

export type SortFunction = (tokenA: BeerTokenProductData, tokenB: BeerTokenProductData) => any;

/**
 * @description Apply sorting functions to the marketplace. Sorts are single select (radio).
 */
const SortDropdownMenu: React.FC<SortDropdownMenuProps> = ({
	options,
	label,
	labelCallback,
	icon,
}) => {

	const { setSortFunction } = useMarket();

	const [currentSelection, setCurrentSelection] = useState<SortSelection | null>(null);

	useEffect(() => {
		setSortFunction(currentSelection);
	}, [currentSelection])

	const handleFilterOptionClick = (option: SortSelection) => {
        
		const shouldRemove = _.isEqual(currentSelection, option);

		setCurrentSelection(() => {
			if (shouldRemove) {
				return null;
			} else {
				return option;
			}
		})
	};

	return (
		<Menu
			as="div"
			className="relative inline-block text-left"
		>
			{({ open }) => (
				<>
					<Menu.Button
						className="border border-gray-200 text-gray-700 px-2 py-1 rounded-md bg-white flex items-center font-medium text-sm
                   		hover:bg-gray-200 hover:saturate-50 duration-200"
					>
						{icon}
						<p className="ml-2">
							{labelCallback ? labelCallback(currentSelection) : label}
						</p>
						<MdOutlineArrowDropDown className="h-auto w-6 duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }}/>
					</Menu.Button>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<Menu.Items
							className="absolute right-0 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden"
						>
							<div className="p-1">
								{options.map((option) => (
									<Menu.Item className="w-full" as="div" onClick={() => handleFilterOptionClick(option)} key={option.label}>
										{({ active }) => (
											<button
												className={`${
													active ? "bg-theme-blue text-white" : "text-gray-700"
												} group flex rounded-md items-center w-full px-2 py-2 text-sm text-left truncate font-medium`}
											>
												<div className="flex items-center">
													<div className="w-6 flex justify-start items-center">
														{_.isEqual(currentSelection, option) && <BiCheck />}
													</div>
													{option.label}
												</div>
											</button>
										)}
									</Menu.Item>
								))}
							</div>
						</Menu.Items>
					</Transition>
				</>
			)}
		</Menu>
	)
}

export default SortDropdownMenu
