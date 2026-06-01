import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Home as HomeIcon, 
  ShoppingBag, 
  Stethoscope, 
  Sparkles, 
  FlaskConical, 
  Activity, 
  Compass, 
  User, 
  UserPlus, 
  BadgeCheck, 
  ChevronRight, 
  Lock, 
  HelpCircle,
  Menu,
  X,
  Layers,
  HeartHandshake
} from 'lucide-react';

// Components imports
import Splash from './components/Splash';
import Auth from './components/Auth';
import Home from './components/Home';
import Pharmacy from './components/Pharmacy';
import Dermatology from './components/Dermatology';
import Devices from './components/Devices';
import PrescriptionUpload from './components/PrescriptionUpload';
import DoctorBooking from './components/DoctorBooking';
import LabSection from './components/LabSection';
import CartAndCheckout from './components/CartAndCheckout';
import Tracking from './components/Tracking';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';

// Data and types imports
import { MEDICINE_CATALOG, DOCTOR_CATALOG, LAB_TESTS_CATALOG } from './data';
import { Medicine, CartItem, CustomerOrder, DoctorAppointment, LabBooking, PrescriptionOrder } from './types';

export default function App() {
  const [splashActive, setSplashActive] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Core synchronized databases (InMemory State)
  const [medicines, setMedicines] = useState<Medicine[]>(MEDICINE_CATALOG);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [labBookings, setLabBookings] = useState<LabBooking[]>([]);
  const [prescriptionOrders, setPrescriptionOrders] = useState<PrescriptionOrder[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [homeSearchTerm, setHomeSearchTerm] = useState<string>('');
  
  // Dialog Overlays
  const [selectedDetailsMedicine, setSelectedDetailsMedicine] = useState<Medicine | null>(null);

  // Simulate initial load and turn off splash screen
  // No timer is redundant, as splash dismissed on state callback.

  // Shopping cart operations
  const handleAddMedicineToCart = (medicine: Medicine) => {
    setCart((prevCart) => {
      const match = prevCart.find((item) => item.medicine.id === medicine.id);
      if (match) {
        return prevCart.map((item) =>
          item.medicine.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { medicine, quantity: 1 }];
    });
    alert(`${medicine.name} added to your shopping bag.`);
  };

  const handleUpdateQuantity = (medicineId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.medicine.id === medicineId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (medicineId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.medicine.id !== medicineId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Prescription parser outputs direct mapping
  const handlePrescriptionParsed = (
    detectedMeds: { name: string; dosage: string; quantity: number; price: number }[],
    notes: string
  ) => {
    detectedMeds.forEach((item) => {
      const matchInCatalog = medicines.find(
        (m) => m.name.toLowerCase() === item.name.toLowerCase()
      );
      if (matchInCatalog) {
        // Add to cart state
        setCart((prev) => {
          const matchCart = prev.find((c) => c.medicine.id === matchInCatalog.id);
          if (matchCart) {
            return prev.map((c) =>
              c.medicine.id === matchInCatalog.id ? { ...c, quantity: c.quantity + item.quantity } : c
            );
          }
          return [...prev, { medicine: matchInCatalog, quantity: item.quantity }];
        });
      }
    });
    setActiveTab('cart');
  };

  // Administration operational sync handlers
  const handleAddPrescriptionOrderToHistory = (order: PrescriptionOrder) => {
    setPrescriptionOrders((prev) => [order, ...prev]);
  };

  const handleAddAppointmentToHistory = (appointment: DoctorAppointment) => {
    setAppointments((prev) => [appointment, ...prev]);
  };

  const handleAddLabBookingToHistory = (booking: LabBooking) => {
    setLabBookings((prev) => [booking, ...prev]);
  };

  const handleCheckoutComplete = (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Redirect to delivery tracker
    setActiveTab('track');
  };

  // Admin Dashboard modifications
  const handleUpdateMedicineStock = (medicineId: string, newStock: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, stock: newStock } : m))
    );
  };

  const handleUpdateMedicinePrice = (medicineId: string, newPrice: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, price: newPrice } : m))
    );
  };

  const handleVerifyPrescriptionOrder = (orderId: string, verifiedMedicines: any[], notes: string) => {
    setPrescriptionOrders((prev) =>
      prev.map((p) =>
        p.id === orderId
          ? { ...p, status: 'Verified', detectedMedicines: verifiedMedicines, pharmacistNotes: notes }
          : p
      )
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: CustomerOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleUpdateAppointmentStatus = (aptId: string, status: DoctorAppointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status } : a))
    );
  };

  const handleUpdateLabStatus = (bookingId: string, status: LabBooking['status']) => {
    setLabBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  // Total items currently in checkout cart
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative antialiased selection:bg-blue-600/10">
      
      {/* 1. Preloader Screen */}
      <AnimatePresence>
        {splashActive && (
          <motion.div
            key="splash"
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 bg-slate-950"
          >
            <Splash onDismiss={() => setSplashActive(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Authentication Screen */}
      <AnimatePresence>
        {!splashActive && !currentUser && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-slate-950 flex items-center justify-center p-4 overflow-y-auto"
          >
            <Auth 
              onSuccess={(user) => setCurrentUser(user)} 
              onBypass={() => setCurrentUser({ name: 'Guest Patient', phone: '0300-1112223', email: 'guest@shridiwala.com' })} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Dashboard Ecosystem */}
      {currentUser && (
        <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-5">
          
          {/* Header Bar */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white border border-slate-200 rounded-3xl gap-4 text-left shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-sm shadow-blue-500/10">
                <HeartHandshake className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-blue-900 tracking-tight flex items-center gap-1 uppercase">
                  SHRIDI WALA MEDICOS
                  <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                    Store
                  </span>
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">Digital Healthcare Ecosystem, Pakistan</p>
              </div>
            </div>

            {/* Quick stats & role switch controls */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3.5 sm:pt-0 border-slate-200">
              <div 
                onClick={() => setActiveTab('cart')}
                className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-slate-200/50 transition animate-fade-in"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-slate-500" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 bg-blue-650 font-mono font-bold text-[9px] text-white rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-700 font-bold font-mono">Rs.{cart.reduce((a,c) => a + (c.medicine.price * c.quantity), 0)}</span>
              </div>

              {/* Toggles between Pharmacist Admin dashboard and Patient views */}
              <button
                onClick={() => {
                  setIsAdminView(!isAdminView);
                  setActiveTab(isAdminView ? 'home' : 'admin');
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold font-sans transition flex items-center gap-1.5 cursor-pointer border ${
                  isAdminView
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/10'
                    : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                }`}
              >
                <span>{isAdminView ? '← Back to Store' : '👨‍⚕️ Pharmacist Admin Area'}</span>
              </button>
            </div>
          </header>

          {/* Navigation rail for quick tabs switching */}
          {!isAdminView && (
            <nav className="flex gap-1.5 overflow-x-auto pb-1.5 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm scrollbar-thin scrollbar-thumb-slate-200">
              {[
                { id: 'home', label: 'Ecosystem Feed', icon: HomeIcon },
                { id: 'pharmacy', label: 'Medications', icon: Layers },
                { id: 'dermatology', label: 'Skin Care', icon: Sparkles },
                { id: 'devices', label: 'Vital Devices', icon: Activity },
                { id: 'prescription_scan', label: 'AI Prescription', icon: Lock },
                { id: 'doctors', label: 'Doctors', icon: Stethoscope },
                { id: 'labs', label: 'Diagnostics', icon: FlaskConical },
                { id: 'track', label: 'Courier Tracker', icon: Compass },
                { id: 'profile', label: 'Health Vault', icon: User }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsAdminView(false);
                  }}
                  className={`px-3 py-2 text-xs font-bold rounded-xl shrink-0 transition flex items-center gap-1.5 border cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow shadow-blue-500/10'
                      : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Live Router viewport */}
          <main className="flex-1 min-h-[460px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={isAdminView ? 'admin' : activeTab}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.18 }}
                className="w-full h-full"
              >
                {isAdminView ? (
                  <AdminDashboard
                    medicines={medicines}
                    orders={orders}
                    appointments={appointments}
                    labBookings={labBookings}
                    prescriptionOrders={prescriptionOrders}
                    onUpdateMedicineStock={handleUpdateMedicineStock}
                    onUpdateMedicinePrice={handleUpdateMedicinePrice}
                    onVerifyPrescriptionOrder={handleVerifyPrescriptionOrder}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                    onUpdateLabStatus={handleUpdateLabStatus}
                  />
                ) : (
                  <>
                    {activeTab === 'home' && (
                      <Home
                        onNavigateTo={(screen) => setActiveTab(screen === 'prescription' ? 'prescription_scan' : screen)}
                        onAddMedicineToCart={handleAddMedicineToCart}
                        searchTerm={homeSearchTerm}
                        setSearchTerm={setHomeSearchTerm}
                        onOpenMedicineDetails={(med) => setSelectedDetailsMedicine(med)}
                      />
                    )}
                    {activeTab === 'pharmacy' && (
                      <Pharmacy
                        onAddMedicineToCart={handleAddMedicineToCart}
                        selectedDetailsMedicine={selectedDetailsMedicine}
                        setSelectedDetailsMedicine={setSelectedDetailsMedicine}
                      />
                    )}
                    {activeTab === 'dermatology' && (
                      <Dermatology
                        onAddMedicineToCart={handleAddMedicineToCart}
                        onOpenMedicineDetails={(med) => setSelectedDetailsMedicine(med)}
                      />
                    )}
                    {activeTab === 'devices' && (
                      <Devices
                        onAddMedicineToCart={handleAddMedicineToCart}
                        onOpenMedicineDetails={(med) => setSelectedDetailsMedicine(med)}
                      />
                    )}
                    {activeTab === 'prescription_scan' && (
                      <PrescriptionUpload
                        onPrescriptionParsed={handlePrescriptionParsed}
                        onAddPrescriptionOrderToHistory={handleAddPrescriptionOrderToHistory}
                      />
                    )}
                    {activeTab === 'doctors' && (
                      <DoctorBooking
                        onAddAppointmentToHistory={handleAddAppointmentToHistory}
                      />
                    )}
                    {activeTab === 'labs' && (
                      <LabSection
                        onAddLabBookingToHistory={handleAddLabBookingToHistory}
                      />
                    )}
                    {activeTab === 'cart' && (
                      <CartAndCheckout
                        cart={cart}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onCheckoutComplete={handleCheckoutComplete}
                        onClearCart={handleClearCart}
                      />
                    )}
                    {activeTab === 'track' && (
                      <Tracking orders={orders} />
                    )}
                    {activeTab === 'profile' && (
                      <Profile
                        user={currentUser}
                        appointments={appointments}
                        labBookings={labBookings}
                        prescriptionOrders={prescriptionOrders}
                        orders={orders}
                      />
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Persistent elegant footer */}
          <footer className="text-center py-6 text-[11px] text-slate-400 border-t border-slate-205 mt-8 max-w-lg mx-auto leading-relaxed">
            <p>SHRIDI WALA MEDICOS © 2026. Certified Pharmacy License PMDC-9922/A.</p>
            <p className="mt-0.5">Complies with health diagnostic guidelines & drug safety structures in Pakistan.</p>
          </footer>

        </div>
      )}

    </div>
  );
}
