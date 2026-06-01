import { Medicine, Doctor, LabTest } from './types';

// Predefined coupons for SHRIDI WALA MEDICOS
export const AVAILABLE_COUPONS = [
  { code: 'SHRIDI10', discountPercent: 10, minPurchase: 500, description: 'Get 10% off on medicine order above Rs. 500' },
  { code: 'PAKHEALTH20', discountPercent: 20, minPurchase: 1500, description: 'Save 20% on first healthcare order' },
  { code: 'FREECOLLECT', discountPercent: 100, minPurchase: 1000, isFreeDelivery: true, description: 'Free Home Collection for Lab Tests above Rs. 1000' },
];

export const MEDICINE_CATALOG: Medicine[] = [
  // Tablets & Capsules (Pain Relief / Antibiotics / Cardiovascular / Diabetes)
  {
    id: 'med-01',
    name: 'Panadol 500mg',
    genericName: 'Paracetamol',
    brand: 'GSK Pakistan',
    category: 'Pain Relief Medicines',
    type: 'Tablet',
    price: 32, // PKR per strip of 10
    dosage: '1-2 tablets three times daily',
    description: 'Relief of mild to moderate pain including headache, migraine, toothache and period pain. Effectively reduces fever.',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-02',
    name: 'Risek 40mg Capsules',
    genericName: 'Omeprazole',
    brand: 'Getz Pharma',
    category: 'Gastro Medicines',
    type: 'Capsule',
    price: 490, // strip or pack
    dosage: '1 Capsule once daily before breakfast',
    description: 'Used for gastroesophageal reflux disease (GERD), acid-related dyspepsia, and gastric ulcers.',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-03',
    name: 'Augmentin 625mg',
    genericName: 'Co-Amoxiclav',
    brand: 'GSK Pakistan',
    category: 'Antibiotics',
    type: 'Tablet',
    price: 380, // per strip of 6
    dosage: '1 tablet twice daily as prescribed',
    description: 'Broad-spectrum antibiotic used for the treatment of bacterial infections of the respiratory tract, urinary tract, and soft tissue.',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-04',
    name: 'Leflox 500mg',
    genericName: 'Levofloxacin',
    brand: 'Getz Pharma',
    category: 'Antibiotics',
    type: 'Tablet',
    price: 420,
    dosage: '1 tablet daily',
    description: 'Advanced fluoroquinolone antibiotic used to kill various types of grammar-negative and grammar-positive bacteria.',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-05',
    name: 'Glucophage 500mg',
    genericName: 'Metformin HCl',
    brand: 'Searle Pakistan',
    category: 'Diabetes Medicines',
    type: 'Tablet',
    price: 180,
    dosage: '1 tablet with dinner',
    description: 'First-line prescription medication for the treatment of type 2 diabetes, helping control high blood sugar.',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-06',
    name: 'Avapro 150mg',
    genericName: 'Irbesartan',
    brand: 'Sami Pharmaceuticals',
    category: 'Blood Pressure Medicines',
    type: 'Tablet',
    price: 360,
    dosage: '1 tablet daily in the morning',
    description: 'Angiotensin II receptor antagonist used to treat high blood pressure (hypertension) and diabetic nephropathy.',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-07',
    name: 'Surbex-Z Coated Tablets',
    genericName: 'Zinc + Vitamin B Complex + Vitamin C',
    brand: 'Abbott Pakistan',
    category: 'Vitamins & Supplements',
    type: 'Tablet',
    price: 310,
    dosage: '1 tablet daily with lunch',
    description: 'Premium zinc and vitamin therapeutic formula designed to treat and safeguard against nutritional deficiencies.',
    stock: 65,
    image: 'https://images.unsplash.com/photo-1616671285412-25e1df11b849?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-08',
    name: 'Ventolin Inhaler',
    genericName: 'Salbutamol',
    brand: 'GSK Pakistan',
    category: 'Asthma Medicines',
    type: 'Injection', // Actually inhaler but categorizable
    price: 247,
    dosage: '1-2 puffs as required during shortness of breath',
    description: 'Fast-acting bronchodilator for rapid relief of acute asthma attacks, wheezing, and chest tightness.',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-09',
    name: 'Cac-1000 Plus Orange Effervescent',
    genericName: 'Calcium + Vitamin C, D3, B6',
    brand: 'GSK Pakistan',
    category: 'Vitamins & Supplements',
    type: 'Tablet',
    price: 285,
    dosage: '1 tablet dissolved in a glass of water daily',
    description: 'Original effervescent double formulation helping to build strong bones, teeth, and boost immunity system.',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1616671285412-25e1df11b849?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-10',
    name: 'Softin 10mg Tablets',
    genericName: 'Loratadine',
    brand: 'Ferozsons Laboratories',
    category: 'Allergy Medicines',
    type: 'Tablet',
    price: 155,
    dosage: '1 tablet daily before sleeping',
    description: 'Long-acting non-sedating antihistamine for the relief of nasal and ocular symptoms of allergic rhinitis & hives.',
    stock: 55,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-11',
    name: 'Aprovel 150mg',
    genericName: 'Irbesartan',
    brand: 'Sanofi / Martin Dow',
    category: 'Blood Pressure Medicines',
    type: 'Tablet',
    price: 495,
    dosage: '1 tablet daily',
    description: 'Prescription treatment of hypertension and slowing kidneys progression in adult patients with hypertension and type 2 diabetes.',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-12',
    name: 'Secnid 1g Tablets',
    genericName: 'Secnidazole',
    brand: 'Sami Pharmaceuticals',
    category: 'Gastro Medicines',
    type: 'Tablet',
    price: 190,
    dosage: 'Single dose of 2g (2 tablets) with meal',
    description: 'Antiamoebic and antiprotozoal medication used in intestinal & hepatic amoebiasis and trichomoniasis.',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-13',
    name: 'Entamizole Syrup 90ml',
    genericName: 'Diloxanide Furoate + Metronidazole',
    brand: 'Abbott Pakistan',
    category: 'Pediatric Medicines',
    type: 'Syrup',
    price: 135,
    dosage: '1 teaspoonful twice daily for kids, or as prescribed',
    description: 'Effective dual formulation anti-parasitic syrup targeting acute amoebic dysentery and specific bacterial intestinal infections.',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'med-14',
    name: 'Calpol Syrup 120ml',
    genericName: 'Paracetamol Suspension',
    brand: 'GSK Pakistan',
    category: 'Pediatric Medicines',
    type: 'Syrup',
    price: 88,
    dosage: 'Given according to child weight (refer packaging)',
    description: 'Gentle, rapid remedy to reduce high temperature and provide soothing pain relief for babies and children.',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },

  // Dermatology Store
  {
    id: 'derm-01',
    name: 'Maxdif skin Brightening Cream',
    genericName: 'Alpha Arbutin, Vitamin C, Kojic Acid',
    brand: 'Searle / Dermashine',
    category: 'Skin Care',
    type: 'Cream',
    price: 1250,
    dosage: 'Apply twice daily on clean face and neck',
    description: 'Highly effective skin brightening cream that reduces pigmentation, age spots, and uneven skin tone.',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'derm-02',
    name: 'Dermive Oil Free Moisturizer',
    genericName: 'Ceramides + Hyaluronic Acid',
    brand: 'Highnoon Laboratories',
    category: 'Skin Care',
    type: 'Cream',
    price: 850,
    dosage: 'Incorporate in morning and night skincare routine',
    description: 'Lightweight, fast-absorbing lotion providing deep hydration without clogging pores. Best for acne-prone skin.',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'derm-03',
    name: 'Acne-Clean Face Wash',
    genericName: 'Salicylic Acid 2%',
    brand: 'Atco Laboratories',
    category: 'Skin Care',
    type: 'Syrup', // liquid category
    price: 495,
    dosage: 'Gently wash face twice daily',
    description: 'Specially targeting blackheads, whiteheads, sebum, and active acne-causing bacteria for an absolute clear complexion.',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1556228515-4198e73be694?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'derm-04',
    name: 'SolarMax Sunscreen SPF 60',
    genericName: 'Zinc Oxide, Octyl Methoxycinnamate',
    brand: 'Barrett Hodgson',
    category: 'Skin Care',
    type: 'Cream',
    price: 1100,
    dosage: 'Apply generously 20 mins before sun exposure',
    description: 'Non-greasy, broad-spectrum UVA & UVB protection shields. Resists sweat and protects skin barrier.',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },

  // Medical Devices & Equipment
  {
    id: 'dev-01',
    name: 'Cerene BP Monitor (Automatic)',
    genericName: 'Digital Blood Pressure Monitor',
    brand: 'Abbott Medical',
    category: 'Medical Devices',
    type: 'Device',
    price: 6800,
    dosage: 'N/A',
    description: 'High precision digital Upper Arm Blood Pressure Monitor, clinically tested, automatic inflation, with WHO indicator display.',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'dev-02',
    name: 'Accu-Chek Instant Glucometer',
    genericName: 'Blood Glucose Testing Device',
    brand: 'Roche / Searle',
    category: 'Medical Devices',
    type: 'Device',
    price: 4200,
    dosage: 'N/A',
    description: 'Complete kit including Instant Monitor, 10 testing strips, lancing device, and lancets for effortless self blood sugar tracking.',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
  {
    id: 'dev-03',
    name: 'Beurer Nebulizer IH 18',
    genericName: 'Compressed Air Medical Nebulizer',
    brand: 'Beurer GmbH',
    category: 'Medical Devices',
    type: 'Device',
    price: 7500,
    dosage: 'As recommended for liquid bronchodilators',
    description: 'Inhalation therapy for treating asthma, bronchitis, and chronic respiratory diseases. High nebulization capacity.',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer'
  },
];

// List of Famous Certified Doctors in major cities of Pakistan
export const DOCTOR_CATALOG: Doctor[] = [
  {
    id: 'doc-01',
    name: 'Dr. Sarah Fatima',
    category: 'Cardiologist',
    qualification: 'MBBS, FCPS (Cardiology), FACC',
    experience: '14 Years Experience',
    hospital: 'Aga Khan University Hospital, Karachi',
    fee: 2500,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    slots: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer',
    rating: 4.9,
    onlineConsultation: true,
    clinicVisit: true
  },
  {
    id: 'doc-02',
    name: 'Prof. Dr. Tariq Khan',
    category: 'Pediatrician',
    qualification: 'MBBS, DCH, FCPS (Pediatric Medicine)',
    experience: '20 Years Experience',
    hospital: 'Children Medical Center, Lahore',
    fee: 2000,
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    slots: ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '03:00 PM', '03:30 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer',
    rating: 4.8,
    onlineConsultation: true,
    clinicVisit: true
  },
  {
    id: 'doc-03',
    name: 'Dr. Amna Bilal',
    category: 'Dermatologist',
    qualification: 'MBBS, Board Certified Derm, MD (Skin)',
    experience: '8 Years Experience',
    hospital: 'Doctors Hospital, Lahore',
    fee: 1800,
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    slots: ['06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer',
    rating: 4.7,
    onlineConsultation: true,
    clinicVisit: true
  },
  {
    id: 'doc-04',
    name: 'Dr. Asif Jamil',
    category: 'General Physician',
    qualification: 'MBBS, MRCP (UK)',
    experience: '12 Years Experience',
    hospital: 'Shifa International Hospital, Islamabad',
    fee: 1500,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    slots: ['10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer',
    rating: 4.9,
    onlineConsultation: true,
    clinicVisit: true
  },
  {
    id: 'doc-05',
    name: 'Dr. Zainab Raza',
    category: 'Gynecologist',
    qualification: 'MBBS, MCPS, FCPS (Obstetrics & Gynecology)',
    experience: '15 Years Experience',
    hospital: 'Lady Reading Hospital, Peshawar',
    fee: 2200,
    availableDays: ['Wednesday', 'Thursday', 'Saturday'],
    slots: ['02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM', '04:30 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=300&auto=format&fit=crop&q=60&referrerPolicy=no-referrer',
    rating: 4.9,
    onlineConsultation: true,
    clinicVisit: true
  }
];

// Integrated Lab tests catalog with detailed specs
export const LAB_TESTS_CATALOG: LabTest[] = [
  {
    id: 'lab-01',
    name: 'Complete Blood Count (CBC)',
    code: 'LAB-CBC',
    description: 'Evaluates overall health and detects wide range of disorders, including anemia, leukemia, and infections.',
    price: 850,
    turnaroundTime: '8 Hours',
    sampleType: 'Blood',
    instructions: 'No fasting required. Report is delivered online.',
    category: 'Haematology'
  },
  {
    id: 'lab-02',
    name: 'HbA1c (Glycated Haemoglobin)',
    code: 'LAB-HBA1C',
    description: 'Measures your average blood sugar levels over the past 3 months. Essential for diabetes monitoring and screening.',
    price: 1200,
    turnaroundTime: '12 Hours',
    sampleType: 'Blood',
    instructions: 'Fasting is recommended but not mandatory.',
    category: 'Diabetology'
  },
  {
    id: 'lab-03',
    name: 'Lipid Profile Panel',
    code: 'LAB-LIPID',
    description: 'Measures cholesterol levels (HDL, LDL, Triglycerides) to evaluate cardiovascular risk.',
    price: 1600,
    turnaroundTime: '10 Hours',
    sampleType: 'Blood',
    instructions: 'Strictly 10-12 Hours Fasting required. Drink only plain water.',
    category: 'Biochemistry'
  },
  {
    id: 'lab-04',
    name: 'Liver Function Test (LFT)',
    code: 'LAB-LFT',
    description: 'Measures proteins, enzymes, and bilirubin levels to monitor health and inflammation of the liver.',
    price: 1850,
    turnaroundTime: '12 Hours',
    sampleType: 'Blood',
    instructions: '10 Hours Fasting required.',
    category: 'Biochemistry'
  },
  {
    id: 'lab-05',
    name: 'Kidney Function Test (KFT / RFT)',
    code: 'LAB-KFT',
    description: 'Calculates Serum Creatinine, Blood Urea, and Electrolytes to trace renal performance.',
    price: 1750,
    turnaroundTime: '12 Hours',
    sampleType: 'Blood',
    instructions: 'No fasting required.',
    category: 'Biochemistry'
  },
  {
    id: 'lab-06',
    name: 'Thyroid Profile (T3, T4, TSH)',
    code: 'LAB-THYROID',
    description: 'Helps evaluate thyroid gland function and diagnose thyroid conditions such as hyperthyroidism and hypothyroidism.',
    price: 2400,
    turnaroundTime: '24 Hours',
    sampleType: 'Blood',
    instructions: 'No fasting necessary, sample should preferably be collected in the morning.',
    category: 'Endocrinology'
  },
  {
    id: 'lab-07',
    name: 'Hepatitis B & C Screening',
    code: 'LAB-HEP',
    description: 'Screening for antibodies and antigens to detect active or previous exposures to Hepatitis B and C viruses.',
    price: 1950,
    turnaroundTime: '12 Hours',
    sampleType: 'Blood',
    instructions: 'No special preparation requested.',
    category: 'Serology'
  }
];

export const PRESET_PRESCRIPTIONS_SAMPLES = [
  {
    id: 'rx-01',
    name: 'Cardio Rx - Dr. Sarah Fatima',
    snippet: 'Panadol 500mg, Risek 40mg, Augmentin 625mg',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60&referrerPolicy=no-referrer',
    medicines: [
      { name: 'Panadol 500mg', dosage: '1 tablet 3 times a day', quantity: 2, price: 32 },
      { name: 'Risek 40mg Capsules', dosage: '1 capsule before breakfast', quantity: 1, price: 490 },
      { name: 'Augmentin 625mg', dosage: '1 tablet twice a day for 5 days', quantity: 1, price: 380 }
    ],
    notes: 'Please take Augmentin for full 5 days course. Risek should be taken strictly on empty stomach.'
  },
  {
    id: 'rx-02',
    name: 'Elderly Vitality Rx - Dr. Asif Jamil',
    snippet: 'Surbex-Z, Cac-1000 Plus, Softin 10mg',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=60&referrerPolicy=no-referrer',
    medicines: [
      { name: 'Surbex-Z Coated Tablets', dosage: '1 tablet daily with lunch', quantity: 1, price: 310 },
      { name: 'Cac-1000 Plus Orange Effervescent', dosage: '1 tablet in water daily', quantity: 2, price: 285 },
      { name: 'Softin 10mg Tablets', dosage: '1 tablet at night', quantity: 1, price: 155 }
    ],
    notes: 'Excellent daily vitamins with antiallergenic support.'
  }
];
