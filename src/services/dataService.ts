import { createClient } from '@supabase/supabase-js';

// Define DB Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'DRIVER';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  profile_url?: string;
  license_url?: string;
  pan_card_url?: string;
  bill_url?: string;
  rejection_feedback?: string;
}

export interface Vehicle {
  id: number;
  vehicleNumber: string;
  status: 'AVAILABLE' | 'ASSIGNED' | 'RENTED';
  latitude: number;
  longitude: number;
  speed: number;
  battery_level: number;
  tracker_milli_id: string;
  tracker_status: 'ONLINE' | 'OFFLINE';
  daily_rent?: number;
  updated_at: string;
}

export interface Rental {
  id: number;
  driverId: string;
  vehicleId: number;
  status: 'PENDING' | 'ACTIVE' | 'AWAITING_RETURN_APPROVAL' | 'CLOSED';
  pending_amount: number;
  paid_amount: number;
  deposit_amount: number;
  contract_total: number;
  payment_plan: string;
  photo_urls: {
    front: string;
    back: string;
    left: string;
    right: string;
    speedometer: string;
  };
  created_at: string;
}

export interface Alert {
  id: string;
  type: 'LOW_BATTERY' | 'OFFLINE_TRACKER' | 'OVERDUE_RENTAL' | 'COMMAND_DISPATCH';
  title: string;
  message: string;
  vehicleNumber: string;
  timestamp: string;
  status: 'UNREAD' | 'READ';
}

// Initial Mock Datasets
const initialUsers: User[] = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '+91 98765 43210',
    role: 'DRIVER',
    status: 'PENDING',
    profile_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    license_url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=800&auto=format&fit=crop&q=80', // mockup utility bill/licence
    pan_card_url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80',
    bill_url: 'https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Priya Patel',
    email: 'priya.patel@hotmail.com',
    phone: '+91 87654 32109',
    role: 'DRIVER',
    status: 'PENDING',
    profile_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    license_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    pan_card_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    bill_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'd3333333-3333-3333-3333-333333333333',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@yahoo.com',
    phone: '+91 76543 21098',
    role: 'DRIVER',
    status: 'APPROVED',
    profile_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    license_url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'admin-id-9999',
    name: 'Fleetly Administrator',
    email: 'admin@fleetly.com',
    phone: '+91 99999 99999',
    role: 'ADMIN',
    status: 'APPROVED'
  }
];

const initialVehicles: Vehicle[] = [
  {
    id: 1,
    vehicleNumber: 'DL 1CA 8904',
    status: 'RENTED',
    latitude: 28.6139,
    longitude: 77.2090, // Delhi Connaught Place
    speed: 48,
    battery_level: 84,
    tracker_milli_id: 'TRK-990-239X',
    tracker_status: 'ONLINE',
    daily_rent: 1200,
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    vehicleNumber: 'HR 26B 4101',
    status: 'AVAILABLE',
    latitude: 28.4595,
    longitude: 77.0266, // Gurugram
    speed: 0,
    battery_level: 95,
    tracker_milli_id: 'TRK-121-884A',
    tracker_status: 'ONLINE',
    daily_rent: 1500,
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    vehicleNumber: 'MH 12K 9988',
    status: 'RENTED',
    latitude: 28.5355,
    longitude: 77.3910, // Noida Expressway
    speed: 72,
    battery_level: 18, // LOW BATTERY ALERT
    tracker_milli_id: 'TRK-449-338W',
    tracker_status: 'ONLINE',
    daily_rent: 1800,
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    vehicleNumber: 'KA 51M 7812',
    status: 'ASSIGNED',
    latitude: 28.4900,
    longitude: 77.0800, // DLF Phase 3
    speed: 0,
    battery_level: 55,
    tracker_milli_id: 'TRK-808-112Q',
    tracker_status: 'OFFLINE', // OFFLINE TRACKER ALERT
    daily_rent: 1400,
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    vehicleNumber: 'DL 3CY 5566',
    status: 'RENTED',
    latitude: 28.5244,
    longitude: 77.1855, // Saket
    speed: 34,
    battery_level: 72,
    tracker_milli_id: 'TRK-771-419P',
    tracker_status: 'ONLINE',
    daily_rent: 1300,
    updated_at: new Date().toISOString()
  }
];

