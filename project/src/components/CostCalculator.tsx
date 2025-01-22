import { Route, Vehicle, Passenger } from '../types';
import { IndianRupee, Route as RouteIcon, Users, Car, PieChart, TrendingDown, Map } from 'lucide-react';

interface CostCalculatorProps {
  route: Route;
  vehicle: Vehicle;
  passengers: Passenger[];
  removePassenger: (id: string) => void; // Add a remove function to props
}

export default function CostCalculator({ route, vehicle, passengers, removePassenger }: CostCalculatorProps) {
  // Calculate base trip costs
  const calculateTripCost = (distance: number) => {
    const fuelNeeded = distance / vehicle.averageMileage;
    const fuelCost = fuelNeeded * vehicle.fuelPrice;
    const maintenanceCost = fuelCost * 0.2;
    return { fuelCost, maintenanceCost, total: fuelCost };
  };

  const mainTripCosts = calculateTripCost(route.distance);
  
  // Calculate driver's base cost (they pay for the main route)
  const driverCost = mainTripCosts.total;

  // Calculate total distance and costs
  const totalDistance = route.distance;
  const passengersTotalCost = passengers.reduce((sum, p) => sum + p.cost, 0);
  const totalCost = mainTripCosts.total; // Represents the entire trip cost (fuel + maintenance)
  const driverShare = totalCost - passengersTotalCost;

  // Calculate savings for each passenger
  const calculatePassengerSavings = (passenger: Passenger) => {
    const soloTripCost = calculateTripCost(passenger.distance).total;
    return soloTripCost - passenger.cost;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Main Trip Overview */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
          <Map className="w-6 h-6 mr-2" />
          Trip Overview
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Main Route Distance</p>
            <p className="font-medium text-lg">{route.distance.toFixed(1)} km</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Trip Distance</p>
            <p className="font-medium text-lg">{totalDistance.toFixed(1)} km</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Vehicle Efficiency</p>
            <p className="font-medium text-lg">{vehicle.averageMileage.toFixed(1)} km/L</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Fuel Price</p>
            <p className="font-medium text-lg">₹{vehicle.fuelPrice.toFixed(2)}/L</p>
          </div>
        </div>
      </div>

      {/* Driver's Cost */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center text-blue-700">
          <Car className="w-5 h-5 mr-2" />
          Driver's Share
        </h3>
        <div className="bg-blue-50 p-4 rounded-md space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Base Fuel Cost</span>
            <span className="font-medium">₹{mainTripCosts.fuelCost.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between items-center font-medium text-blue-700">
            <span>Driver's Total Cost</span>
            <span>₹{driverShare.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Passenger Details */}
      {passengers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center text-purple-700">
            <Users className="w-5 h-5 mr-2" />
            Passenger Contributions
          </h3>
          <div className="space-y-3">
            {passengers.map((passenger) => {
              const savings = calculatePassengerSavings(passenger);
              const soloTripCost = calculateTripCost(passenger.distance).total;
              
              return (
                <div
                  key={passenger.id}
                  className="bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-lg">{passenger.name}</span>
                    <div className="text-right">
                      <span className="text-green-600 font-medium text-lg block">
                        ₹{passenger.cost.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {((passenger.cost / totalCost) * 100).toFixed(1)}% of total
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>From: {passenger.pickupLocation.address}</p>
                    <p>To: {passenger.dropLocation.address}</p>
                    <p>Distance: {passenger.distance.toFixed(1)} km</p>
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Solo trip would cost:</span>
                        <span className="font-medium">₹{soloTripCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Savings:</span>
                        <span className="font-medium">₹{savings.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Remove Button */}
                  <button
                    onClick={() => removePassenger(passenger.id)}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Passenger
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Total Cost Summary */}
      <div className="border-t pt-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center text-lg font-semibold text-blue-700">
            <div className="flex items-center">
              <IndianRupee className="w-5 h-5 mr-2" />
              Total Trip Cost
            </div>
            <span>₹{totalCost.toFixed(2)}</span>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Driver's Share:</span>
              <span className="font-medium">₹{driverShare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Passengers' Total:</span>
              <span className="font-medium">₹{passengersTotalCost.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Each passenger pays based on their actual travel distance and route overlap
          </p>
        </div>
      </div>
    </div>
  );
}

// import { Route, Vehicle, Passenger } from '../types';
// import { IndianRupee, Route as RouteIcon, Users, Car, PieChart, TrendingDown, Map } from 'lucide-react';

// interface CostCalculatorProps {
//   route: Route;
//   vehicle: Vehicle;
//   passengers: Passenger[];
// }

// export default function CostCalculator({ route, vehicle, passengers }: CostCalculatorProps) {
//   // Calculate base trip costs
//   const calculateTripCost = (distance: number) => {
//     const fuelNeeded = distance / vehicle.averageMileage;
//     const fuelCost = fuelNeeded * vehicle.fuelPrice;
//     const maintenanceCost = fuelCost * 0.2;
//     return { fuelCost, maintenanceCost, total: fuelCost  };
//   };

//   const mainTripCosts = calculateTripCost(route.distance);
  
//   // Calculate driver's base cost (they pay for the main route)
//   const driverCost = mainTripCosts.total;

//   // Calculate total distance and costs
//   const totalDistance = route.distance;
//   const passengersTotalCost = passengers.reduce((sum, p) => sum + p.cost, 0);
//   // const totalCost = driverCost + passengersTotalCost;
//   const totalCost = mainTripCosts.total; // Represents the entire trip cost (fuel + maintenance)
//   const driverShare = totalCost - passengersTotalCost;

//   // Calculate savings for each passenger
//   const calculatePassengerSavings = (passenger: Passenger) => {
//     const soloTripCost = calculateTripCost(passenger.distance).total;
//     return soloTripCost - passenger.cost;
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
//       {/* Main Trip Overview */}
//       <div className="border-b pb-4">
//         <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
//           <Map className="w-6 h-6 mr-2" />
//           Trip Overview
//         </h2>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-blue-50 p-3 rounded-lg">
//             <p className="text-sm text-gray-600">Main Route Distance</p>
//             <p className="font-medium text-lg">{route.distance.toFixed(1)} km</p>
//           </div>
//           <div className="bg-green-50 p-3 rounded-lg">
//             <p className="text-sm text-gray-600">Total Trip Distance</p>
//             <p className="font-medium text-lg">{totalDistance.toFixed(1)} km</p>
//           </div>
//           <div className="bg-yellow-50 p-3 rounded-lg">
//             <p className="text-sm text-gray-600">Vehicle Efficiency</p>
//             <p className="font-medium text-lg">{vehicle.averageMileage.toFixed(1)} km/L</p>
//           </div>
//           <div className="bg-purple-50 p-3 rounded-lg">
//             <p className="text-sm text-gray-600">Fuel Price</p>
//             <p className="font-medium text-lg">₹{vehicle.fuelPrice.toFixed(2)}/L</p>
//           </div>
//         </div>
//       </div>

//       {/* Driver's Cost */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold flex items-center text-blue-700">
//           <Car className="w-5 h-5 mr-2" />
//           Driver's Share
//         </h3>
//         <div className="bg-blue-50 p-4 rounded-md space-y-3">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-600">Base Fuel Cost</span>
//             <span className="font-medium">₹{mainTripCosts.fuelCost.toFixed(2)}</span>
//           </div>
//           {/* <div className="flex justify-between items-center">
//             <span className="text-gray-600">Maintenance Cost</span>
//             <span className="font-medium">₹{mainTripCosts.maintenanceCost.toFixed(2)}</span>
//           </div> */}
//           <div className="border-t pt-2 flex justify-between items-center font-medium text-blue-700">
//             <span>Driver's Total Cost</span>
//             {/* <span>₹{driverCost.toFixed(2)}</span> */}
//             <span>₹{driverShare.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Passenger Details */}
//       {passengers.length > 0 && (
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold flex items-center text-purple-700">
//             <Users className="w-5 h-5 mr-2" />
//             Passenger Contributions
//           </h3>
//           <div className="space-y-3">
//             {passengers.map((passenger) => {
//               const savings = calculatePassengerSavings(passenger);
//               const soloTripCost = calculateTripCost(passenger.distance).total;
              
//               return (
//                 <div
//                   key={passenger.id}
//                   className="bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="font-medium text-lg">{passenger.name}</span>
//                     <div className="text-right">
//                       <span className="text-green-600 font-medium text-lg block">
//                         ₹{passenger.cost.toFixed(2)}
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         {((passenger.cost / totalCost) * 100).toFixed(1)}% of total
//                       </span>
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-600 space-y-1">
//                     <p>From: {passenger.pickupLocation.address}</p>
//                     <p>To: {passenger.dropLocation.address}</p>
//                     <p>Distance: {passenger.distance.toFixed(1)} km</p>
//                     <div className="mt-2 pt-2 border-t">
//                       <div className="flex justify-between text-sm">
//                         <span>Solo trip would cost:</span>
//                         <span className="font-medium">₹{soloTripCost.toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between text-sm text-green-600">
//                         <span>Savings:</span>
//                         <span className="font-medium">₹{savings.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Total Cost Summary */}
//       <div className="border-t pt-4 mt-6">
//         <div className="bg-blue-50 p-4 rounded-lg space-y-4">
//           <div className="flex justify-between items-center text-lg font-semibold text-blue-700">
//             <div className="flex items-center">
//               <IndianRupee className="w-5 h-5 mr-2" />
//               Total Trip Cost
//             </div>
//             <span>₹{totalCost.toFixed(2)}</span>
//           </div>
//           <div className="space-y-2 text-sm text-gray-600">
//             <div className="flex justify-between">
//               <span>Driver's Share:</span>
//               <span className="font-medium">₹{driverShare.toFixed(2)}</span>

//             </div>
//             <div className="flex justify-between">
//               <span>Passengers' Total:</span>
//               <span className="font-medium">₹{passengersTotalCost.toFixed(2)}</span>
//             </div>
//           </div>
//           <p className="text-sm text-gray-600 mt-2">
//             Each passenger pays based on their actual travel distance and route overlap
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }