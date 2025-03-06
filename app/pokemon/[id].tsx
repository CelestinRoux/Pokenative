import { RootView } from "@/components/RootView";
import { router, useLocalSearchParams } from "expo-router";
import { Text, StyleSheet, Image, Pressable, View } from "react-native";
import { Row } from '@/components/Row';
import { ThemedText } from "@/components/ThemedText";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { Colors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatWeight, formatHeight, getPokemonArtwork, basePokemonStats } from '@/functions/pokemon';
import { Card } from '@/components/Card';
import { PokemonType } from '@/components/pokemon/PokemonType';
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import {Audio} from 'expo-av';

export default function Pokemon() {
    const colors = useThemeColors();
    const params = useLocalSearchParams() as {id: string};
    const {data:pokemon} = useFetchQuery("/pokemon/[id]", {id: params.id});
    const id = parseInt(params.id);
    const {data:species} = useFetchQuery("/pokemon-species/[id]", {id: params.id});
    const mainType = pokemon?.types?.[0].type.name;
    const colorType = mainType ? Colors.type[mainType]: colors.tint;
    const types = pokemon?.types ?? [];
    const bio = species?.flavor_text_entries.find(e => e.language.name === "en")?.flavor_text.replaceAll("\n", ". ");
    const stats = pokemon?.stats ?? basePokemonStats;

    const onImagePress = async () => {
        const cry = pokemon?.cries.latest
        if (!cry) {
            return;
        }
        const {sound} = await Audio.Sound.createAsync({uri: cry}, {shouldPlay: true});
        sound.playAsync();
    };
    
    const onPrevious = () => {
        if (id == 10001){
            router.replace({pathname: '/pokemon/[id]', params: {id: Math.max(id - 8976, 1)}});
        }else{
            router.replace({pathname: '/pokemon/[id]', params: {id: Math.max(id - 1, 1)}});
        }
    }

    const onNext = () => {
        if (id == 1025){
            router.replace({pathname: '/pokemon/[id]', params: {id: Math.min(id + 8976, 10279)}});
        }else{
            router.replace({pathname: '/pokemon/[id]', params: {id: Math.min(id + 1, 10279)}});
        }
    }

    return (
    <RootView backgroundColor={colorType}>
        <View>
            <Image style={styles.pokeball} source={require('@/assets/images/pokeball_big.png')} width={208} height={208}/>
            <Row style={styles.header}>
                <Pressable onPress={router.back}>
                    <Row gap={8}>
                        <Image source={require('@/assets/images/back.png')} width={32} height={32}/>
                        <ThemedText color="grayWhite" variant="headline" style={{textTransform: "capitalize"}}>{pokemon?.name}</ThemedText>
                    </Row>  
                </Pressable>
                <ThemedText color="grayWhite" variant="subtitle2">#{params.id.padStart(3, "0")}</ThemedText>
            </Row>
            <Card style={[styles.card, {overflow: 'visible'}]}>
                <Row style={styles.imageRow}>
                    {id === 1 ? <View style={{width: 24, height: 24}} /> : <Pressable onPress={onPrevious}>
                        <Image source={require("@/assets/images/prev.png")} width={24} height={24} />
                    </Pressable>}  
                    <Pressable onPress={onImagePress}>
                        <Image 
                            style={styles.artwork}
                            source={{uri: getPokemonArtwork(params.id)}}
                            width={200}
                            height={200}
                        />
                    </Pressable>                  
                    {id === 10279 ? <View style={{width: 24, height: 24}} /> : <Pressable onPress={onNext}>
                        <Image source={require("@/assets/images/next.png")} width={24} height={24} />
                    </Pressable>}
                </Row>

                <Row gap={16} style={{height: 20}}>
                    {types.map(t => <PokemonType name={t.type.name} key={t.type.name} />)}
                </Row>

                {/* Stats */}
                <ThemedText style={{color: colorType}} variant="subtitle1">About</ThemedText>
                <Row>
                    <PokemonSpec style={{borderStyle: "solid", borderRightWidth: 1, borderColor: colors.grayLight}} title={formatWeight(pokemon?.weight)} description="Wheight" image={require("@/assets/images/weight.png")}/>
                    <PokemonSpec style={{borderStyle: "solid", borderRightWidth: 1, borderColor: colors.grayLight}} title={formatHeight(pokemon?.height)} description="Height" image={require("@/assets/images/height.png")}/>
                    <PokemonSpec title={pokemon?.moves.slice(0,2).map(m => m.move.name).join("\n")} description="Moves"/>
                </Row>
                <ThemedText>{bio}</ThemedText>
                
                {/* Stats */}
                <ThemedText style={{color: colorType}} variant="subtitle1">Base stats</ThemedText>
                <View style={{alignSelf: 'stretch'}}>
                    {stats.map(s => <PokemonStat key={s.stat.name} name={s.stat.name} value={s.base_stat} color={colorType}/>)}
                </View>
            </Card>
            </View>
    </RootView>
    )
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        justifyContent: 'space-between',
    },
    pokeball: {
        position: 'absolute',
        right: 8,
        top: 9,
    },
    imageRow: {
        position: 'absolute',
        top: -140,
        zIndex: 2,
        justifyContent: 'space-between',
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    artwork: {},
    card: {
        marginTop: 144,
        paddingHorizontal: 20,
        paddingTop: 70,
        paddingBottom: 20,
        gap: 16,
        alignItems: 'center',
    },
})