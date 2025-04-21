import React, { useState } from 'react';
import {
	allVegetables,
	type ClimateTypes,
	type VegetableInfo,
} from '~/utils/constants';
import { climateZones, monthNames } from '../utils/constants';
import { useGardenStore } from '~/store/store';

const SproutCout = () => {
	const {
		climateZone,
		setClimateZone,
		plantedPlants,
		setPlantedPlants,
		plantArea,
		setPlantArea,
	} = useGardenStore();
	const [activeTab, setActiveTab] = useState('planner');
	const [currentMonth] = useState(new Date().getMonth());
	const [gardenLayout, setGardenLayout] = useState([]);
	const [gardenSize, setGardenSize] = useState({ width: 6, height: 4 });
	const [selectedVeggie, setSelectedVeggie] = useState<VegetableInfo | null>(
		null
	);
	const [cellNotes, setCellNotes] = useState({});
	const [currentNote, setCurrentNote] = useState('');
	const [editingNoteCell, setEditingNoteCell] = useState(null);
	const [showOnlyInSeason, setShowOnlyInSeason] = useState(false);

	// Expanded vegetable database with climate zone planting info

	// Get veggies for the current climate zone
	const vegetables = allVegetables.map((veggie) => ({
		...veggie,
		bestPlantingMonths: veggie.climateZones[climateZone] || [],
	}));

	const addRandomVeggie = () => {
		// Prefer in-season vegetables
		const inSeasonVeggies = vegetables.filter((v) =>
			v.bestPlantingMonths.includes(currentMonth + 1)
		);
		const veggiesToUse =
			inSeasonVeggies.length > 0 ? inSeasonVeggies : vegetables;

		const randomVeggie =
			veggiesToUse[Math.floor(Math.random() * veggiesToUse.length)];
		addSpecificVeggie(randomVeggie.id);
	};

	const addSpecificVeggie = (id: number) => {
		const veggie = vegetables.find((v) => v.id === id);
		if (!veggie) return;

		const today = new Date();
		const harvestDate = new Date();
		harvestDate.setDate(today.getDate() + veggie.timeToHarvest);

		const newPlanting = {
			id: Date.now(),
			name: veggie.name,
			plantDate: formatDate(today),
			harvestDate: formatDate(harvestDate),
			area: `${plantArea} m²`,
			yieldPerPlant: veggie.yieldPerPlant,
			estimatedYield: calculateYield(veggie, plantArea),
			companionPlants: veggie.companionPlants,
		};

		setPlantedPlants([...plantedPlants, newPlanting]);

		// Switch to planner tab
		//setActiveTab('planner');
	};

	const calculateYield = (veggie: VegetableInfo, area: number) => {
		// Extract just the numbers (assuming format like "3-5 kg per m²")
		const yieldString = veggie.yieldPerSqM;
		const match = yieldString.match(/(\d+)-(\d+)/);

		if (match) {
			const min = parseInt(match[1]);
			const max = parseInt(match[2]);
			const avgYield = (min + max) / 2;
			return `${(avgYield * area).toFixed(1)} kg (${area} m²)`;
		}

		return veggie.yieldPerSqM;
	};

	const removePlanting = (id: number) => {
		setPlantedPlants(plantedPlants.filter((p) => p.id !== id));
	};

	const formatDate = (date) => {
		return date.toLocaleDateString();
	};

	const isInSeason = (veggie) => {
		return veggie.bestPlantingMonths.includes(currentMonth + 1);
	};

	// Get only vegetables suitable for current month
	const inSeasonVeggies = vegetables.filter(isInSeason);

	// Create a new garden layout grid
	const initializeGarden = () => {
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

	// Place a vegetable in the garden layout
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

	// Calculate total space used by each vegetable type
	const calculateGardenUsage = () => {
		const veggieCount = {};

		gardenLayout.forEach((row) => {
			row.forEach((cell) => {
				if (cell.veggie) {
					const veggieName = cell.veggie.name;
					veggieCount[veggieName] = (veggieCount[veggieName] || 0) + 1;
				}
			});
		});

		return veggieCount;
	};

	// Handle adding a note to a cell
	const addNoteToCell = (x, y) => {
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

	// Get veggie spacing recommendation
	const getSpacingRecommendation = (veggie: VegetableInfo) => {
		const spacingGuide = {
			Tomatoes: '60-90 cm',
			Carrots: '5-10 cm',
			Lettuce: '20-30 cm',
			Peppers: '45-60 cm',
			Zucchini: '90-120 cm',
			Broccoli: '45-60 cm',
			Spinach: '15-30 cm',
			Cucumber: '60-90 cm',
			Onions: '10-15 cm',
			Potatoes: '30-40 cm',
			Kale: '45-60 cm',
			Radishes: '2-5 cm',
			Eggplant: '60-75 cm',
			Beans: '15-30 cm',
			'Sweet Corn': '30-45 cm',
		};

		return spacingGuide[veggie.name] || '30 cm';
	};

	// Initialize garden if empty
	if (gardenLayout.length === 0) {
		initializeGarden();
	}

	return (
		<div className="p-4 bg-gray-100 max-w-4xl mx-auto rounded shadow">
			<h1 className="text-2xl font-bold text-green-700 mb-4">
				Veggie Harvest Planner
			</h1>
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
				<p className="text-sm text-green-600">
					Currently showing vegetables appropriate for{' '}
					{monthNames[currentMonth]}
				</p>

				<div className="mt-2 md:mt-0">
					<label className="mr-2 text-sm font-medium text-green-700">
						Climate Zone:
					</label>
					<select
						className="border border-green-300 rounded p-1 bg-white"
						value={climateZone}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
							setClimateZone(e.target.value as ClimateTypes)
						}
					>
						{climateZones.map((zone) => (
							<option key={zone.id} value={zone.id}>
								{zone.name}
							</option>
						))}
					</select>
					<div className="text-xs text-gray-500 mt-1">
						{climateZones.find((z) => z.id === climateZone)?.description}
					</div>
				</div>
			</div>

			<div className="flex flex-wrap mb-4 border-b border-gray-300">
				<button
					className={`px-4 py-2 ${
						activeTab === 'planner'
							? 'text-green-700 border-b-2 border-green-700 font-semibold'
							: 'text-gray-600'
					}`}
					onClick={() => setActiveTab('planner')}
				>
					My Garden
				</button>
				<button
					className={`px-4 py-2 ${
						activeTab === 'layout'
							? 'text-green-700 border-b-2 border-green-700 font-semibold'
							: 'text-gray-600'
					}`}
					onClick={() => setActiveTab('layout')}
				>
					Garden Designer
				</button>
				<button
					className={`px-4 py-2 ${
						activeTab === 'guide'
							? 'text-green-700 border-b-2 border-green-700 font-semibold'
							: 'text-gray-600'
					}`}
					onClick={() => setActiveTab('guide')}
				>
					Veggie Guide
				</button>
				<button
					className={`px-4 py-2 ${
						activeTab === 'calendar'
							? 'text-green-700 border-b-2 border-green-700 font-semibold'
							: 'text-gray-600'
					}`}
					onClick={() => setActiveTab('calendar')}
				>
					Planting Calendar
				</button>
			</div>

			{activeTab === 'planner' && (
				<div>
					<div className="flex justify-between items-center mb-4">
						<div className="text-lg">
							Current Month: {monthNames[currentMonth]}
						</div>
						<div className="flex gap-2 items-center">
							<div>
								<label className="mr-2">Planting Area:</label>
								<select
									className="border rounded p-1"
									value={plantArea}
									onChange={(e) => setPlantArea(parseFloat(e.target.value))}
								>
									<option value="0.5">0.5 m²</option>
									<option value="1">1 m²</option>
									<option value="2">2 m²</option>
									<option value="5">5 m²</option>
									<option value="10">10 m²</option>
								</select>
							</div>
							<button
								onClick={addRandomVeggie}
								className="bg-green-600 text-white px-4 py-2 rounded"
							>
								Add Random Veggie
							</button>
						</div>
					</div>

					{plantedPlants.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<p>You haven't added any plantings yet.</p>
							<p>Click "Add Random Veggie" to get started!</p>
						</div>
					) : (
						<div className="space-y-4">
							{plantedPlants.map((planting) => (
								<div
									key={planting.id}
									className="p-4 rounded border bg-white border-green-200"
								>
									<div className="flex justify-between">
										<h3 className="text-lg font-medium text-green-700">
											{planting.name}
										</h3>
										<button
											onClick={() => removePlanting(planting.id)}
											className="px-2 py-1 rounded bg-red-100 text-red-700"
										>
											Remove
										</button>
									</div>
									<div className="mt-2 grid grid-cols-2 gap-2">
										<div>
											<span className="text-gray-500">Planted:</span>{' '}
											{planting.plantDate}
										</div>
										<div>
											<span className="text-gray-500">Harvest Around:</span>{' '}
											{planting.harvestDate}
										</div>
										<div>
											<span className="text-gray-500">Area:</span>{' '}
											{planting.area}
										</div>
										<div>
											<span className="text-gray-500">Per Plant:</span>{' '}
											{planting.yieldPerPlant}
										</div>
										<div className="col-span-2">
											<span className="text-gray-500">
												Total Estimated Yield:
											</span>{' '}
											{planting.estimatedYield}
										</div>
										<div className="col-span-2">
											<span className="text-gray-500">Companion Plants:</span>{' '}
											{planting.companionPlants?.join(', ')}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{activeTab === 'guide' && (
				<div>
					<div className="mb-4 flex justify-between items-center">
						<h2 className="text-xl text-green-700">Vegetables Guide</h2>
						<div className="flex items-center gap-3">
							<div className="text-sm text-green-600">
								Showing veggies for{' '}
								{climateZones.find((z) => z.id === climateZone)?.name} climate
							</div>
							<button
								className={`px-3 py-1 text-sm rounded ${
									showOnlyInSeason
										? 'bg-green-600 text-white'
										: 'bg-gray-200 text-gray-700'
								}`}
								onClick={() => setShowOnlyInSeason(!showOnlyInSeason)}
							>
								{showOnlyInSeason ? '✓ In Season Only' : 'Show All'}
							</button>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						{vegetables
							.filter((veggie) => !showOnlyInSeason || isInSeason(veggie))
							.map((veggie) => (
								<div
									key={veggie.id}
									className={`p-4 rounded border ${
										isInSeason(veggie)
											? 'border-green-300 bg-green-50'
											: 'border-gray-300 bg-white'
									}`}
								>
									<div className="flex justify-between items-start">
										<h3 className="text-lg font-medium">{veggie.name}</h3>
										{isInSeason(veggie) && (
											<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
												Good time to plant!
											</span>
										)}
									</div>
									<div className="mt-2 space-y-1 text-sm">
										<p>
											<span className="text-gray-500">Time to Harvest:</span>{' '}
											{veggie.timeToHarvest} days
										</p>
										<p>
											<span className="text-gray-500">Yield per Plant:</span>{' '}
											{veggie.yieldPerPlant}
										</p>
										<p>
											<span className="text-gray-500">Yield per Area:</span>{' '}
											{veggie.yieldPerSqM}
										</p>
										<p>
											<span className="text-gray-500">
												Best Planting Months:
											</span>{' '}
											{veggie.bestPlantingMonths
												.map((m) => monthNames[m - 1].substring(0, 3))
												.join(', ')}
										</p>
										<p>
											<span className="text-gray-500">Companion Plants:</span>{' '}
											{veggie.companionPlants.join(', ')}
										</p>
									</div>
									<button
										onClick={() => addSpecificVeggie(veggie.id)}
										className="mt-3 bg-green-600 text-white px-3 py-1 rounded text-sm"
									>
										Add to My Garden
									</button>
								</div>
							))}
					</div>
				</div>
			)}

			{activeTab === 'inseason' && (
				<div>
					<div className="mb-4">
						<h2 className="text-xl text-green-700">
							Vegetables to Plant in {monthNames[currentMonth]}
						</h2>
						<p className="text-sm text-gray-600">
							These vegetables are ideal for planting this month in your{' '}
							{climateZones.find((z) => z.id === climateZone)?.name} climate
						</p>
					</div>

					{inSeasonVeggies.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<p>
								No vegetables are ideal for planting in{' '}
								{monthNames[currentMonth]} in your{' '}
								{climateZones.find((z) => z.id === climateZone)?.name} climate.
							</p>
							<p>
								Try checking different months in the Veggie Guide tab or
								selecting a different climate zone!
							</p>
						</div>
					) : (
						<div className="grid gap-4 md:grid-cols-2">
							{inSeasonVeggies.map((veggie) => (
								<div
									key={veggie.id}
									className="p-4 rounded border border-green-300 bg-green-50"
								>
									<div className="flex justify-between items-start">
										<h3 className="text-lg font-medium">{veggie.name}</h3>
										<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
											Plant now!
										</span>
									</div>
									<div className="mt-2 space-y-1 text-sm">
										<p>
											<span className="text-gray-500">Time to Harvest:</span>{' '}
											{veggie.timeToHarvest} days
										</p>
										<p>
											<span className="text-gray-500">Yield per Plant:</span>{' '}
											{veggie.yieldPerPlant}
										</p>
										<p>
											<span className="text-gray-500">Yield per Area:</span>{' '}
											{veggie.yieldPerSqM}
										</p>
										<p>
											<span className="text-gray-500">Companion Plants:</span>{' '}
											{veggie.companionPlants.join(', ')}
										</p>
									</div>
									<button
										onClick={() => addSpecificVeggie(veggie.id)}
										className="mt-3 bg-green-600 text-white px-3 py-1 rounded text-sm"
									>
										Add to My Garden
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{activeTab === 'layout' && (
				<div>
					<div className="mb-4">
						<h2 className="text-xl text-green-700">Garden Layout Designer</h2>
						<p className="text-sm text-gray-600">
							Design your garden layout by selecting a vegetable and clicking on
							the grid
						</p>
					</div>

					<div className="flex flex-col md:flex-row gap-6">
						<div className="md:w-1/3">
							<div className="bg-white p-4 rounded border border-gray-200 mb-4">
								<h3 className="font-medium text-green-700 mb-2">
									Garden Settings
								</h3>
								<div className="flex gap-2 items-center mb-4">
									<div>
										<label className="mr-2 text-sm">Width:</label>
										<select
											className="border rounded p-1 text-sm"
											value={gardenSize.width}
											onChange={(e) => {
												setGardenSize({
													...gardenSize,
													width: parseInt(e.target.value),
												});
												initializeGarden();
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
											onChange={(e) => {
												setGardenSize({
													...gardenSize,
													height: parseInt(e.target.value),
												});
												initializeGarden();
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
									onClick={initializeGarden}
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
										.filter((veggie) => !showOnlyInSeason || isInSeason(veggie))
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
													<div className="text-sm font-medium">
														{veggie.name}
													</div>
													{isInSeason(veggie) && (
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
								<h3 className="font-medium text-green-700 mb-2">
									Garden Summary
								</h3>
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
																		onChange={(e) =>
																			setCurrentNote(e.target.value)
																		}
																		autoFocus
																		placeholder="Add note..."
																		onBlur={() => addNoteToCell(x, y)}
																		onKeyDown={(e) => {
																			if (e.key === 'Enter' && !e.shiftKey) {
																				e.preventDefault();
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
			)}
		</div>
	);
};

export default SproutCout;
