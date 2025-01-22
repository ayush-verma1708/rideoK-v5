import express from 'express';
import { Ride } from '../models/Ride.js';

export const router = express.Router();

// Create new ride
router.post('/', async (req, res) => {
  try {
    // Receive the route data from the frontend
    const { startLocation, endLocation, distance } = req.body;

    // Create a new ride entry in the database
    const ride = new Ride({
      startLocation,
      endLocation,
      distance,
      totalCost: 0, // Placeholder, modify if you need this
      costPerPerson: 0, // Placeholder, modify if you need this
      passengers: [], // You can send passenger data if needed
      vehicle: {
        averageMileage: 0, // Placeholder
        fuelPrice: 0, // Placeholder
      },
    });

    await ride.save();
    res.status(201).json(ride); // Respond with the stored ride data
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find().sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ride by ID
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a passenger to a ride
router.post('/:rideId/passenger', async (req, res) => {
  try {
    const { name, pickupLocation, dropLocation, cost } = req.body;
    const rideId = req.params.rideId;

    // Validate that all required fields are provided
    if (!name || !pickupLocation || !dropLocation || cost === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the ride by ID
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Create new passenger object
    const newPassenger = {
      name,
      pickupLocation,
      dropLocation,
      cost,
    };

    // Add passenger to ride's passenger list
    ride.passengers.push(newPassenger);

    // Update the total cost of the ride (you can modify this logic based on your requirements)
    ride.totalCost += cost;

    // Save the updated ride
    await ride.save();
    res.status(201).json(newPassenger); // Respond with the added passenger data
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update vehicle details for a ride
router.put('/:rideId/vehicle', async (req, res) => {
  try {
    const { mileage, fuelPrice } = req.body;
    const rideId = req.params.rideId;

    // Validate the input
    if (!mileage || !fuelPrice) {
      return res.status(400).json({ message: 'Mileage and fuel price are required' });
    }

    // Find the ride by ID
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Update the vehicle details in the ride model
    ride.vehicle = {
      ...ride.vehicle,
      averageMileage: mileage,
      fuelPrice: fuelPrice,
    };

    // Save the updated ride
    await ride.save();

    // Respond with the updated ride details
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
