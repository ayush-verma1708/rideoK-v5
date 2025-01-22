import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  startLocation: {
    lat: { type: Number,  },
    lng: { type: Number,  },
    address: { type: String,  }
  },
  endLocation: {
    lat: { type: Number,  },
    lng: { type: Number,  },
    address: { type: String,  }
  },
  distance: { type: Number,  },
  passengers: [{
    id: { type: String,  },
    name: { type: String,  },
    pickupLocation: {
      lat: { type: Number,  },
      lng: { type: Number,  },
      address: { type: String,  }
    },
    dropLocation: {
      lat: { type: Number,  },
      lng: { type: Number,  },
      address: { type: String,  }
    },
    distance: { type: Number,  },
    cost: { type: Number,  }
  }],
  vehicle: {
    averageMileage: { type: Number,  },
    fuelPrice: { type: Number,  }
  },
  totalCost: { type: Number,  },
  costPerPerson: { type: Number,  },
  createdAt: { type: Date, default: Date.now }
});

export const Ride = mongoose.model('Ride', rideSchema);