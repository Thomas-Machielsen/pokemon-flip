"use server";

import { fetchGen1Pokemon } from "../services/pokemon";

export async function getGen1Pokemon() {
  try {
    const pokemon = await fetchGen1Pokemon();
    return pokemon;
  } catch (error) {
    console.error("Error fetching Gen 1 Pokemon:", error);
    return [];
  }
}
