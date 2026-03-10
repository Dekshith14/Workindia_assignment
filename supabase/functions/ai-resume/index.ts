import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, jobTitle, experience, description } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      // Fallback mock responses
      return mockResponse(type, jobTitle, description);
    }

    let prompt = "";
    let toolConfig: any = undefined;

    if (type === "summary") {
      prompt = `Write a professional resume summary (2-3 sentences) for a ${jobTitle}. Their experience: ${experience || "not specified"}. Be concise and impactful.`;
    } else if (type === "improve") {
      prompt = `Rewrite this resume experience description to be more professional and impactful. Use action verbs and quantify results where possible. Original: "${description}"`;
    } else if (type === "skills") {
      prompt = `Suggest 8-10 relevant technical and soft skills for a ${jobTitle} position. Return them as a JSON array of strings.`;
      toolConfig = {
        tools: [{
          type: "function",
          function: {
            name: "return_skills",
            description: "Return skill suggestions",
            parameters: {
              type: "object",
              properties: {
                skills: { type: "array", items: { type: "string" } }
              },
              required: ["skills"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "return_skills" } }
      };
    } else {
      return new Response(JSON.stringify({ error: "Unknown type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a professional resume writing assistant. Be concise and impactful." },
        { role: "user", content: prompt },
      ],
      ...(toolConfig || {}),
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return mockResponse(type, jobTitle, description);
    }

    const aiData = await response.json();

    let result: any;
    if (type === "skills") {
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        result = JSON.parse(toolCall.function.arguments).skills;
      } else {
        result = ["JavaScript", "TypeScript", "React", "Node.js", "Communication", "Problem Solving"];
      }
    } else {
      result = aiData.choices?.[0]?.message?.content?.trim() || "";
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function mockResponse(type: string, jobTitle?: string, description?: string) {
  let result: any;
  if (type === "summary") {
    result = `Results-driven ${jobTitle || "professional"} with a proven track record of delivering high-impact solutions. Skilled in cross-functional collaboration and committed to continuous improvement.`;
  } else if (type === "improve") {
    result = `Spearheaded ${description || "key initiatives"}, driving measurable improvements in team productivity and project delivery timelines.`;
  } else if (type === "skills") {
    result = ["JavaScript", "TypeScript", "React", "Node.js", "Git", "Agile", "Communication", "Problem Solving"];
  }
  return new Response(JSON.stringify({ result }), {
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
  });
}
