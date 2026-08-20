import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("Complete_Microsoft_Excel_Series.pdf");
const docs = await loader.load();

console.log(`Loaded ${docs.length} document(s).`);

console.log(docs.length);
console.log(docs[111]);