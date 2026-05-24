const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.scanIngredients = onCall({
  secrets: ["GEMINI_API_KEY"],
  cors: true
}, async (request) => {
  // Ensure the user sent the required data
  const data = request.data || {};
  const { image, availableIngredients } = data;

  if (!image) {
    throw new HttpsError("invalid-argument", "Image parameter is missing.");
  }

  if (!availableIngredients || !Array.isArray(availableIngredients)) {
    throw new HttpsError("invalid-argument", "availableIngredients parameter must be an array.");
  }

  // Retrieve API Key from secure environment secrets
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY environment secret is not set in Firebase Cloud Functions.");
    throw new HttpsError("failed-precondition", "System Error: Gemini API Key is not configured on the server.");
  }

  try {
    // Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Görseldeki yemek malzemelerini analiz et. Bu malzemeleri SADECE şu liste içindeki öğelerle eşleştirerek Türkçe olarak döndür: ${JSON.stringify(availableIngredients)}. Eşleşen malzemeleri SADECE düz bir JSON string dizisi şeklinde döndür (örn: ["Patlıcan", "Domates"]). Markdown formatı, kod blokları (\`\`\`json vb.) ya da açıklama ekleme, YALNIZCA geçerli bir JSON dizisi döndür. Eşleşen malzeme yoksa boş bir dizi [] döndür.`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: image
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const textResponse = result.response?.text();
    if (!textResponse) {
      throw new HttpsError("internal", "API'den boş yanıt döndü.");
    }

    let items = JSON.parse(textResponse.trim());
    
    if (Array.isArray(items)) {
      // Find matching items from the availableIngredients list (case-insensitive check)
      const validItems = items.filter(item => 
        availableIngredients.some(av => av.toLowerCase() === item.toLowerCase())
      ).map(item => {
        return availableIngredients.find(av => av.toLowerCase() === item.toLowerCase());
      });

      return { items: validItems };
    } else {
      console.error("Invalid response format parsed from Gemini:", textResponse);
      throw new HttpsError("internal", "Geçersiz API yanıt formatı.");
    }

  } catch (err) {
    console.error("Error during image analysis:", err);
    // Propagate friendly error message to client
    throw new HttpsError(
      err.status || "internal",
      err.message || "Görsel taranırken bir hata oluştu."
    );
  }
});
