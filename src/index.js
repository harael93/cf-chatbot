const corsHeaders = {
	"Access-Control-Allow-Origin": "http://localhost:5173",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type"
};

export const onRequestOptions = async () => {
	return new Response(null, {
		status: 204,
		headers: corsHeaders
	});
};

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("POST only", { status: 405 });

    const { prompt, history } = await request.json();

    // Call a Workers AI model (example model id from Cloudflare catalog)
    const modelId = "@cf/meta/llama-3.1-8b-instruct"; // example - pick from the Models page
    const aiResponse = await env.AI.run(modelId, {
      prompt: prompt,
      // use scoped prompts / messages for chat-style interfaces (see docs)
      // other options: max_tokens, temperature, streaming, etc.
      max_tokens: 400
    });

    // aiResponse is a Response-like object; get JSON or text as needed:
    const text = await aiResponse.text();

    // Optionally store conversation state (see next step)
    return new Response(JSON.stringify({ reply: text }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
