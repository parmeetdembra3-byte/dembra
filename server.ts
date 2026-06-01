import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

// Shared list of medicines so the AI can prioritize matching catalog items
const CATALOG_MEDICINE_REFERENCES = [
  { name: 'Panadol 500mg', brand: 'GSK Pakistan', price: 32 },
  { name: 'Risek 40mg Capsules', brand: 'Getz Pharma', price: 490 },
  { name: 'Augmentin 625mg', brand: 'GSK Pakistan', price: 380 },
  { name: 'Leflox 500mg', brand: 'Getz Pharma', price: 420 },
  { name: 'Glucophage 500mg', brand: 'Searle Pakistan', price: 180 },
  { name: 'Avapro 150mg', brand: 'Sami Pharmaceuticals', price: 360 },
  { name: 'Surbex-Z Coated Tablets', brand: 'Abbott Pakistan', price: 310 },
  { name: 'Ventolin Inhaler', brand: 'GSK Pakistan', price: 247 },
  { name: 'Cac-1000 Plus Orange Effervescent', brand: 'GSK Pakistan', price: 285 },
  { name: 'Softin 10mg Tablets', brand: 'Ferozsons Laboratories', price: 155 },
  { name: 'Avapro 150mg', brand: 'Sami Pharmaceuticals', price: 360 },
  { name: 'Secnid 1g Tablets', brand: 'Sami Pharmaceuticals', price: 190 },
  { name: 'Entamizole Syrup 90ml', brand: 'Abbott Pakistan', price: 135 },
  { name: 'Calpol Syrup 120ml', brand: 'GSK Pakistan', price: 88 },
  { name: 'Maxdif skin Brightening Cream', brand: 'Searle / Dermashine', price: 1250 },
  { name: 'Dermive Oil Free Moisturizer', brand: 'Highnoon Laboratories', price: 850 },
  { name: 'Acne-Clean Face Wash', brand: 'Atco Laboratories', price: 495 },
  { name: 'SolarMax Sunscreen SPF 60', brand: 'Barrett Hodgson', price: 1100 }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set body parsers for high-res prescription scanning base64 payloads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize Gemini Client Lazily/Safely so missing environment variable won't crash server
  let ai: GoogleGenAI | null = null;
  function getGemini(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        throw new Error('GEMINI_API_KEY environment variable is missing. Please add it in the Secrets panel.');
      }
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
    return ai;
  }

  // API Check Status Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'SHRIDI WALA MEDICOS STORE Backend',
      hasGeminiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    });
  });

  // REST Prescription Scan API
  app.post('/api/prescription/scan', async (req: express.Request, res: express.Response) => {
    try {
      const { imageBase64, sampleText } = req.body;

      if (!imageBase64 && !sampleText) {
        res.status(400).json({ error: 'Please submit a prescription image or select a pre-designed sample.' });
        return;
      }

      // Check if API Key exists, if not, fallback to high-fidelity mock processing to guarantee pristine offline experience
      let hasRealKey = false;
      try {
        hasRealKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
      } catch (err) {
        // Safe check
      }

      if (!hasRealKey) {
        // Fallback simulate process so the app is always highly functional to test
        console.warn('GEMINI_API_KEY is not defined. Falling back to high-fidelity simulation.');
        
        let responsePayload;

        if (sampleText && sampleText.includes('Cardio')) {
          responsePayload = {
            detectedMedicines: [
              { name: 'Panadol 500mg', dosage: '1 tablet 3 times a day', quantity: 2, price: 32 },
              { name: 'Risek 40mg Capsules', dosage: '1 capsule before breakfast', quantity: 1, price: 490 },
              { name: 'Augmentin 625mg', dosage: '1 tablet twice a day for 5 days', quantity: 1, price: 380 }
            ],
            pharmacistNotes: 'Simulated Extraction: Please take Augmentin for full 5 days course. Risek should be taken strictly on empty stomach. Safe, patient-verified mock diagnostics active.'
          };
        } else {
          responsePayload = {
            detectedMedicines: [
              { name: 'Surbex-Z Coated Tablets', dosage: '1 tablet daily with lunch', quantity: 1, price: 310 },
              { name: 'Cac-1000 Plus Orange Effervescent', dosage: '1 tablet in water daily', quantity: 2, price: 285 },
              { name: 'Softin 10mg Tablets', dosage: '1 tablet at night', quantity: 1, price: 155 }
            ],
            pharmacistNotes: 'Simulated Extraction: Premium general health vitamins recommendation. Highly effective when taken regularly.'
          };
        }

        setTimeout(() => {
          res.json({
            success: true,
            isSimulation: true,
            ...responsePayload
          });
        }, 1500);
        return;
      }

      const geminiInstance = getGemini();

      let response;
      const prompt = `You are a certified clinical pharmacist at "SHRIDI WALA MEDICOS STORE" in Pakistan.
Review this medical prescription (delivered as image or description). Identify the medications mentioned.
Cross-reference them against our precise store catalog of Pakistani medications:
${JSON.stringify(CATALOG_MEDICINE_REFERENCES, null, 2)}

Ensure you pick closest matches. For instance, if you see:
- Paracetamol, recommend "Panadol 500mg" (Price: 32 PKR)
- Omeprazole, recommend "Risek 40mg Capsules" (Price: 490 PKR)
- Co-Amoxiclav, recommend "Augmentin 625mg" (Price: 380 PKR)
- Levofloxacin, recommend "Loflox 500mg" or "Leflox 500mg" (Price: 420 PKR)
- Metformin, recommend "Glucophage 500mg" (Price: 180 PKR)
- Zinc or multi, recommend "Surbex-Z Coated Tablets" (Price: 310 PKR)
- Salbutamol, recommend "Ventolin Inhaler" (Price: 247 PKR)
- Calcium, recommend "Cac-1000 Plus Orange Effervescent" (Price: 285 PKR)
- Loratadine, recommend "Softin 10mg Tablets" (Price: 155 PKR)

Please structured return a JSON list of matches that can be added to the shopping cart.
Strictly respond with the requested schema format. Provide logical pharmacist notes for usage.`;

      if (imageBase64) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const imagePart = {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        };

        response = await geminiInstance.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: [
            imagePart,
            { text: prompt }
          ],
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                detectedMedicines: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: 'Matched product name in the catalog' },
                      dosage: { type: Type.STRING, description: 'Client warning or dosage frequency' },
                      quantity: { type: Type.INTEGER, description: 'Logical count of packs to purchase' },
                      price: { type: Type.INTEGER, description: 'PKR Price from reference catalog' }
                    },
                    required: ['name', 'dosage', 'quantity', 'price']
                  }
                },
                pharmacistNotes: { type: Type.STRING, description: 'General suggestions or requirements like Fasting' }
              },
              required: ['detectedMedicines', 'pharmacistNotes']
            }
          }
        });
      } else {
        response = await geminiInstance.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `Sample Prescription Description: ${sampleText}\n\n${prompt}`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                detectedMedicines: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      dosage: { type: Type.STRING },
                      quantity: { type: Type.INTEGER },
                      price: { type: Type.INTEGER }
                    },
                    required: ['name', 'dosage', 'quantity', 'price']
                  }
                },
                pharmacistNotes: { type: Type.STRING }
              },
              required: ['detectedMedicines', 'pharmacistNotes']
            }
          }
        });
      }

      const jsonString = response.text?.trim() || '{}';
      const parsed = JSON.parse(jsonString);

      res.json({
        success: true,
        isSimulation: false,
        ...parsed
      });

    } catch (error: any) {
      console.error('Error scanning prescription:', error);
      res.status(500).json({
        success: false,
        error: error?.message || 'Server error reading prescription'
      });
    }
  });

  // Handle Static File Serving & Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SHRIDI WALA MEDICOS STORE Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
