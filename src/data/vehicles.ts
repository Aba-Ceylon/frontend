export interface PremiumVehicle {
	id: string;
	name: string;
	models: string[];
	type: string;
	passengerCapacity: number;
	luggageCapacity: number;
	features: string[];
	shortDescription: string;
	imageUrl: string;
}

export const vehicles: PremiumVehicle[] = [
	{
		id: "pv-001",
		name: "Premium Sedan",
		models: ["Toyota Camry", "Lexus ES"],
		type: "Sedan",
		passengerCapacity: 3,
		luggageCapacity: 2,
		features: [
			"Leather seats",
			"Climate control",
			"Complimentary bottled water",
			"Experienced chauffeur",
		],
		shortDescription:
			"Comfortable executive sedan ideal for airport transfers and city tours.",
		imageUrl: "/images/vehicles/premium-sedan.jpg",
	},
	{
		id: "pv-002",
		name: "Luxury SUV",
		models: ["Cadillac Escalade", "Toyota Land Cruiser"],
		type: "SUV",
		passengerCapacity: 5,
		luggageCapacity: 4,
		features: [
			"Spacious interior",
			"All-terrain capability",
			"Privacy glass",
			"On-board charging ports",
		],
		shortDescription:
			"Premium SUV perfect for family travel and journeys into the hill country.",
		imageUrl: "/images/vehicles/luxury-suv.jpg",
	},
	{
		id: "pv-003",
		name: "Executive Van",
		models: ["Mercedes-Benz V-Class", "Toyota Hiace Premium"],
		type: "Van",
		passengerCapacity: 7,
		luggageCapacity: 6,
		features: [
			"Rear cabin privacy divider",
			"Reclining seats",
			"In-vehicle refreshments",
			"Wifi on request",
		],
		shortDescription:
			"Spacious executive van tailored for small groups and private transfers.",
		imageUrl: "/images/vehicles/executive-van.jpg",
	},
	{
		id: "pv-004",
		name: "Chauffeured Convertible",
		models: ["Mercedes-Benz E-Class Cabriolet", "BMW 4 Series Convertible"],
		type: "Convertible",
		passengerCapacity: 2,
		luggageCapacity: 1,
		features: [
			"Open-top driving experience",
			"Premium sound system",
			"Personalised sightseeing routes",
			"Sunshade and blankets",
		],
		shortDescription:
			"Stylish convertible for coastal drives and special occasion transfers.",
		imageUrl: "/images/vehicles/convertible.jpg",
	},
];

export default vehicles;
