const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Generate general response
const generateResponse = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error.message);
    throw new Error('Failed to generate AI response');
  }
};

// Generate match prediction
const generatePrediction = async (matchData, userQuestion) => {
  try {
    const prompt = `
    As a cricket expert, analyze this match data and answer the user's question:
    
    Match: ${matchData.name || 'Unknown Match'}
    Teams: ${matchData.teamInfo?.[0]?.name} vs ${matchData.teamInfo?.[1]?.name}
    Status: ${matchData.status}
    
    Current Scores:
    ${matchData.score?.map(s => `${s.inning}: ${s.r}/${s.w} (${s.o} overs)`).join('\n')}
    
    User Question: ${userQuestion}
    
    Provide a detailed, expert analysis and prediction.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating prediction:', error.message);
    throw new Error('Failed to generate match prediction');
  }
};

module.exports = {
  generateResponse,
  generatePrediction
};
