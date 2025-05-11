import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ClimateTypes, Vegetable } from '~/types/garden.types';
import type { GardenLayout } from '~/types/garden.types';
import type { GardenSize } from '~/types/garden.types';

interface GardenState {
	climateZone: ClimateTypes;
	setClimateZone: (climate: ClimateTypes) => void;
	plantedPlants: Vegetable[];
	setPlantedPlants: (plant: Vegetable[]) => void;
	gardenLayout: GardenLayout;
	setGardenLayout: (layout: GardenLayout) => void;
	gardenSize: GardenSize;
	setGardenSize: (size: GardenSize) => void;
}

export const useGardenStore = create<GardenState>()(
	devtools(
		persist(
			(set) => ({
				climateZone: 'temperate',
				setClimateZone: (climate) => set({ climateZone: climate }),
				plantedPlants: [],
				setPlantedPlants: (plants) => set({ plantedPlants: plants }),
				gardenLayout: [],
				setGardenLayout: (layout) => set({ gardenLayout: layout }),
				gardenSize: { width: 6, height: 4 },
				setGardenSize: (size) => set({ gardenSize: size }),
			}),
			{
				name: 'garden-storage',
			}
		)
	)
);
