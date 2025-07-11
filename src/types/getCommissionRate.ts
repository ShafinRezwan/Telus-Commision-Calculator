import { supabase } from "./supaBaseClient";

export async function getCommissionRateByName(name: string): Promise<number> {
  const { data, error } = await supabase
    .from("commissionrate")
    .select()
    .eq("display_name", name)
    .single();

  if (error) {
    console.error(`Error fetching rate for ${name}:`, error.message);
    return 0;
  }
  //console.log(data)
  return data?.rate ?? 0;
}