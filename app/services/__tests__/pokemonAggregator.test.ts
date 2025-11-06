import fs, { Dirent } from "fs";
import { fetchAggregatedPokemon } from "../pokemonAggregator";

// Mock fs module
jest.mock("fs", () => ({
  readdirSync: jest.fn(),
}));

// Mock path module
jest.mock("path", () => ({
  join: jest.fn((_, ...args) => args.join("/")),
}));

// Mock the API modules
jest.mock("../(pokeapi)/pokemon", () => ({
  fetchGen1Pokemon: jest.fn(),
}));

jest.mock("../(pokemontcg)/pokemontcg", () => ({
  fetchBaseSetPokemon: jest.fn(),
}));

// Helper function to create mock Dirent objects
function createMockDirent(name: string): Dirent {
  return {
    name,
    isFile: () => true,
    isDirectory: () => false,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isSymbolicLink: () => false,
    isFIFO: () => false,
    isSocket: () => false,
  } as Dirent;
}

// Import and type the mocked functions
const mockFs = fs as jest.Mocked<typeof fs>;
const fetchGen1Pokemon = jest.fn();
const fetchBaseSetPokemon = jest.fn();

describe("Pokemon Aggregator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return data when PokeAPI fails but TCG succeeds", async () => {
    // Mock PokeAPI to fail
    fetchGen1Pokemon.mockRejectedValue(new Error("PokeAPI failed"));

    // Mock TCG API to succeed
    fetchBaseSetPokemon.mockResolvedValue([
      {
        id: "base1-1",
        name: "pikachu",
        hp: "60",
        types: ["Lightning"],
        images: { large: "https://tcg/pikachu.png" },
      },
    ]);

    const result = await fetchAggregatedPokemon();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      tcgId: "base1-1",
      name: "pikachu",
      artwork: "https://tcg/pikachu.png",
    });
  });

  xit("should return data when TCG fails but PokeAPI succeeds", async () => {
    // Mock PokeAPI to succeed
    fetchGen1Pokemon.mockResolvedValue([
      {
        id: 25,
        name: "pikachu",
        type: "electric",
        artwork: "https://pokeapi.co/pikachu.png",
      },
    ]);

    // Mock TCG API to fail
    fetchBaseSetPokemon.mockRejectedValue(new Error("TCG API failed"));

    // Mock file system to return no images
    mockFs.readdirSync.mockReturnValue([]);

    const result = await fetchAggregatedPokemon();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 25,
      name: "pikachu",
      type: "electric",
      artwork: "https://pokeapi.co/pikachu.png",
    });
  });

  xit("should return image-based data when both APIs fail", async () => {
    // Mock both APIs to fail
    fetchGen1Pokemon.mockRejectedValue(new Error("PokeAPI failed"));
    fetchBaseSetPokemon.mockRejectedValue(new Error("TCG API failed"));

    // Mock file system to return some images
    mockFs.readdirSync.mockReturnValue([
      createMockDirent("pikachu.png"),
      createMockDirent("charizard.png"),
    ]);

    const result = await fetchAggregatedPokemon();

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      name: "pikachu",
      artwork: "/images/pikachu.png",
    });
  });

  xit("should handle file system errors gracefully", async () => {
    // Mock both APIs to fail
    fetchGen1Pokemon.mockRejectedValue(new Error("PokeAPI failed"));
    fetchBaseSetPokemon.mockRejectedValue(new Error("TCG API failed"));

    // Mock file system to throw an error
    mockFs.readdirSync.mockImplementation(() => {
      throw new Error("File system error");
    });

    const result = await fetchAggregatedPokemon();

    expect(result).toHaveLength(0);
  });
});
