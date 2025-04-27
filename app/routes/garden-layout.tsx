import React, { useEffect, useState } from 'react';
import { useGardenStore } from '~/store/store';
import {
	allVegetables,
	type EditingNoteCell,
	type VegetableInfo,
} from '~/utils/constants';
import { formatDate } from '../utils/format-date';
import { calculateYield } from '../utils/calculate-yield';
import { isInSeason } from '../utils/in-season';
import { getSpacingRecommendation } from '../utils/space-recommendation';

export default function layout() {
	const {
		setPlantedPlants,
		climateZone,
		currentMonth,
		plantedPlants,
		gardenLayout,
		setGardenLayout,
		gardenSize,
		setGardenSize,
		plantArea,
		cellNotes,
		setCellNotes,
	} = useGardenStore();
	const [isHydrated, setIsHydrated] = useState<boolean>(false);
	const [showOnlyInSeason, setShowOnlyInSeason] = useState(false);
	const [selectedVeggie, setSelectedVeggie] = useState<VegetableInfo | null>(
		null
	);
	const [currentNote, setCurrentNote] = useState('');
	const [editingNoteCell, setEditingNoteCell] =
		useState<EditingNoteCell | null>(null);

	console.log(gardenLayout);
	// Create a new garden layout grid
	const initializeGardenLayout = (reset: boolean = false): void => {
		if (gardenLayout.length > 0 && !reset) return;

		const newLayout = [];
		for (let y = 0; y < gardenSize.height; y++) {
			const row = [];
			for (let x = 0; x < gardenSize.width; x++) {
				row.push({ x, y, veggie: null });
			}
			newLayout.push(row);
		}
		setGardenLayout(newLayout);
	};

	const vegetables = allVegetables.map((veggie) => ({
		...veggie,
		bestPlantingMonths: veggie.climateZones[climateZone] || [],
	}));

	// Calculate total space used by each vegetable type
	const calculateGardenUsage = () => {
		const veggieCount: { [key: string]: number } = {};

		for (const row of gardenLayout) {
			for (const cell of row) {
				if (cell.veggie) {
					const veggieName = cell.veggie.name;
					veggieCount[veggieName] = (veggieCount[veggieName] || 0) + 1;
				}
			}
		}

		return veggieCount;
	};

	// Handle adding a note to a cell
	const addNoteToCell = (x: number, y: number) => {
		if (!currentNote.trim()) {
			setEditingNoteCell(null);
			return;
		}

		const cellKey = `${x}-${y}`;
		setCellNotes({
			...cellNotes,
			[cellKey]: currentNote,
		});

		setCurrentNote('');
		setEditingNoteCell(null);
	};

	const placeVeggieInGarden = (x: number, y: number) => {
		if (!selectedVeggie) return;

		const newLayout = [...gardenLayout];
		const cell = newLayout[y][x];

		// If cell already contains this veggie, remove it
		if (cell.veggie && cell.veggie.id === selectedVeggie.id) {
			newLayout[y][x] = { ...cell, veggie: null };
		} else {
			// Otherwise place the veggie
			newLayout[y][x] = { ...cell, veggie: selectedVeggie };

			// Add to plantings if not already there
			const existingPlanting = plantedPlants.find(
				(p) => p.name === selectedVeggie.name
			);
			if (!existingPlanting) {
				addSpecificVeggie(selectedVeggie.id);
			}
		}

		setGardenLayout(newLayout);
	};

	const addSpecificVeggie = (id: number) => {
		const veggie = vegetables.find((v) => v.id === id);
		if (!veggie) return;

		const today = new Date();
		const harvestDate = new Date();
		harvestDate.setDate(today.getDate() + veggie.timeToHarvest);

		const newPlanting = {
			...veggie,
			plantDate: formatDate(today),
			harvestDate: formatDate(harvestDate),
			area: `${plantArea} m²`,
			yieldPerPlant: veggie.yieldPerPlant,
			estimatedYield: calculateYield(veggie, plantArea),
		};

		setPlantedPlants([...plantedPlants, newPlanting]);

		// Switch to planner tab
		//setActiveTab('planner');
	};

	useEffect(() => {
		if (gardenLayout.length === 0 && isHydrated) {
			initializeGardenLayout();
		}
	}, [gardenLayout.length, isHydrated]);

	// TODO: bullshit method try to get something better
	useEffect(() => {
		setIsHydrated(true);
	}, []);

	return (
		<div>
			<div className="mb-4">
				<h2 className="text-xl text-green-700">Garden Layout Designer</h2>
				<p className="text-sm text-gray-600">
					Design your garden layout by selecting a vegetable and clicking on the
					grid
				</p>
			</div>

			<div className="flex flex-col md:flex-row gap-6">
				<div className="md:w-1/3">
					<div className="bg-white p-4 rounded border border-gray-200 mb-4">
						<h3 className="font-medium text-green-700 mb-2">Garden Settings</h3>
						<div className="flex gap-2 items-center mb-4">
							<div>
								<label className="mr-2 text-sm">Width:</label>
								<select
									className="border rounded p-1 text-sm"
									value={gardenSize.width}
									onChange={(event) => {
										setGardenSize({
											...gardenSize,
											width: Number.parseInt(event.target.value),
										});
										initializeGardenLayout();
									}}
								>
									{[2, 3, 4, 5, 6, 8, 10].map((w) => (
										<option key={w} value={w}>
											{w} cells
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="mr-2 text-sm">Height:</label>
								<select
									className="border rounded p-1 text-sm"
									value={gardenSize.height}
									onChange={(event) => {
										setGardenSize({
											...gardenSize,
											height: Number.parseInt(event.target.value),
										});
										initializeGardenLayout();
									}}
								>
									{[2, 3, 4, 5, 6, 8, 10].map((h) => (
										<option key={h} value={h}>
											{h} cells
										</option>
									))}
								</select>
							</div>
						</div>
						<p className="text-xs text-gray-500 mb-4">
							Each cell represents approximately 1m² in your garden
						</p>
						<button
							onClick={() => initializeGardenLayout(true)}
							className="w-full bg-red-100 text-red-700 px-3 py-1 rounded text-sm"
						>
							Clear Layout
						</button>
					</div>

					<div className="bg-white p-4 rounded border border-gray-200 mb-4">
						<h3 className="font-medium text-green-700 mb-2">
							Select Vegetable to Place
						</h3>
						<div className="flex items-center justify-between mb-3">
							<div className="text-xs text-gray-500">
								Select a vegetable to add to your garden
							</div>
							<button
								className={`px-2 py-1 text-xs rounded ${
									showOnlyInSeason
										? 'bg-green-600 text-white'
										: 'bg-gray-200 text-gray-700'
								}`}
								onClick={() => setShowOnlyInSeason(!showOnlyInSeason)}
							>
								{showOnlyInSeason ? '✓ In Season Only' : 'Show All'}
							</button>
						</div>
						<div className="max-h-64 overflow-y-auto">
							<div
								className={`mb-2 p-2 rounded cursor-pointer ${
									selectedVeggie === null
										? 'bg-green-100 border border-green-300'
										: 'hover:bg-gray-100'
								}`}
								onClick={() => setSelectedVeggie(null)}
							>
								<div className="text-sm font-medium">Eraser</div>
								<div className="text-xs text-gray-500">
									Remove plants from cells
								</div>
							</div>
							{vegetables
								.filter(
									(veggie) =>
										!showOnlyInSeason || isInSeason(veggie, currentMonth)
								)
								.map((veggie) => (
									<div
										key={veggie.id}
										className={`mb-2 p-2 rounded cursor-pointer ${
											selectedVeggie?.id === veggie.id
												? 'bg-green-100 border border-green-300'
												: 'hover:bg-gray-100'
										}`}
										onClick={() => setSelectedVeggie(veggie)}
									>
										<div className="flex justify-between">
											<div className="text-sm font-medium">{veggie.name}</div>
											{isInSeason(veggie, currentMonth) && (
												<span className="bg-green-100 text-green-800 text-xs px-1 rounded-full">
													In Season
												</span>
											)}
										</div>
										<div className="text-xs text-gray-500">
											Spacing: {getSpacingRecommendation(veggie)}
										</div>
									</div>
								))}
						</div>
					</div>

					<div className="bg-white p-4 rounded border border-gray-200">
						<h3 className="font-medium text-green-700 mb-2">Garden Summary</h3>
						<div className="text-sm">
							<p>Total Area: {gardenSize.width * gardenSize.height} m²</p>
							<div className="mt-2">
								<p className="font-medium">Plants Used:</p>
								{Object.entries(calculateGardenUsage()).length === 0 ? (
									<p className="text-gray-500 text-xs italic">
										No plants placed yet
									</p>
								) : (
									<ul className="list-disc pl-5 text-xs mt-1">
										{Object.entries(calculateGardenUsage()).map(
											([name, count]) => (
												<li key={name}>
													{name}: {count} cells ({count} m²)
												</li>
											)
										)}
									</ul>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="md:w-2/3">
					<div className="bg-white p-4 rounded border border-gray-200">
						<div className="mb-3 flex items-center justify-between">
							<h3 className="font-medium text-green-700">Garden Grid</h3>
							<div className="text-xs text-gray-500">
								{selectedVeggie
									? `Selected: ${selectedVeggie.name}`
									: editingNoteCell
									? 'Adding note...'
									: 'Click a cell to place selected vegetable'}
							</div>
						</div>

						<div className="flex justify-center mb-4">
							<div
								className="grid gap-1 bg-amber-50 p-2 border border-amber-200 rounded"
								style={{
									gridTemplateColumns: `repeat(${gardenSize.width}, minmax(60px, 1fr))`,
									gridTemplateRows: `repeat(${gardenSize.height}, 60px)`,
								}}
							>
								{gardenLayout.map((row, y) =>
									row.map((cell, x) => {
										const cellKey = `${x}-${y}`;
										const hasNote = cellNotes[cellKey];

										return (
											<div
												key={cellKey}
												className={`relative flex flex-col items-center justify-center border ${
													cell.veggie
														? 'border-green-500 bg-green-100'
														: 'border-amber-300 bg-amber-50 hover:bg-amber-100'
												} rounded cursor-pointer`}
												onClick={() => {
													if (editingNoteCell) {
														if (
															editingNoteCell.x === x &&
															editingNoteCell.y === y
														) {
															addNoteToCell(x, y);
														}
													} else {
														placeVeggieInGarden(x, y);
													}
												}}
												onDoubleClick={() => {
													if (!editingNoteCell) {
														setEditingNoteCell({ x, y });
														setCurrentNote(cellNotes[cellKey] || '');
													}
												}}
											>
												{cell.veggie && (
													<div className="text-xs font-medium text-center">
														{cell.veggie.name}
													</div>
												)}

												{hasNote && !editingNoteCell && (
													<div
														className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full"
														title={cellNotes[cellKey]}
													></div>
												)}

												{editingNoteCell &&
													editingNoteCell.x === x &&
													editingNoteCell.y === y && (
														<div className="absolute inset-0 bg-white bg-opacity-90 p-1 z-10">
															<textarea
																className="w-full h-full text-xs resize-none border border-blue-300 rounded p-1"
																value={currentNote}
																onChange={(event) =>
																	setCurrentNote(event.target.value)
																}
																autoFocus
																placeholder="Add note..."
																onBlur={() => addNoteToCell(x, y)}
																onKeyDown={(event) => {
																	if (
																		event.key === 'Enter' &&
																		!event.shiftKey
																	) {
																		event.preventDefault();
																		addNoteToCell(x, y);
																	}
																}}
															/>
														</div>
													)}
											</div>
										);
									})
								)}
							</div>
						</div>

						<div className="text-xs text-gray-500 flex justify-between">
							<div>Single click: Place/remove plant</div>
							<div>Double click: Add a note</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
