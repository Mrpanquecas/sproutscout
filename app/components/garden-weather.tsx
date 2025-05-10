import React from 'react';
import { useLoaderData } from 'react-router';
import {
	SunIcon,
	CloudIcon,
	CloudArrowUpIcon,
} from '@heroicons/react/16/solid';
import type { loader } from '~/routes/garden';
import { Card, CardBody, CardTitle } from './card';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type WeatherIconProps = {
	weatherCode: number;
};

const WeatherIcon = ({ weatherCode }: WeatherIconProps) => {
	switch (weatherCode) {
		case 0: // Clear sky
		case 1: // Mainly clear
		case 2: // Partly cloudy
		case 3: {
			// Overcast:
			return <SunIcon className="size-6" />;
		}
		case 45: // Fog
		case 48: {
			// Deposit rime fog:
			return <CloudIcon className="size-6" />;
		}
		case 51: // Drizzle light
		case 53: // Drizzle moderate
		case 55: // Drizzle dense
		case 56: // Freezing drizzle light
		case 57: // Freezing drizzle dense
		case 61: // Rain slight
		case 63: // Rain moderate
		case 65: // Rain heavy
		case 66: // Freezing rain light
		case 67: {
			// Freezing rain heavy:
			return <CloudArrowUpIcon className="size-6" />;
		}
		case 71: // Snow fall slight
		case 73: // Snow fall moderate
		case 75: // Snow fall heavy
		case 77: // Snow grains
		case 85: // Ice pellets light
		case 86: {
			// Ice pellets heavy:
			return <CloudArrowUpIcon className="size-6" />;
		}
		default: {
			return <CloudIcon className="size-6" />;
		}
	}
};

function getWeatherCondition(code: number) {
	const conditions: Record<number, string> = {
		0: 'Clear sky',
		1: 'Mainly clear',
		2: 'Partly cloudy',
		3: 'Overcast',
		45: 'Fog',
		48: 'Depositing rime fog',
		51: 'Light drizzle',
		53: 'Moderate drizzle',
		55: 'Dense drizzle',
		56: 'Light freezing drizzle',
		57: 'Dense freezing drizzle',
		61: 'Slight rain',
		63: 'Moderate rain',
		65: 'Heavy rain',
		66: 'Light freezing rain',
		67: 'Heavy freezing rain',
		71: 'Slight snow fall',
		73: 'Moderate snow fall',
		75: 'Heavy snow fall',
		77: 'Snow grains',
		80: 'Slight rain showers',
		81: 'Moderate rain showers',
		82: 'Violent rain showers',
		85: 'Slight snow showers',
		86: 'Heavy snow showers',
		95: 'Thunderstorm',
		96: 'Thunderstorm with slight hail',
		99: 'Thunderstorm with heavy hail',
	};

	return conditions[code] || 'Unknown';
}

const gardeningFriendlyWeatherCodes = new Set([0, 1, 2, 3, 51, 80]);

export default function GardenWeather() {
	const { weather } = useLoaderData<typeof loader>();
	if (!weather) return null;

	const currentWeather = weather.current;
	const dailyWeather = weather.daily;
	const currentWindSpeed = currentWeather.wind_speed_10m;
	const currentRainChance = Math.round(weather.daily.precipitation_sum[0]);

	return (
		<Card>
			<CardBody>
				<CardTitle>
					<div className="flex items-center">
						<WeatherIcon weatherCode={currentWeather.weather_code} />
						<span className="ml-2 text-lg font-semibold">
							Today: {currentWeather.temperature_2m}°C
						</span>
					</div>
					<span className="text-lg font-semibold">
						{getWeatherCondition(currentWeather.weather_code)}
					</span>
				</CardTitle>
				<div id="today" className="flex flex-col text-sm text-gray-600 mb-4">
					<div className="flex items-center">
						<span className="mr-2">
							{gardeningFriendlyWeatherCodes.has(currentWeather.weather_code)
								? 'Good for gardening'
								: 'Not so good for gardening'}
						</span>
					</div>
					<div className="flex items-center">
						<span className="mr-2">Wind: {currentWindSpeed} km/h</span>
						<CloudArrowUpIcon className="w-4 h-4" />
					</div>
					<div className="flex items-center">
						<span className="mr-2">Rain: {currentRainChance} mm</span>
						<CloudArrowUpIcon className="w-4 h-4" />
					</div>
				</div>

				<div className="flex overflow-auto">
					{dailyWeather.weather_code.map((code, index) => (
						<div
							key={index}
							className={`px-4 flex flex-col items-center justify-between text-center border-r ${
								index === dailyWeather.weather_code.length - 1
									? 'border-r-0'
									: ''
							}`}
						>
							<div className="flex flex-col items-center">
								<WeatherIcon weatherCode={code} />
								<span>
									{weekDays[new Date(dailyWeather.time[index]).getDay()]}
								</span>
							</div>
							<div className="flex flex-col">
								<p className="font-semibold">
									{dailyWeather.temperature_2m_min[index]}°C
								</p>
								<p className="font-semibold">
									{dailyWeather.temperature_2m_max[index]}°C
								</p>
								<p className="text-sm text-gray-600">
									{dailyWeather.precipitation_sum[index]}&nbsp;mm
								</p>
							</div>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
