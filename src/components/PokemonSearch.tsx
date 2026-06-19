import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import PokemonRequests from "../services/PokemonRequests";

const TYPE_COLORS: { [key: string]: string } = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
};

export default function PokemonSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [pokemon, setPokemon] = useState<any>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setErrorMsg("");
        setPokemon(null);

        try {
            const result = await PokemonRequests.fetchPokemonData(searchQuery);

            if (result) {
                setPokemon(result);
                setSearchQuery("");
            } else {
                setErrorMsg("Pokémon não encontrado. Verifique o nome ou número.");
            }
            setLoading(false);
        } catch (error) {
            setErrorMsg("Erro ao buscar o Pokémon. Tente novamente.");
            console.error(error);
            setLoading(false);
        }
    };

    const formatId = (id: number) => `#${id.toString().padStart(3, "0")}`;

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <View style={styles.header}>
                <Text style={styles.title}>PokéSearch</Text>
                <Text style={styles.subtitle}>
                    Busque um Pokémon pelo nome ou número
                </Text>
            </View>

            <View style={styles.searchBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: bulbasaur ou 1"
                    placeholderTextColor="#8d8d99"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />

                <Pressable style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>
                        {loading ? "Buscando..." : "Buscar Pokémon"}
                    </Text>
                </Pressable>
            </View>

            {errorMsg ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            ) : null}

            {pokemon && (
                <View style={styles.card}>
                    <View style={styles.idBadge}>
                        <Text style={styles.idBadgeText}>{formatId(pokemon.pokemon_id)}</Text>
                    </View>

                    <Image
                        source={{ uri: pokemon.pokemon_image }}
                        style={styles.pokemonImage}
                    />

                    <Text style={styles.pokemonName}>{pokemon.pokemon_name}</Text>

                    <View style={styles.typesRow}>
                        {pokemon.types.map((type: string) => (
                            <View
                                key={type}
                                style={[
                                    styles.typeBadge,
                                    { backgroundColor: TYPE_COLORS[type] || "#777" },
                                ]}
                            >
                                <Text style={styles.typeBadgeText}>{type}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.descriptionLabel}>Descrição</Text>
                    <Text style={styles.descriptionText}>
                        {pokemon.description || "Nenhuma descrição encontrada."}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e9cfe6",
        paddingHorizontal: 20,
    },

    header: {
        marginTop: 12,
        marginBottom: 24,
    },

    title: {
        fontSize: 34,
        fontWeight: "900",
        color: "#188396",
    },

    subtitle: {
        fontSize: 15,
        color: "#000000",
        marginTop: 6,
    },

    searchBox: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12,
    },

    input: {
        flex: 1,
        backgroundColor: "#d99ddb",
        color: "#121214",
        fontSize: 16,
        borderRadius: 16,
        paddingHorizontal: 18,
        paddingVertical: 15,

        shadowColor: "#000",
        shadowOffset: {
         width: 0,
         height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    searchButton: {
        backgroundColor: "#f084e1",
        borderRadius: 16,
        paddingHorizontal: 22,
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#a03692",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },

    searchButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 15,
    },

    errorBox: {
        backgroundColor: "#972323",
        borderRadius: 12,
        padding: 14,
        marginTop: 4,
        borderWidth: 1,
        borderColor: "#F3B7B7",
    },

    errorText: {
        color: "#d13fbe",
        fontSize: 14,
        textAlign: "center",
    },

    card: {
        backgroundColor: "#ecebeb",
        borderRadius: 24,
        padding: 24,
        marginTop: 20,
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },

    idBadge: {
        alignSelf: "flex-end",
        backgroundColor: "#EEF1F7",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    idBadgeText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#74809A",
    },

    imageContainer: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: "#F3F5FA",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },

    pokemonImage: {
        width: 170,
        height: 170,
    },

    pokemonName: {
        fontSize: 30,
        fontWeight: "900",
        color: "#222",
        textTransform: "capitalize",
        marginTop: 8,
    },

    typesRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 12,
    },

    typeBadge: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 7,
    },

    typeBadgeText: {
        color: "#0e0a0a",
        fontWeight: "700",
        fontSize: 13,
        textTransform: "capitalize",
    },

    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#EAEAEA",
        marginVertical: 18,
    },

    descriptionLabel: {
        alignSelf: "flex-start",
        fontSize: 13,
        fontWeight: "700",
        color: "#d3d0d0",
        textTransform: "uppercase",
        marginBottom: 8,
    },

    descriptionBox: {
        width: "100%",
        backgroundColor: "#667edf",
        borderRadius: 14,
        padding: 14,
    },

    descriptionText: {
        fontSize: 15,
        color: "#4A4A4A",
        lineHeight: 24,
    },
});