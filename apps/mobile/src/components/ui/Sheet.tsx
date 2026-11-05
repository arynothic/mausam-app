import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { ScreenTitle } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Lightweight bottom sheet (Modal). Replace with gorhom if we need drag-to-dismiss. */
export function Sheet({ visible, onClose, title, children }: Props) {
  const theme = useTheme();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close sheet" />
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: theme.radii.xxl,
            borderTopRightRadius: theme.radii.xxl,
            padding: theme.spacing[5],
            paddingBottom: theme.spacing[8],
          },
        ]}
      >
        {title ? <ScreenTitle style={{ marginBottom: theme.spacing[3] }}>{title}</ScreenTitle> : null}
        {children}
        <View style={{ marginTop: theme.spacing[4] }}>
          <Button label="Close" variant="secondary" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: { maxHeight: "80%" },
});
