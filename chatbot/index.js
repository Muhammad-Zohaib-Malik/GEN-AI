import { initChatModel } from "langchain";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const model = await initChatModel(
  "groq:llama-3.3-70b-versatile",
  {
    apiKey: process.env.GROQ_API_KEY,
  }
);

const rl = readline.createInterface({ input, output });

// Initialize conversation memory with a system message
const messages = [
  new SystemMessage("You are funny AI Assistant.")
];

// Handle Ctrl+C gracefully
rl.on("SIGINT", () => {
  console.log("\n\n--- Conversation Ended (Ctrl+C) ---");
  console.log(messages);
  process.exit(0);
});

while (true) {
  try {
    const question = await rl.question("You: ");

    if (question.toLowerCase() === "exit") {
      break;
    }

    // Add the user's input to the memory
    messages.push(new HumanMessage(question));

    // Invoke the model with the full conversation history
    const response = await model.invoke(messages);
    
    // Add the AI's response to the memory
    messages.push(new AIMessage(response.content));

    console.log("AI:", response.content);
  } catch (err) {
    break;
  }
}

rl.close();

console.log("\n--- Final Message History ---");
console.log(messages);