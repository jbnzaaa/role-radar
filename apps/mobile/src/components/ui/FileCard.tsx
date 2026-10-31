import { FileText, Pencil } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

import { IconButton } from "./IconButton";

export type FileCardProps = {
  name: string;
  type: "pdf" | "docx";
  /** Known for PDFs; usually unknown for DOCX. */
  pages?: number;
  onReplace: () => void;
};

const TYPE_LABEL = { pdf: "PDF Document", docx: "Word Document" } as const;

export function FileCard({ name, type, pages, onReplace }: FileCardProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const meta = [TYPE_LABEL[type], pages ? `${pages} ${pages === 1 ? "page" : "pages"}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <View style={styles.card}>
      <View style={styles.info} accessible accessibilityLabel={`${name}, ${meta}`}>
        <FileText size={theme.size.icon} color={theme.color.textSecondary} />
        <View style={styles.text}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.meta}>{meta}</Text>
        </View>
      </View>
      <IconButton
        icon={Pencil}
        variant="plain"
        accessibilityLabel="Replace file"
        onPress={onReplace}
      />
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.space[3],
      padding: t.space[3],
      borderRadius: t.radius.md,
      backgroundColor: t.color.surfaceSunken,
    },
    info: { flex: 1, flexDirection: "row", alignItems: "center", gap: t.space[3] },
    text: { flex: 1, gap: t.space[1] },
    name: { ...t.text.bodyStrong, color: t.color.textPrimary },
    meta: { ...t.text.small, color: t.color.textSecondary },
  });