const initialRentals: Rental[] = [
  {
    id: 101,
    driverId: 'd3333333-3333-3333-3333-333333333333',
    vehicleId: 1,
    status: 'ACTIVE',
    pending_amount: 3600,
    paid_amount: 2400,
    deposit_amount: 5000,
    contract_total: 11000,
    payment_plan: 'Weekly Installments',
    photo_urls: {
      front: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
      left: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80',
      right: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80',
      speedometer: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&auto=format&fit=crop&q=80'
    },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 102,
    driverId: 'd2222222-2222-2222-2222-222222222222',
    vehicleId: 3,
    status: 'AWAITING_RETURN_APPROVAL',
    pending_amount: 1800,
    paid_amount: 5400,
    deposit_amount: 6000,
    contract_total: 13200,
    payment_plan: 'Daily Payout',
    photo_urls: {
      front: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
      left: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?w=600&auto=format&fit=crop&q=80',
      right: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80',
      speedometer: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&auto=format&fit=crop&q=80'
    },
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const initialAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'LOW_BATTERY',
    title: 'Low Battery Danger',
    message: 'Vehicle MH 12K 9988 reports critical battery level (18%). Assist driver immediately.',
    vehicleNumber: 'MH 12K 9988',
    timestamp: new Date().toISOString(),
    status: 'UNREAD'
  },
  {
    id: 'alert-2',
    type: 'OFFLINE_TRACKER',
    title: 'GPS Offline',
    message: 'Hardware tracker TRK-808-112Q for KA 51M 7812 has not responded for 45 minutes.',
    vehicleNumber: 'KA 51M 7812',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'UNREAD'
  }
];

