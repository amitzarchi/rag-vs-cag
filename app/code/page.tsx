import { CodeBlock } from "@/components/ui/code-block";

export default function CodeComparisonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">RAG vs CAG Comparison</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* RAG Code Block */}
        <div>
          <h2 className="text-xl font-semibold mb-4">RAG Implementation</h2>
          <CodeBlock
            language="python"
            filename="rag_implementation.py"
            code={`query = "What is the capital of France?"

# Load RAG components
rag_tokenizer = RagTokenizer.from_pretrained("facebook/rag-sequence-base")
rag_retriever = RagRetriever.from_pretrained("facebook/rag-sequence-base")
rag_model = RagSequenceForGeneration.from_pretrained("facebook/rag-sequence-base")

# Tokenize the query
rag_inputs = rag_tokenizer(query, return_tensors="pt")

# Generate a response using the RAG model with the retriever
rag_outputs = rag_model.generate(rag_inputs.input_ids)

# Decode and print the response
rag_response = rag_tokenizer.decode(rag_outputs[0], skip_special_tokens=True)
print("RAG Response:", rag_response)
`}
          />
        </div>

        {/* CAG Code Block */}
        <div>
          <h2 className="text-xl font-semibold mb-4">CAG Implementation</h2>
          <CodeBlock
            language="python"
            filename="cag_implementation.py"
            code={`query = "What is the capital of France?"

# Tokenize the query
inputs = tokenizer(query, return_tensors="pt")

# Retrieve the relevant KV cache (e.g., based on document ID)
doc_id = get_doc_id(query)
past_key_values = kv_cache[doc_id]

# Generate a response using the preloaded cache
with torch.no_grad():
    outputs = model.generate(
        inputs.input_ids,
        past_key_values=past_key_values,
        use_cache=True
    )

# Decode and print the response
response = tokenizer.decode(outputs[0], skip_special_tokens=True)
print("CAG Response:", response)
`}
          />
        </div>
      </div>
    </div>
  );
}
