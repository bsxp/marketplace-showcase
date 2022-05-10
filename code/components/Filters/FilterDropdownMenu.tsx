import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MdOutlineArrowDropDown } from "react-icons/md"
import { BiCheck } from "react-icons/bi";
import { useMarket } from "../../../contexts/MarketContext";
import { BeerTokenProductData } from "../PurchaseDialog/ConfirmView";
import { useLocation } from "react-router";
import _ from "lodash";

export interface FilterSelection {
    label: string;
    icon?: JSX.Element;
}

interface FilterDropdownMenuProps {
    filterId:       string;
    options:        FilterSelection[];
    filterCallback: (token: BeerTokenProductData, filter: any) => boolean;
    label:          string;
    labelCallback?: (val: any) => string;
    icon?:          JSX.Element;
    multiselect?:   boolean;
}

// TODO: add multi select support (optional prop)
type FilterFunction = (token: BeerTokenProductData) => boolean;

/**
 * @description Apply filters to the marketplace. Filters can be multiselect (checkbox) or single select (radio).
 */
const FilterDropdownMenu: React.FC<FilterDropdownMenuProps> = ({
	filterId,
	options,
	filterCallback,
	label,
	labelCallback,
	icon,
	multiselect=false
}) => {

	const { setFilters } = useMarket();

	//TODO: track down react-router @types module
	const location: any = useLocation();

	const [currentSelections, setCurrentSelections] = useState<FilterSelection[]>([]);

	// Only initialize with all options selected if its a multiselect
	useEffect(() => {
		if (multiselect) {
			const clientName = location?.state?.filters?.client;
			if (clientName) {
				setCurrentSelections(options.filter((option) => option.label === clientName));
			} else {
				setCurrentSelections(options);
			}
		}
	}, [])

	const filterFunction: FilterFunction = (token: BeerTokenProductData) => {
		return filterCallback(token, currentSelections);
	}

	useEffect(() => {
		if (currentSelections.length >= 0) {
			setFilters((filters: { [key: string]: (token: BeerTokenProductData) => boolean }) => {
				const newState = _.cloneDeep(filters);
				newState[filterId] = filterFunction;
				return newState
			})
		}
	}, [currentSelections])

	const handleFilterOptionClick = (option: FilterSelection) => {
        
		const shouldRemove = currentSelections.indexOf(option) !== -1;

		if (multiselect) {
			// Enable more than one selection
			setCurrentSelections((state) => {
				if (shouldRemove) {
					const copy = [...state];
					return copy.filter((possibleOption) => possibleOption != option)
				} else {
					return [...state, option]
				}
			})
		} else {
			// Override existing selection, or remove if same selection
			setCurrentSelections(() => {
				if (shouldRemove) {
					return [];
				} else {
					return [option];
				}
			})
		}
	};

	return (
		<Menu
			as="div"
			className="relative inline-block text-left"
		>
			{({ open }) => (
				<>
					<Menu.Button
						className="border border-gray-200 text-gray-700 px-2 py-1 rounded-md bg-white flex items-center font-medium text-[14px]
						hover:bg-gray-200 hover:saturate-50 duration-200
						md:text-sm"
					>
						{icon}
						<p className="ml-2">
							{labelCallback ? labelCallback(currentSelections) : label}
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
							className="absolute left-0 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden"
						>
							<div className="p-1">
								{options.map((option) => (
									<Menu.Item className="w-full" as="div" onClick={() => handleFilterOptionClick(option)} key={option.label}>
										{({ active }) => (
											<button
												className={`${
													active ? "bg-theme-blue text-white" : "text-gray-700"
												} group flex rounded-md items-center w-full px-2 py-2 text-left truncate font-medium text-sm`}
											>
												<div className="flex items-center">
													<div className="w-6 flex justify-start items-center">
														{currentSelections.indexOf(option) !== -1 && <BiCheck />}
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

export default FilterDropdownMenu
