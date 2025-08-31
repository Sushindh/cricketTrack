// import React, { useState } from "react";
// import Navbar from "./Navbar";

// const predictions = [
//   { match: "India vs Australia", winner: "India", confidence: "72%", highlight: "Kohli likely to score big." },
//   { match: "England vs Pakistan", winner: "England", confidence: "61%", highlight: "Buttler to dominate." },
//   { match: "SA vs NZ", winner: "SA", confidence: "68%", highlight: "Rabada predicted 3+ wickets." },
//   { match: "Bangladesh vs SL", winner: "Sri Lanka", confidence: "53%", highlight: "Tight contest expected." },
//   { match: "WI vs Afghanistan", winner: "West Indies", confidence: "77%", highlight: "Hetmyer Match Impact." },
// ];

// export default function AiPredictions() {
//   // Pick up API key from your Vite env or fallback to empty string
//   const [apiKey, setApiKey] = useState(import.meta.env.VITE_REACT_APP_GEMINI_API_KEY || "");
//   const [responses, setResponses] = useState({}); // AI text responses per match index
//   const [loading, setLoading] = useState({});   // loading indicators per match
//   const [error, setError] = useState({});       // error messages per match

//   async function fetchAiReport(idx) {
//     if (!apiKey) {
//       alert("Please enter your Gemini API key before requesting the report.");
//       return;
//     }
//     setLoading((prev) => ({ ...prev, [idx]: true }));
//     setError((prev) => ({ ...prev, [idx]: null }));

//     try {
//       const response = await fetch(
//         "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-goog-api-key": apiKey,
//           },
//           body: JSON.stringify({
//             contents: [
//               {
//                 parts: [
//                   {
//                     text: `Provide a detailed AI prediction report for the cricket match: ${predictions[idx].match}`,
//                   },
//                 ],
//               },
//             ],
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`API error: ${response.statusText}`);
//       }

//       const data = await response.json();

//       // Extract string from Gemini API nested response
//       const content =
//         data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "No content received from AI.";

//       setResponses((prev) => ({ ...prev, [idx]: content }));

//     } catch (err) {
//       setError((prev) => ({ ...prev, [idx]: err.message }));
//     } finally {
//       setLoading((prev) => ({ ...prev, [idx]: false }));
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#f6f6f6] px-4 py-10 font-mono">
//       <Navbar />
//       <h1 className="text-5xl font-extrabold mb-6 text-black">AI PREDICTIONS</h1>
//       <div className="mb-8 flex items-center gap-3 flex-wrap">
//         <label className="font-bold text-black mr-2 whitespace-nowrap">Gemini API Key:</label>
//         <input
//           type="password"
//           value={apiKey}
//           onChange={(e) => setApiKey(e.target.value)}
//           placeholder="Enter Gemini API Key"
//           className="px-4 py-2 border-2 border-black rounded bg-white flex-grow min-w-[300px]"
//         />
//       </div>
//       <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
//         {predictions.map((pred, idx) => (
//           <div
//             key={idx}
//             className="bg-[#fffbe5] border-4 border-black rounded-xl shadow-lg p-5 flex flex-col gap-2"
//           >
//             <div className="font-bold text-lg text-black">{pred.match}</div>
//             <div className="flex gap-2 text-black">
//               <span className="bg-[#23ff91] border-2 border-black px-3 rounded">
//                 Predicted Winner: {pred.winner}
//               </span>
//               <span className="bg-[#44cdff] border-2 border-black px-3 rounded">
//                 Confidence: {pred.confidence}
//               </span>
//             </div>
//             <div className="text-[#ff4783] font-bold">{pred.highlight}</div>
//             <button
//               className="mt-2 bg-[#16a6fe] border-4 border-black rounded px-4 py-2 font-bold text-black hover:scale-105 transition"
//               onClick={() => fetchAiReport(idx)}
//               disabled={loading[idx]}
//             >
//               {loading[idx] ? "Loading..." : "View Full AI Report"}
//             </button>
//             {error[idx] && (
//               <div className="mt-2 text-red-600 font-bold">{`Error: ${error[idx]}`}</div>
//             )}
//             {responses[idx] && (
//               <div className="mt-3 bg-white border-2 border-black rounded p-3 text-black whitespace-pre-line">
//                 {responses[idx]}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import Navbar from "./Navbar";

