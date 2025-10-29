const corsHeaders = {
  "Access-Control-Allow-Origin": "https://psychicchat.pages.dev",
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
    try {
      const aiResponse = await env.cfchat_binding.run(modelId, {
        prompt: prompt,
        max_tokens: 400
      });
      // Log the full response for debugging
      console.log("AI Response:", aiResponse);
      const text = aiResponse.result;
      return new Response(JSON.stringify({ reply: text, raw: aiResponse }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.log("AI Error:", error);
      return new Response(JSON.stringify({ error: error.message || "AI model call failed" }), {
        headers: { "Content-Type": "application/json" },
        status: 500
      });
    }
  }
}
