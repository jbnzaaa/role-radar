import { Pencil } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { type Theme, useThemedStyles } from "@/theme";

import { Avatar } from "./Avatar";
import { IconButton } from "./IconButton";

export type ProfileCardProps = {
  name: string;
  email: string;
  headline?: string;
  location?: string;
  avatarUri?: string;
  /** Opens /profile-edit. */
  onEdit: () => void;
};

export function ProfileCard({
  name,
  email,
  headline,
  location,
  avatarUri,
  onEdit,
}: ProfileCardProps) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Avatar name={name} uri={avatarUri} size="lg" />
        <View style={styles.identity}>
          <Text style={styles.name} accessibilityRole="header">
            {name}
          </Text>
          <Text style={styles.meta}>{email}</Text>
          <Text style={styles.meta}>Signed in with Google</Text>
        </View>
        <IconButton
          icon={Pencil}
          variant="plain"
          accessibilityLabel="Edit profile"
          onPress={onEdit}
        />
      </View>
      {(headline || location) && (
        <View style={styles.details}>
          {headline && <Text style={styles.headline}>{headline}</Text>}
          {location && <Text style={styles.meta}>{location}</Text>}
        </View>
      )}
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.color.surfaceCard,
      borderRadius: t.radius.lg,
      padding: t.layout.cardPadding,
      gap: t.space[3],
    },
    top: { flexDirection: "row", alignItems: "center", gap: t.space[3] },
    identity: { flex: 1, gap: t.space[1] },
    name: { ...t.text.title, color: t.color.textPrimary },
    meta: { ...t.text.small, color: t.color.textSecondary },
    details: { gap: t.space[1] },
    headline: { ...t.text.body, color: t.color.textPrimary },
  });
