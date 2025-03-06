import { View, ViewProps, StyleSheet, ImageSourcePropType, Image } from "react-native";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";

type Props = ViewProps & {
    image?: ImageSourcePropType,
    title?: string,
    description?: string,
}

export function PokemonSpec ({style, image, title, description, ...rest}: Props) {
    return <View style={[style, styles.root]} {...rest}>
        <Row style={styles.row}>
            {image && <Image source={image} width={16} height={16}/>}
            <ThemedText>{title}</ThemedText>
        </Row>
        <ThemedText variant="caption" color="grayMedium">{description}</ThemedText>
    </View>
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        gap: 4,
        alignItems: "center",
    },
    row:{
        height: 32,
        alignItems: "center",
    }
})