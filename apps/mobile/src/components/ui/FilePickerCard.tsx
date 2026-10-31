import { CloudUpload } from "lucide-react-native";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

export type FilePickerState = "idle" | "picking" | "uploading" | "error";

export type FilePickerCardProps = {
  /** Accepted types in words, e.g. "PDF or DOCX". */
  accept: string;
  maxMb: number;
  state?: FilePickerState;
  onPress: () => void;
  /** Error text in the error state, or a reason when disabled (e.g. offline). */
  message?: string;
  disabled?: boolean;
  /** Shown while uploading. */
  uploadingLabel?: string;
};

export function FilePickerCard({
  accept,
  maxMb,
  state = "idle",
  onPress,
  message,
  disabled = false,
  uploadingLabel = "Reading your CV…",
}: FilePickerCardProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const busy = state === "picking" || state === "uploading";
  const inactive = disabled || busy;
  const hint = `${accept} · Max ${maxMb} MB`;
  const fg = inactive ? theme.color.textSecondary : theme.color.textPrimary;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onPress}
        disabled={inactive}
        accessibilityRole="button"
        accessibilityLabel={`Choose a file. ${hint}`}
        accessibilityState={{ disabled: inactive, busy }}
        style={({ pressed }) => [
          styles.area,
          state === "error" && styles.areaError,
          disabled && styles.areaDisabled,
          pressed && styles.pressed,
        ]}
      >
        {busy ? (
          <ActivityIndicator color={theme.color.accent} />
        ) : (
          <CloudUpload size={theme.size.icon} color={fg} />
        )}
        <Text style={[styles.label, { color: fg }]}>
          {state === "uploading" ? uploadingLabel : "Choose a file"}
        </Text>
        <Text style={styles.hint}>{hint}</Text>
      </Pressable>
      {message && (
        <Text
          style={[styles.message, state === "error" && styles.messageError]}
          accessibilityLiveRegion="polite"
        >
          {message}
        </Text>
      )}
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: { gap: t.space[2] },
    area: {
      alignItems: "center",
      justifyContent: "center",
      gap: t.space[2],
      paddingVertical: t.space[8],
      paddingHorizontal: t.space[4],
      borderRadius: t.radius.md,
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderStyle: "dashed",
      borderColor: t.color.borderStrong,
      backgroundColor: t.color.surfaceSunken,
    },
    areaError: { borderColor: t.color.verdictLow },
    areaDisabled: { borderColor: t.color.border },
    label: t.text.bodyStrong,
    hint: { ...t.text.small, color: t.color.textSecondary, textAlign: "center" },
    message: { ...t.text.small, color: t.color.textSecondary },
    messageError: { color: t.color.verdictLow },
    pressed: { opacity: t.motion.pressedOpacity },
  });
