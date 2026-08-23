import { ChatPromptTemplate } from "@langchain/core/prompts";
import { initChatModel } from "langchain";
import { vectorStore } from "./db.js";
import readline from "readline/promises";

const retriever = vectorStore.asRetriever({
  searchType: "mmr",
  k: 4,
  searchKwargs: {
    fetchK: 10,
    lambda: 0.5,
  },
});

const model = await initChatModel("google-genai:gemini-3.6-flash", {
  apiKey: process.env.GEMINI_API_KEY,
});

// prompt Template
const template = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful AI Assistant.
Use ONLY the provided context to answer the question.
If the answer is not present in the context, politely say that you don't have the answer in the document.`,
  ],
  ["human", `Context: {context}\nQuestion: {question}`],
]);

console.log("======================");
console.log("RAG SYSTEM CREATED");
console.log("Press 0 to exit");
console.log("======================");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

while (true) {
  const query = await rl.question("\nAsk a question: ");

  if (query.trim() === "0") {
    console.log("Exiting...");
    rl.close();
    process.exit(0);
  }

  if (!query.trim()) continue;

  try {
    // 1. Retrieve relevant documents
    const docs = await retriever.invoke(query);

    // 2. Combine document content into a single string for context
    const context = docs.map((doc) => doc.pageContent).join("\n\n---\n\n");

    // 3. Format the prompt with context and question
    const prompt = await template.formatMessages({
      context: context,
      question: query,
    });

    // 4. Get response from model
    const response = await model.invoke(prompt);

    console.log("\n--- AI Answer ---");
    console.log(response.content);
  } catch (error) {
    console.error("Error generating answer:", error);
  }
}
