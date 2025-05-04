import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
	ClimateTypes,
	GardenLayout,
	GardenSize,
	PlantedVegetable,
} from '~/utils/constants';

interface GardenState {
	climateZone: ClimateTypes;
	setClimateZone: (climate: ClimateTypes) => void;
	plantedPlants: PlantedVegetable[];
	setPlantedPlants: (plant: PlantedVegetable[]) => void;
	gardenLayout: GardenLayout;
	setGardenLayout: (layout: GardenLayout) => void;
	gardenSize: GardenSize;
	setGardenSize: (size: GardenSize) => void;
	cellNotes: Record<string, string>;
	setCellNotes: (note: Record<string, string>) => void;
}

export const useGardenStore = create<GardenState>()(
	devtools(
		persist(
			(set) => ({
				climateZone: 'temperate',
				setClimateZone: (climate) => set({ climateZone: climate }),
				plantedPlants: [],
				setPlantedPlants: (vetables) => set({ plantedPlants: vetables }),
				gardenLayout: [],
				setGardenLayout: (layout) => set({ gardenLayout: layout }),
				gardenSize: { width: 6, height: 4 },
				setGardenSize: (size) => set({ gardenSize: size }),
				cellNotes: {},
				setCellNotes: (notes) => set({ cellNotes: notes }),
			}),
			{
				name: 'garden-storage',
			}
		)
	)
);
