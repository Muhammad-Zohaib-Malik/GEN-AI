import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { initChatModel } from "langchain";

const loader = new TextLoader("./sample.txt");
const docs = await loader.load();

const template = ChatPromptTemplate.fromMessages([
  ["system", "You are a AI that Summarize the text"],
  ["human", "{docs}"],
]);

const model = await initChatModel("groq:llama-3.3-70b-versatile", {
  apiKey: process.env.GROQ_API_KEY,
});

console.log(`Loaded ${docs.length} document(s).`);
console.log("Content:", docs[0].pageContent);

// 1. Pass an object mapping the variable "{docs}" to the actual content
const prompt = await template.formatMessages({ docs: docs[0].pageContent });

// 2. Invoke the model with the formatted prompt
const response = await model.invoke(prompt);

// 3. Print the result
console.log("\n--- AI Summary ---");
console.log(response.content);
