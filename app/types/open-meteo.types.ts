export type OpenMeteoResponse = {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;

	// Current weather data
	current: {
		time: string;
		interval: number;
		temperature_2m: number;
		weather_code: number;
		wind_speed_10m: number;
	};
	current_units: {
		time: string;
		temperature_2m: string;
		weather_code: string;
		wind_speed_10m: string;
	};

	// Hourly forecast data
	hourly: {
		time: string[];
		temperature_2m: number[];
		precipitation_probability: number[];
		weather_code: number[];
	};
	hourly_units: {
		time: string;
		temperature_2m: string;
		precipitation_probability: string;
		weather_code: string;
	};

	// Daily forecast data
	daily: {
		time: string[];
		weather_code: number[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
		precipitation_sum: number[];
		wind_speed_10m: number[];
	};
	daily_units: {
		time: string;
		weather_code: string;
		temperature_2m_max: string;
		temperature_2m_min: string;
		precipitation_sum: string;
	};
	precipitation_probability: number[];
};
