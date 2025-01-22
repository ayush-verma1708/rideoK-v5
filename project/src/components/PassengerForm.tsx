import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { Location, Passenger, Route, Vehicle } from '../types';
import AutocompleteSearch from './AutocompleteSearch';
import { api } from '../services/api';
import axios from 'axios';

interface PassengerFormProps {
  mainRoute: Route;
  vehicle: Vehicle;
  onAddPassenger: (passenger: Passenger) => void;
  existingPassengers: Passenger[];
}

export default function PassengerForm({ 
  mainRoute, 
  vehicle, 
  onAddPassenger,
  existingPassengers 
}: PassengerFormProps) {
  const [name, setName] = useState('');
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropLocation, setDropLocation] = useState<Location | null>(null);
  const [pickupKey, setPickupKey] = useState(0);
  const [dropKey, setDropKey] = useState(0);
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoordinates = async (address: string): Promise<Location | null> => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          limit: 1,
        },
      });

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return {
          lat: parseFloat(lat),
          lng: parseFloat(lon),
          address,
        };
      } else {
        console.error(`No coordinates found for address: ${address}`);
        return null;
      }
    } catch (err) {
      console.error(`Error fetching coordinates for ${address}:`, err);
      return null;
    }
  };

  
  
  const calculateOptimizedCost = async (pickup: Location, drop: Location) => {
    try {
      setLoading(true);
      setError(null);
  
      // Calculate passenger's route
      const passengerRoute = await api.calculateRoute(
        pickup.address,
        drop.address
      );
  
      // Calculate base cost for the entire trip (mainRoute)
      const fuelNeededMain = mainRoute.distance / vehicle.averageMileage;
      const fuelCostMain = fuelNeededMain * vehicle.fuelPrice;
      // const maintenanceCostMain = fuelCostMain * 0.2;
      const totalBaseCost = fuelCostMain ;
  
      // Calculate distance contribution for the new passenger
      const passengerDistance = passengerRoute.distance;
      const totalDistance = mainRoute.distance;
  
      // Calculate shared cost proportion for each passenger including new one
      const totalPassengers = existingPassengers.length + 1;
      const distanceRatio = passengerDistance / totalDistance;
      let baseCostShare = totalBaseCost * (distanceRatio / totalPassengers);
  
      // Apply overlap discount for shared routes
      const overlapDiscount = calculateOverlapDiscount(
        pickup,
        drop,
        mainRoute,
        existingPassengers
      );
  
      const overlapDiscountFactor = overlapDiscount * 0.3; // Up to 30%
      const costMultiplier = Math.max(0.4, 1 - overlapDiscountFactor);
  
      // Calculate final cost and enforce the 40% cap
      const uncappedCost = Math.round(baseCostShare * costMultiplier * 100) / 100;
      const costCap = totalBaseCost * 0.3; // 40% of total base cost
      const finalCost = Math.min(uncappedCost, costCap); // Enforce cap
  
      const newPassenger: Passenger = {
        id: crypto.randomUUID(),
        name,
        pickupLocation: pickup,
        dropLocation: drop,
        distance: passengerDistance,
        cost: finalCost
      };
  
      onAddPassenger(newPassenger);
      resetForm();
    } catch (err) {
      setError('Failed to calculate optimized route. Please try again.');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  
  const calculateOverlapDiscount = (
    pickup: Location,
    drop: Location,
    mainRoute: Route,
    existingPassengers: Passenger[]
  ): number => {
    // Calculate overlap with main route
    const mainRouteOverlap = calculateRouteOverlap(
      pickup,
      drop,
      mainRoute.startLocation,
      mainRoute.endLocation
    );

    // Calculate overlap with existing passengers' routes
    const passengersOverlap = existingPassengers.reduce((maxOverlap, passenger) => {
      const overlap = calculateRouteOverlap(
        pickup,
        drop,
        passenger.pickupLocation,
        passenger.dropLocation
      );
      return Math.max(maxOverlap, overlap);
    }, 0);

    return Math.max(mainRouteOverlap, passengersOverlap);
  };

  const calculateRouteOverlap = (
    pickup1: Location,
    drop1: Location,
    pickup2: Location,
    drop2: Location
  ): number => {
    // Simple overlap calculation based on coordinates
    const lat1 = Math.min(pickup1.lat, drop1.lat);
    const lat2 = Math.max(pickup1.lat, drop1.lat);
    const lng1 = Math.min(pickup1.lng, drop1.lng);
    const lng2 = Math.max(pickup1.lng, drop1.lng);

    const olat1 = Math.min(pickup2.lat, drop2.lat);
    const olat2 = Math.max(pickup2.lat, drop2.lat);
    const olng1 = Math.min(pickup2.lng, drop2.lng);
    const olng2 = Math.max(pickup2.lng, drop2.lng);

    const latOverlap = Math.max(0, Math.min(lat2, olat2) - Math.max(lat1, olat1));
    const lngOverlap = Math.max(0, Math.min(lng2, olng2) - Math.max(lng1, olng1));

    const area1 = (lat2 - lat1) * (lng2 - lng1);
    const area2 = (olat2 - olat1) * (olng2 - olng1);
    const overlapArea = latOverlap * lngOverlap;

    return overlapArea / Math.min(area1, area2);
  };

  const resetForm = () => {
    setName('');
    setPickupLocation(null);
    setDropLocation(null);
    setError(null);
    setPickupKey((prev) => prev + 1); // Increment the key to force refresh
    setDropKey((prev) => prev + 1);   // Increment the key to force refresh
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     // Check if there are already 3 passengers
  if (existingPassengers.length >= 3) {
    setError('You can only add a maximum of 3 passengers.');
    return;
  }

   // Check if pickup and drop locations are the same
   if (pickupLocation?.address === dropLocation?.address) {
    setError('Pickup and drop locations cannot be the same.');
    return;
  }
    if (!name || !pickupLocation?.address || !dropLocation?.address) {
      setError('Please fill in all fields');
      return;
    }

    const resolvedPickup = await fetchCoordinates(pickupLocation.address);
    const resolvedDrop = await fetchCoordinates(dropLocation.address);

    if (!resolvedPickup || !resolvedDrop) {
      setError('Failed to resolve coordinates for addresses');
      return;
    }

    await calculateOptimizedCost(resolvedPickup, resolvedDrop);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <UserPlus className="h-5 w-5 mr-2" />
        Add New Passenger
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Passenger Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter passenger name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pickup Location
          </label>
          <AutocompleteSearch
           key={pickupKey} // Add key for refreshing
            onSelectLocation={(address, fieldName) => {
              if (fieldName === 'pickup') {
                setPickupLocation({ address, lat: 0, lng: 0 });
              }
            }}
            fieldName="pickup"
            value={pickupLocation?.address || ''}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Drop Location
          </label>
          <AutocompleteSearch
           key={dropKey} // Add key for refreshing
            onSelectLocation={(address, fieldName) => {
              if (fieldName === 'drop') {
                setDropLocation({ address, lat: 0, lng: 0 });
              }
            }}
            fieldName="drop"
            value={dropLocation?.address || ''}
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Add Passenger'}
        </button>
      </form>
    </div>
  );
}