// Supabase client instantiation (soft config check)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Standard Simulation Manager running completely in-memory, synchronized to LocalStorage
class LocalSimulationService {
  private users: User[] = [];
  private vehicles: Vehicle[] = [];
  private rentals: Rental[] = [];
  private alerts: Alert[] = [];
  private listeners: Set<() => void> = new Set();
  private simInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadState();
      this.startSimulationLoop();
    } else {
      this.users = initialUsers;
      this.vehicles = initialVehicles;
      this.rentals = initialRentals;
      this.alerts = initialAlerts;
    }
  }

  private loadState() {
    try {
      const storedUsers = localStorage.getItem('fleetly_users');
      const storedVehicles = localStorage.getItem('fleetly_vehicles');
      const storedRentals = localStorage.getItem('fleetly_rentals');
      const storedAlerts = localStorage.getItem('fleetly_alerts');

      this.users = storedUsers ? JSON.parse(storedUsers) : initialUsers;
      this.vehicles = storedVehicles ? JSON.parse(storedVehicles) : initialVehicles;
      this.rentals = storedRentals ? JSON.parse(storedRentals) : initialRentals;
      this.alerts = storedAlerts ? JSON.parse(storedAlerts) : initialAlerts;

      if (!storedUsers) this.saveState();
    } catch (e) {
      console.warn('Error loading localStorage state, using memory.', e);
      this.users = initialUsers;
      this.vehicles = initialVehicles;
      this.rentals = initialRentals;
      this.alerts = initialAlerts;
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('fleetly_users', JSON.stringify(this.users));
      localStorage.setItem('fleetly_vehicles', JSON.stringify(this.vehicles));
      localStorage.setItem('fleetly_rentals', JSON.stringify(this.rentals));
      localStorage.setItem('fleetly_alerts', JSON.stringify(this.alerts));
    } catch (e) {
      console.error('Failed saving simulator state to localStorage', e);
    }
  }

  public subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.saveState();
    this.listeners.forEach(cb => cb());
  }

  private startSimulationLoop() {
    if (this.simInterval) clearInterval(this.simInterval);

    this.simInterval = setInterval(() => {
      let stateChanged = false;

      // Update vehicle positions and speeds dynamically
      this.vehicles = this.vehicles.map(v => {
        if (v.tracker_status === 'OFFLINE') return v;

        stateChanged = true;
        // Simulates realistic moving coords near their initial location
        const angle = Date.now() * 0.0002 * (v.id % 2 === 0 ? 1 : -1);
        const radius = 0.005 + (v.id * 0.001); // Orbit size
        
        let targetLat = v.latitude;
        let targetLng = v.longitude;
        let speed = v.speed;
        let battery = v.battery_level;

        if (v.status === 'RENTED') {
          // Slowly move
          targetLat = v.latitude + (Math.sin(angle) * 0.0001);
          targetLng = v.longitude + (Math.cos(angle) * 0.00015);
          // Modulate speed
          speed = Math.max(25, Math.floor(55 + Math.sin(Date.now() * 0.001) * 20));
          // Drain battery slowly
          if (Math.random() < 0.15) {
            battery = Math.max(3, battery - 1);
            if (battery === 19) {
              this.addAlert('LOW_BATTERY', 'Low Battery Danger', `Vehicle ${v.vehicleNumber} battery has dropped to 19%.`, v.vehicleNumber);
            }
          }
        } else {
          speed = 0;
        }

        return {
          ...v,
          latitude: targetLat,
          longitude: targetLng,
          speed,
          battery_level: battery,
          updated_at: new Date().toISOString()
        };
      });

      if (stateChanged) {
        this.notify();
      }
    }, 4000);
  }

  // ALERTS Interface
  public getAlerts(): Alert[] {
    return this.alerts;
  }

  public markAlertAsRead(id: string) {
    this.alerts = this.alerts.map(a => a.id === id ? { ...a, status: 'READ' } : a);
    this.notify();
  }

  public addAlert(type: Alert['type'], title: string, message: string, vehicleNumber: string) {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      type,
      title,
      message,
      vehicleNumber,
      timestamp: new Date().toISOString(),
      status: 'UNREAD'
    };
    this.alerts = [newAlert, ...this.alerts].slice(0, 50); // limit 50 alerts
    this.notify();
  }

  // USERS Interface
  public getUsers(): User[] {
    return this.users;
  }

  public updateUserStatus(id: string, status: User['status'], feedback?: string) {
    this.users = this.users.map(u => 
      u.id === id 
        ? { ...u, status, rejection_feedback: feedback } 
        : u
    );
    this.notify();
  }

  // VEHICLES Interface
  public getVehicles(): Vehicle[] {
    return this.vehicles;
  }

  public addVehicle(data: { vehicleNumber: string; tracker_milli_id: string; daily_rent: number }) {
    // Generate Delhi NCR coordinates as default center
    const centerLat = 28.6139 + (Math.random() - 0.5) * 0.15;
    const centerLng = 77.2090 + (Math.random() - 0.5) * 0.15;

    const newVehicle: Vehicle = {
      id: this.vehicles.length + 1,
      vehicleNumber: data.vehicleNumber.toUpperCase(),
      status: 'AVAILABLE',
      latitude: centerLat,
      longitude: centerLng,
      speed: 0,
      battery_level: 100,
      tracker_milli_id: data.tracker_milli_id.toUpperCase(),
      tracker_status: 'ONLINE',
      daily_rent: data.daily_rent,
      updated_at: new Date().toISOString()
    };

    this.vehicles = [...this.vehicles, newVehicle];
    this.addAlert('COMMAND_DISPATCH', 'Fleet Expansion', `New Vehicle ${newVehicle.vehicleNumber} added with tracker ${newVehicle.tracker_milli_id}.`, newVehicle.vehicleNumber);
    this.notify();
    return newVehicle;
  }

  public toggleIgnitionLock(vehicleNumber: string): boolean {
    const vIndex = this.vehicles.findIndex(v => v.vehicleNumber === vehicleNumber);
    if (vIndex > -1) {
      const v = this.vehicles[vIndex];
      const isLocked = v.tracker_status === 'OFFLINE';
      this.vehicles[vIndex] = {
        ...v,
        tracker_status: isLocked ? 'ONLINE' : 'OFFLINE',
        speed: 0
      };
      this.addAlert(
        'COMMAND_DISPATCH',
        isLocked ? 'Ignition Restored' : 'Ignition Locked',
        `Ignition command dispatch completed for vehicle ${vehicleNumber}. Tracker is now ${isLocked ? 'ONLINE' : 'OFFLINE'}.`,
        vehicleNumber
      );
      this.notify();
      return true;
    }
    return false;
  }

  // RENTALS Interface
  public getRentals(): Rental[] {
    return this.rentals;
  }

  public approveReturn(rentalId: number) {
    const rental = this.rentals.find(r => r.id === rentalId);
    if (rental) {
      // Mark rental closed
      this.rentals = this.rentals.map(r => r.id === rentalId ? { ...r, status: 'CLOSED', pending_amount: 0 } : r);
      // Release vehicle
      this.vehicles = this.vehicles.map(v => v.id === rental.vehicleId ? { ...v, status: 'AVAILABLE', speed: 0 } : v);
      
      const v = this.vehicles.find(veh => veh.id === rental.vehicleId);
      if (v) {
        this.addAlert('COMMAND_DISPATCH', 'Rental Completed', `Vehicle ${v.vehicleNumber} inspection approved. Vehicle is now AVAILABLE.`, v.vehicleNumber);
      }
      this.notify();
    }
  }
}

export const DataSimulator = new LocalSimulationService();
