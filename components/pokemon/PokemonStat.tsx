import { StyleSheet, View, ViewProps } from "react-native";
import { Row } from '@/components/Row';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColors } from "@/hooks/useThemeColors";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useEffect } from "react";


type Props = ViewProps & {
    name: string,
    value: number,
    color: string,
}

function statShortName(name: string) {
    return name
        .replaceAll("special", "S")
        .replaceAll("attack", "ATK")
        .replaceAll("defense", "DEF")
        .replaceAll("speed", "SPD")
        .replaceAll("-", " ")
        .toUpperCase();
}

export function PokemonStat ({style, name, value, color, ...rest}: Props) {
    const colors = useThemeColors();
    const sharedValue = useSharedValue(0);
    const barInnerStyle = useAnimatedStyle(() => {
        return {
            flex: sharedValue.value,
        }
    })
    const barBackgroundStyle = useAnimatedStyle(() => {
        return {
            flex: 255 - sharedValue.value,
        }
    })

    useEffect(() => {
        sharedValue.value = withSpring(value);
    }, [value])

    return (
    <Row style={[style, styles.root]} {...rest}>
        <View style={[styles.view, {borderColor: colors.grayLight}]}>
            <ThemedText style={{color: color}} variant="subtitle3">{statShortName(name)}</ThemedText>
        </View>
        <View style={styles.number}>
            <ThemedText>{value.toString().padStart(3, "0")}</ThemedText>
        </View>
        <Row style={styles.bar}>
            <Animated.View style={[styles.barInner, {backgroundColor: color}, barInnerStyle]}/>
            <Animated.View style={[styles.barBackground, {backgroundColor: color}, barBackgroundStyle]}/>
        </Row>
    </Row>
    );
}

const styles = StyleSheet.create({
    root: {},
    view: {
        width: 40,
        paddingRight: 8,
        borderRightWidth: 1,
        borderStyle: "solid",
    },
    number: {
        width: 30,
        marginLeft: 10,
    },
    bar: {
        flex: 1,
        height: 4,
        borderRadius: 20,
        overflow: "hidden",
    },
    barInner: {
        height: 4,
    },
    barBackground: {
        height: 4,
        opacity: 0.24,
    }
})