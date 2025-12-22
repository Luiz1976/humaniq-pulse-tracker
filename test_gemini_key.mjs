// Quick test of Gemini API key
const GEMINI_API_KEY = "AIzaSyBOWLfdQQdtbZN0LUYaptqnXoj9FP-DUQM";

console.log("Testing Gemini API key...");
console.log(`Key: ${GEMINI_API_KEY.substring(0, 15)}...`);

const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: "Say hello in Portuguese"
                }]
            }]
        })
    }
);

console.log(`Status: ${response.status}`);

if (response.ok) {
    const data = await response.json();
    console.log("✅ SUCCESS!");
    console.log("Response:", data.candidates[0].content.parts[0].text);
} else {
    const error = await response.text();
    console.log("❌ ERROR:");
    console.log(error);
}
