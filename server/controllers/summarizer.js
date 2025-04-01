
const { GoogleGenAI } = require('@google/genai');


const ai = new GoogleGenAI({ apiKey:process.env.GEMINI_API_KEY }); 

async function summarizeReviews(reviews) {
    if (!reviews?.length) {
      const EmtpyMessage = "There are no reviews for this product."
      return EmtpyMessage;
    }
  
    const prompt = `Summarize the customer sentiment, key pros and cons from the following reviews in a JSON format. Provide 4 pros and 3 cons each in a list. format the response like this: { "sentiment": "...", "pros": ["pro1", "pro2", "pro3", "pro4"], "cons": ["con1", "con2", "con3"] }:\n\n` +
      reviews.map((r, i) =>
        `Review ${i + 1} by ${r.name} (${r.rating}★):\n${r.body}`
      ).join('\n\n');
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash", 
        contents: prompt,
      });
  
      const summarizedText = response.text;
    //   console.log("Raw Response:", summarizedText); 
  
      // Parse the JSON response
      const jsonString = summarizedText.replace(/```json\n/g, '').replace(/```/g, '');

      // Parse the JSON response
      const parsedResponse = JSON.parse(jsonString);
  
      console.log("Parsed Response:", parsedResponse); 
  
      return parsedResponse;
    } catch (error) {
      console.error("Error summarizing reviews:", error);
      throw error;
    }
  }

module.exports=summarizeReviews;