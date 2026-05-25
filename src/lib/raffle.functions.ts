import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { checkAdminAuth } from "@/lib/admin-auth.server";

const AuthSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

const BuyerSchema = AuthSchema.extend({
  nome: z.string().trim().min(1).max(120),
  telefone: z.string().trim().min(1).max(40),
  cidade: z.string().trim().max(120).optional().nullable(),
  numeros: z.array(z.number().int().min(1).max(10000)).min(1).max(2000),
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input) => AuthSchema.parse(input))
  .handler(async ({ data }) => {
    if (!checkAdminAuth(data.username, data.password)) {
      throw new Error("Credenciais invalidas");
    }
    return { ok: true };
  });

export const adminCreateBuyer = createServerFn({ method: "POST" })
  .inputValidator((input) => BuyerSchema.parse(input))
  .handler(async ({ data }) => {
    if (!checkAdminAuth(data.username, data.password)) throw new Error("Nao autorizado");

    // Check conflicts
    const { data: existing, error: exErr } = await supabaseAdmin
      .from("blocked_numbers")
      .select("numero")
      .in("numero", data.numeros);
    if (exErr) throw new Error(exErr.message);
    if (existing && existing.length > 0) {
      throw new Error(`Numeros ja bloqueados: ${existing.map((r) => r.numero).join(", ")}`);
    }

    const { data: buyer, error: bErr } = await supabaseAdmin
      .from("buyers")
      .insert({
        nome: data.nome,
        telefone: data.telefone,
        cidade: data.cidade ?? null,
        numeros: data.numeros,
      })
      .select()
      .single();
    if (bErr) throw new Error(bErr.message);

    const rows = data.numeros.map((n) => ({ numero: n, buyer_id: buyer.id }));
    const { error: blErr } = await supabaseAdmin.from("blocked_numbers").insert(rows);
    if (blErr) {
      await supabaseAdmin.from("buyers").delete().eq("id", buyer.id);
      throw new Error(blErr.message);
    }
    return { id: buyer.id };
  });

export const adminUpdateBuyer = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    BuyerSchema.extend({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    if (!checkAdminAuth(data.username, data.password)) throw new Error("Nao autorizado");

    const { data: conflict, error: cErr } = await supabaseAdmin
      .from("blocked_numbers")
      .select("numero, buyer_id")
      .in("numero", data.numeros);
    if (cErr) throw new Error(cErr.message);
    const bad = (conflict ?? []).filter((r) => r.buyer_id !== data.id).map((r) => r.numero);
    if (bad.length > 0) throw new Error(`Numeros pertencem a outro comprador: ${bad.join(", ")}`);

    const { error: uErr } = await supabaseAdmin
      .from("buyers")
      .update({
        nome: data.nome,
        telefone: data.telefone,
        cidade: data.cidade ?? null,
        numeros: data.numeros,
      })
      .eq("id", data.id);
    if (uErr) throw new Error(uErr.message);

    await supabaseAdmin.from("blocked_numbers").delete().eq("buyer_id", data.id);
    const rows = data.numeros.map((n) => ({ numero: n, buyer_id: data.id }));
    const { error: insErr } = await supabaseAdmin.from("blocked_numbers").insert(rows);
    if (insErr) throw new Error(insErr.message);
    return { ok: true };
  });

export const adminDeleteBuyer = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    AuthSchema.extend({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    if (!checkAdminAuth(data.username, data.password)) throw new Error("Nao autorizado");
    const { error } = await supabaseAdmin.from("buyers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminBlockNumbers = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    AuthSchema.extend({
      numeros: z.array(z.number().int().min(1).max(10000)).min(1).max(2000),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    if (!checkAdminAuth(data.username, data.password)) throw new Error("Nao autorizado");
    const rows = data.numeros.map((n) => ({ numero: n, buyer_id: null }));
    const { error } = await supabaseAdmin
      .from("blocked_numbers")
      .upsert(rows, { onConflict: "numero", ignoreDuplicates: true });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUnblockNumbers = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    AuthSchema.extend({
      numeros: z.array(z.number().int().min(1).max(10000)).min(1).max(2000),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    if (!checkAdminAuth(data.username, data.password)) throw new Error("Nao autorizado");
    // Only unblock numbers without a buyer (manual blocks).
    const { error } = await supabaseAdmin
      .from("blocked_numbers")
      .delete()
      .is("buyer_id", null)
      .in("numero", data.numeros);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListBuyers = createServerFn({ method: "POST" })
  .inputValidator((input) => AuthSchema.parse(input))
  .handler(async ({ data }) => {
    if (!checkAdminAuth(data.username, data.password)) throw new Error("Nao autorizado");
    const { data: rows, error } = await supabaseAdmin
      .from("buyers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10000);
    if (error) throw new Error(error.message);
    return { buyers: rows ?? [] };
  });
