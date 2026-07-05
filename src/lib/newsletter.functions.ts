import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().trim().email().max(320),
});

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => emailSchema.parse(data))
  .handler(async ({ data }) => {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: data.email, source: "website" });

    // Treat duplicate email as success (already subscribed).
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      return { ok: false as const, error: "Could not subscribe. Please try again." };
    }
    return { ok: true as const };
  });
