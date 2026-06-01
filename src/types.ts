/**
 * Types and interfaces for SHRIDI WALA MEDICOS STORE
 */

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  category: MedicineCategory | string;
  type: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Cream' | 'Device' | 'Other';
  price: number; // in PKR
  dosage: string;
  description: string;
  stock: number;
  image: string;
}

export type MedicineCategory = 
  | 'Tablets'
  | 'Capsules'
  | 'Syrups'
  | 'Injections'
  | 'Antibiotics'
  | 'Pain Relief Medicines'
  | 'Diabetes Medicines'
  | 'Blood Pressure Medicines'
  | 'Heart Medicines'
  | 'Vitamins & Supplements'
  | 'Pediatric Medicines'
  | 'Women\'s Health'
  | 'Men\'s Health'
  | 'Eye Care'
  | 'Ear Care'
  | 'Skin Care'
  | 'Allergy Medicines'
  | 'Asthma Medicines'
  | 'Gastro Medicines'
  | 'Neurology Medicines'
  | 'Orthopedic Medicines';

export interface Doctor {
  id: string;
  name: string;
  category: DoctorCategory | string;
  qualification: string;
  experience: string; // e.g., "12 Years Experience"
  hospital: string;
  fee: number; // in PKR
  availableDays: string[];
  slots: string[];
  imageUrl: string;
  rating: number;
  onlineConsultation: boolean;
  clinicVisit: boolean;
}

export type DoctorCategory =
  | 'General Physician'
  | 'Cardiologist'
  | 'Dermatologist'
  | 'Pediatrician'
  | 'Gynecologist'
  | 'Neurologist'
  | 'Orthopedic Specialist'
  | 'ENT Specialist'
  | 'Eye Specialist'
  | 'Dentist'
  | 'Psychiatrist'
  | 'Gastroenterologist'
  | 'Urologist';

export interface LabTest {
  id: string;
  name: string;
  code: string;
  description: string;
  price: number; // in PKR
  turnaroundTime: string; // e.g., "12 Hours"
  sampleType: string; // e.g., "Blood"
  instructions: string; // e.g., "Fasting Required"
  category: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface DoctorAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorCategory: string;
  patientName: string;
  patientPhone: string;
  date: string;
  timeSlot: string;
  type: 'Video' | 'Clinic';
  fee: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface LabBooking {
  id: string;
  testId: string;
  testName: string;
  patientName: string;
  patientPhone: string;
  patientAddress: string;
  date: string;
  timeSlot: string;
  collectionType: 'Home' | 'Lab';
  price: number;
  status: 'Pending' | 'Sample Collected' | 'Report Generated' | 'Completed';
  reportUrl?: string;
}

export interface PrescriptionOrder {
  id: string;
  imageUrl: string;
  patientName: string;
  patientPhone: string;
  patientAddress: string;
  date: string;
  status: 'Pending Verification' | 'Verified' | 'Ordered' | 'Rejected';
  detectedMedicines?: { name: string; dosage: string; quantity: number; price: number }[];
  pharmacistNotes?: string;
  totalPrice?: number;
}

export interface CustomerOrder {
  id: string;
  items: CartItem[];
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  shippingAddress: string;
  deliveryType: 'Home Delivery' | 'Store Pickup';
  paymentMethod: 'Cash on Delivery' | 'Debit/Credit Card' | 'JazzCash' | 'EasyPaisa';
  subtotal: number;
  discount: number;
  deliveryCharges: number;
  total: number;
  couponCode?: string;
  date: string;
  status: 'Order Confirmation' | 'Processing' | 'Pharmacy Verification' | 'Packed' | 'Out for Delivery' | 'Delivered';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'refill' | 'appointment' | 'lab' | 'promo' | 'general';
  read: boolean;
}
