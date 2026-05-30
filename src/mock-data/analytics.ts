export type AnalyticsPoint = {
	label: string;
	value: number;
};

export const requestsOverTime: AnalyticsPoint[] = [
	{ label: "Mon", value: 3200 },
	{ label: "Tue", value: 4400 },
	{ label: "Wed", value: 3800 },
	{ label: "Thu", value: 5200 },
	{ label: "Fri", value: 4700 },
	{ label: "Sat", value: 5600 },
	{ label: "Sun", value: 6100 },
];

export const walletsCreated: AnalyticsPoint[] = [
	{ label: "Mon", value: 9 },
	{ label: "Tue", value: 11 },
	{ label: "Wed", value: 13 },
	{ label: "Thu", value: 12 },
	{ label: "Fri", value: 15 },
	{ label: "Sat", value: 18 },
	{ label: "Sun", value: 21 },
];
