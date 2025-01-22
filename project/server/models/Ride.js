import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  startLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  endLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  distance: { type: Number, required: true },
  passengers: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    pickupLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true }
    },
    dropLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true }
    },
    distance: { type: Number, required: true },
    cost: { type: Number, required: true }
  }],
  vehicle: {
    averageMileage: { type: Number, required: true },
    fuelPrice: { type: Number, required: true }
  },
  totalCost: { type: Number, required: true },
  costPerPerson: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Ride = mongoose.model('Ride', rideSchema);