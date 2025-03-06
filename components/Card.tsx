import { Shadows } from "@/constants/Shadows";
import { View, ViewProps, ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = ViewProps;

export function Card({style, ...rest}: Props) {
    const colors = useThemeColors();
    return <View style={[styles, {backgroundColor: colors.grayBackground}, style]} {...rest} />
}

const styles = {
    borderRadius: 8,
    overflow: 'hidden',
    ...Shadows.dp2
} satisfies ViewStyle;