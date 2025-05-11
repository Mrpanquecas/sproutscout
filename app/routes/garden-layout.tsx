import React, { useEffect, useState } from 'react';
import { useGardenStore } from '~/store/store';
import { type Vegetable } from '~/types/garden.types';
import { formatDate } from '../utils/format-date';
import { isInSeason } from '../utils/in-season';
import { getSpacingRecommendation } from '../utils/space-recommendation';
import { getVegetables } from '~/utils/loader-helpers';
import type { Route } from './+types/garden-layout';
import { useLoaderData, useSubmit } from 'react-router';
import { Card, CardBody, CardTitle } from '~/components/card';
import { saveGardenLayout } from '~/utils/action-helpers';

export async function loader({ request }: Route.LoaderArgs) {
	const plants = await getVegetables(request);
	return { plants };
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	const intent = formData.get('intent');
	if (intent === 'save-layout') {
		await saveGardenLayout(request, formData);
	}
}

export default function layout() {
	const data = useLoaderData<typeof loader>();
	const [filter, setFilter] = useState('');
	const submit = useSubmit();

	const {
		setPlantedPlants,
		climateZone,
		plantedPlants,
		gardenLayout,
		setGardenLayout,
		gardenSize,
		setGardenSize,
		cellNotes,
		setCellNotes,
	} = useGardenStore();
	const [isHydrated, setIsHydrated] = useState<boolean>(false);
	const [selectedVeggie, setSelectedVeggie] = useState<Vegetable | null>(null);
	const [currentNote, setCurrentNote] = useState('');
	const [editingNoteCell, setEditingNoteCell] = useState<{
		x: number;
		y: number;
		plantId: number | null;
	} | null>(null);

	// Create a new garden layout grid
	const initializeGardenLayout = (reset: boolean = false): void => {
		if (gardenLayout.length > 0 && !reset) return;

		const newLayout = [];
		for (let y = 0; y < gardenSize.height; y++) {
			const row = [];
			for (let x = 0; x < gardenSize.width; x++) {
				row.push({ x, y, plantId: null });
			}
			newLayout.push(row);
		}
		setGardenLayout(newLayout);
	};

	// Calculate total space used by each vegetable type
	const calculateGardenUsage = () => {
		const veggieCount: { [key: string]: number } = {};

		for (const row of gardenLayout) {
			for (const cell of row) {
				if (cell.plantId) {
					const veggieName = data.plants?.find(
						(v) => v.id === cell.plantId
					)?.name;
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

	const placeVeggieInGarden = (x: number, y: number, plantId: number) => {
		if (!selectedVeggie) return;

		const newLayout = [...gardenLayout];
		const cell = newLayout[y][x];

		// If cell already contains this veggie, remove it
		if (cell.plantId && cell.plantId === plantId) {
			newLayout[y][x] = { ...cell, plantId: null };
		} else {
			// Otherwise place the veggie
			newLayout[y][x] = { ...cell, plantId };

			// Add to plantings if not already there
			const existingPlanting = plantedPlants.find((p) => p.id === plantId);
			if (!existingPlanting) {
				addSpecificVeggie(plantId);
			}
		}

		setGardenLayout(newLayout);
	};

	const addSpecificVeggie = (id: number) => {
		const veggie = data.plants?.find((v) => v.id === id);
		if (!veggie) return;

		const today = new Date();
		const harvestDate = new Date();
		harvestDate.setDate(today.getDate() + veggie.timeToHarvest);

		const newPlanting = {
			...veggie,
			plantDate: formatDate(today),
			harvestDate: formatDate(harvestDate),
			area: `${gardenSize.width * gardenSize.height} m²`,
			yieldPerPlant: veggie.yieldPerPlant,
		};

		setPlantedPlants([...plantedPlants, newPlanting]);
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

	const handleSubmit = () => {
		const formData = new FormData();
		formData.append('gardenLayout', JSON.stringify(gardenLayout));
		formData.append('intent', 'save-layout');

		submit(formData, {
			method: 'post',
			action: '/layout',
		});
	};

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
				<div className="md:w-1/3 space-y-4">
					<Card>
						<CardBody>
							<CardTitle>Garden Settings</CardTitle>
							<div className="flex gap-2 items-center mb-4">
								<div>
									<label className="mr-2 text-sm">Width:</label>
									<select
										className="select select-sm"
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
										className="select select-sm"
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
							<p className="text-xs  mb-4">
								Each cell represents approximately 1m² in your garden
							</p>
							<button
								onClick={() => initializeGardenLayout(true)}
								className="btn w-full btn-error"
							>
								Clear Layout
							</button>
						</CardBody>
					</Card>

					<Card>
						<CardBody>
							<CardTitle>Select Vegetable to Place</CardTitle>
							<input
								className="input input-sm"
								placeholder="Filter"
								type="text"
								onChange={(e) => setFilter(e.target.value.toLowerCase())}
							/>
							<div className="max-h-64 overflow-y-auto">
								<div
									className={`mb-2 p-2 rounded cursor-pointer ${
										selectedVeggie === null
											? 'border border-green-300'
											: 'hover:bg-green-500'
									}`}
									onClick={() => setSelectedVeggie(null)}
								>
									<div className="text-sm font-medium">Eraser</div>
									<div className="text-xs ">Remove plants from cells</div>
								</div>
								{data.plants
									?.filter((veggie) =>
										veggie.name.toLocaleLowerCase().includes(filter)
									)
									.map((veggie) => (
										<div
											key={veggie.id}
											className={`mb-2 p-2 rounded cursor-pointer ${
												selectedVeggie?.id === veggie.id
													? 'border border-green-300'
													: 'hover:bg-green-500'
											}`}
											onClick={() => setSelectedVeggie(veggie)}
										>
											<div className="flex justify-between">
												<div className="text-sm font-medium">{veggie.name}</div>
												{isInSeason(veggie, climateZone) && (
													<span className="badge badge-sm badge-success">
														In Season
													</span>
												)}
											</div>
											<div className="text-xs ">
												Spacing: {getSpacingRecommendation(veggie)}
											</div>
										</div>
									))}
							</div>
						</CardBody>
					</Card>

					<Card>
						<CardBody>
							<CardTitle>Garden Summary</CardTitle>
							<p>Total Area: {gardenSize.width * gardenSize.height} m²</p>
							<p className="font-medium">Plants Used:</p>
							{Object.entries(calculateGardenUsage()).length === 0 ? (
								<p className=" text-xs italic">No plants placed yet</p>
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
						</CardBody>
					</Card>
				</div>

				<div className="md:w-2/3">
					<Card>
						<CardBody>
							<CardTitle>Garden Grid</CardTitle>
							<div className="mb-3 flex items-center justify-between">
								<div className="text-xs ">
									{selectedVeggie
										? `Selected: ${selectedVeggie.name}`
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
															placeVeggieInGarden(x, y, selectedVeggie?.id);
														}
													}}
													onDoubleClick={() => {
														if (!editingNoteCell) {
															setEditingNoteCell({
																x,
																y,
																plantId: selectedVeggie?.id,
															});
															setCurrentNote(cellNotes[cellKey] || '');
														}
													}}
												>
													{cell.veggie && (
														<div className="text-xs font-medium text-center dark:text-black">
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
															<div className="absolute inset-0  bg-opacity-90 p-1 z-10">
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

							<div className="text-xs  flex justify-between">
								<div>Single click: Place/remove plant</div>
								<div>Double click: Add a note</div>
							</div>
							<button className="btn btn-success" onClick={handleSubmit}>
								Save Layout
							</button>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}
