import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { initChatModel } from "langchain";

const loader = new TextLoader("./sample.txt");
const docs = await loader.load();

const template = ChatPromptTemplate.fromMessages([
  ["system", "You are an AI that summarizes the text."],
  ["human", "{docs}"],
]);

const model = await initChatModel("google-genai:gemini-3.6-flash", {
  apiKey: process.env.GEMINI_API_KEY,
});

console.log(`Loaded ${docs.length} document(s).`);
console.log("Content:", docs[0].pageContent);

const prompt = await template.formatMessages({
  docs: docs[0].pageContent,
});

const response = await model.invoke(prompt);

console.log("\n--- AI Summary ---");
console.log(response.content);