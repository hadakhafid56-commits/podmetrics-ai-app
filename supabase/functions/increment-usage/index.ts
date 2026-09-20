import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { client_id } = await req.json();

    if (!client_id || typeof client_id !== "string" || client_id.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid client_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const today = new Date().toISOString().slice(0, 10);

    const { data: existing } = await supabase
      .from("usage_tracking")
      .select("id, count")
      .eq("client_id", client_id)
      .eq("search_date", today)
      .maybeSingle();

    let newCount: number;

    if (existing) {
      newCount = existing.count + 1;
      const { error } = await supabase
        .from("usage_tracking")
        .update({ count: newCount, updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      if (error) {
        return new Response(
          JSON.stringify({ error: "Database error" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    } else {
      newCount = 1;
      const { error } = await supabase
        .from("usage_tracking")
        .insert({ client_id, search_date: today, count: newCount });

      if (error) {
        return new Response(
          JSON.stringify({ error: "Database error" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    return new Response(
      JSON.stringify({ count: newCount }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