const predictions = [
  { match: "India vs Australia", winner: "India", confidence: "72%", highlight: "Kohli likely to score big." },
  { match: "England vs Pakistan", winner: "England", confidence: "61%", highlight: "Buttler to dominate." },
  { match: "SA vs NZ", winner: "SA", confidence: "68%", highlight: "Rabada predicted 3+ wickets." },
  { match: "Bangladesh vs SL", winner: "Sri Lanka", confidence: "53%", highlight: "Tight contest expected." },
  { match: "WI vs Afghanistan", winner: "West Indies", confidence: "77%", highlight: "Hetmyer Match Impact." },
];

// Mock AI responses for chatbot messages (indexed by match)
const mockAiResponses = [
  "India's batting lineup looks solid; expect a strong performance.",
  "England's fielding and Buttler's form could be game changers.",
  "Rabada's bowling is expected to take crucial wickets.",
  "Sri Lanka's spinners will play a critical role in the middle overs.",
  "West Indies' hard-hitting middle order can dominate Afghans.",
];

export default function AiPredictions() {
  const [chatMessages, setChatMessages] = useState(
    predictions.map(() => []) // empty chat array for each match
  );
  const [inputs, setInputs] = useState(predictions.map(() => ""));

  // Simulate sending user message and receiving AI response
  const sendMessage = (idx) => {
    const userInput = inputs[idx].trim();
    if (!userInput) return;

    setChatMessages((prev) => {
      const updated = [...prev];
      updated[idx] = [
        ...updated[idx],
        { from: "user", text: userInput },
        { from: "ai", text: mockAiResponses[idx] || "AI response pending..." },
      ];
      return updated;
    });

    // Clear input
    setInputs((prev) => prev.map((val, i) => (i === idx ? "" : val)));
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] px-4 py-10 font-mono">
      <Navbar />
      <h1 className="text-5xl font-extrabold mb-10 text-black">AI CHATBOT PREDICTIONS</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {predictions.map((pred, idx) => (
          <div
            key={idx}
            className="bg-[#fffbe5] border-4 border-black rounded-xl shadow-lg p-5 flex flex-col gap-4"
          >
            <div className="font-bold text-lg text-black">{pred.match}</div>
            <div className="flex gap-2 text-black">
              <span className="bg-[#23ff91] border-2 border-black px-3 rounded">
                Predicted Winner: {pred.winner}
              </span>
              <span className="bg-[#44cdff] border-2 border-black px-3 rounded">
                Confidence: {pred.confidence}
              </span>
            </div>
            <div className="text-[#ff4783] font-bold">{pred.highlight}</div>

            <div className="flex flex-col gap-3 bg-white border-2 border-black rounded p-3 h-64 overflow-y-auto">
              {chatMessages[idx].length === 0 ? (
                <div className="italic text-gray-500">Start the chat by asking a question...</div>
              ) : (
                chatMessages[idx].map((msg, i) => (
                  <div
                    key={i}
                    className={`${
                      msg.from === "user"
                        ? "text-blue-600 font-bold self-end bg-blue-100 rounded p-1 max-w-[70%]"
                        : "text-green-900 font-semibold self-start bg-green-100 rounded p-1 max-w-[70%]"
                    }`}
                  >
                    {msg.from === "user" ? "You: " : "AI: "}
                    {msg.text}
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow px-3 py-2 border-2 border-black rounded bg-white text-black font-mono"
                placeholder="Type your question..."
                value={inputs[idx]}
                onChange={(e) =>
                  setInputs((prev) => prev.map((val, i) => (i === idx ? e.target.value : val)))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage(idx);
                }}
              />
              <button
                onClick={() => sendMessage(idx)}
                className="bg-[#16a6fe] border-4 border-black rounded px-4 py-2 font-bold text-black hover:scale-105 transition"
              >
                Send
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
