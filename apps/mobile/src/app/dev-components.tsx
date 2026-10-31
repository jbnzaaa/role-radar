// Dev-only catalogue of every ui/ primitive and its states, for checking on a real phone
// (TASKS.md P1-10 / P1-06). Redirects home in production builds.
import { Redirect } from "expo-router";
import {
  CircleCheck,
  CircleUser,
  FileText,
  History,
  House,
  Lightbulb,
  type LucideIcon,
  Pencil,
  Sparkles,
  WifiOff,
} from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/ui/Avatar";
import { Banner } from "@/components/ui/Banner";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckList } from "@/components/ui/CheckList";
import { Chip } from "@/components/ui/Chip";
import { DotMatrixLoader } from "@/components/ui/DotMatrixLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileCard } from "@/components/ui/FileCard";
import { FilePickerCard } from "@/components/ui/FilePickerCard";
import { Gauge } from "@/components/ui/Gauge";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";
import { HomeHeader } from "@/components/ui/HomeHeader";
import { IconButton } from "@/components/ui/IconButton";
import { AnalysisRow, HistoryRow, MatchRow } from "@/components/ui/JobRows";
import { KeyValueRow } from "@/components/ui/KeyValueRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { RequirementRow } from "@/components/ui/RequirementRow";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { SearchField } from "@/components/ui/SearchField";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { LegendRow, StackedBar } from "@/components/ui/StackedBar";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPicker } from "@/components/ui/StatusPicker";
import { TabBar } from "@/components/ui/TabBar";
import { TextArea } from "@/components/ui/TextArea";
import { Toast } from "@/components/ui/Toast";
import type { Tone } from "@/components/ui/tone";
import { VersionRow } from "@/components/ui/VersionRow";
import { type Theme, useThemedStyles } from "@/theme";

const noop = () => undefined;
const TONES: Tone[] = ["neutral", "strong", "good", "partial", "low", "met", "missing", "accent"];
// Sample labels for the catalogue only; real labels come from core labels.ts (P2-05).
const STATUSES = [
  { value: "not_applied", label: "Not applied" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];
const job = {
  title: "Product Designer",
  subtitle: "Acme Studio · 30 Oct",
  score: 71,
  verdict: { label: "Good match", tone: "good" as const },
  onPress: noop,
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function DevComponentsScreen() {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [jobText, setJobText] = useState("");
  const [status, setStatus] = useState("not_applied");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  if (!__DEV__) return <Redirect href="/" />;

  const tab = (key: string, label: string, icon: LucideIcon) => ({
    key,
    label,
    icon,
    active: activeTab === key,
    onPress: () => setActiveTab(key),
  });

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top }]}>
        <PageHeader
          title="Components"
          description="Dev only. Every ui/ primitive and state."
          onBack={noop}
        />

        <Section title="Chip">
          <View style={styles.wrap}>
            {TONES.map((t) => (
              <Chip key={t} label={t} tone={t} />
            ))}
          </View>
        </Section>

        <Section title="IconButton">
          <View style={styles.wrap}>
            <IconButton icon={Pencil} accessibilityLabel="Edit" onPress={noop} />
            <IconButton
              icon={Pencil}
              accessibilityLabel="Edit plain"
              variant="plain"
              onPress={noop}
            />
            <IconButton icon={Pencil} accessibilityLabel="Edit disabled" disabled onPress={noop} />
          </View>
        </Section>

        <Section title="Button">
          <Button label="Primary lg" icon={Sparkles} fullWidth onPress={noop} />
          <Button label="Secondary" variant="secondary" fullWidth onPress={noop} />
          <Button label="Ghost" variant="ghost" onPress={noop} />
          <View style={styles.wrap}>
            <Button label="md" size="md" onPress={noop} />
            <Button label="Loading" size="md" loading onPress={noop} />
            <Button label="Disabled" size="md" disabled onPress={noop} />
          </View>
          <GoogleSignInButton onPress={noop} />
          <GoogleSignInButton onPress={noop} loading />
        </Section>

        <Section title="Headers and avatars">
          <HomeHeader name="Jay" subtitle="Ready to find your next role?" />
          <ProfileCard
            name="Jay Beniza"
            email="jay@example.com"
            headline="UI/UX Designer"
            location="Metro Manila"
            onEdit={noop}
          />
          <View style={styles.wrap}>
            <Avatar name="Jay Beniza" />
            <Avatar name="Jay Beniza" size="lg" />
            <Avatar name="Broken Photo" uri="https://invalid.example/x.jpg" />
          </View>
        </Section>

        <Section title="Card, KeyValueRow, StatTile">
          <Card title="Active CV" description="The resume used for new analyses.">
            <KeyValueRow label="File name" value="jay-cv-october.pdf" />
            <KeyValueRow label="Jobs analyzed" value="12" />
          </Card>
          <Card title="Pressable card" onPress={noop} />
          <View style={styles.row}>
            <StatTile value="12" label="Analyses" />
            <StatTile value="71%" label="Average" />
            <StatTile value="3" label="Applied" />
          </View>
        </Section>

        <Section title="Gauge">
          <Card>
            <Gauge value={71} label="Good match" accessibilityName="Average match score" />
          </Card>
          <Card>
            <Gauge value={35} label="Low match" size="md" accessibilityName="Score" />
          </Card>
          <Card>
            <Gauge
              value={null}
              label="No analyses this week yet"
              size="md"
              accessibilityName="Score"
            />
          </Card>
        </Section>

        <Section title="ScoreBar, StackedBar, LegendRow">
          <ScoreBar value={92} tone="strong" accessibilityLabel="Strong" />
          <ScoreBar value={71} tone="good" accessibilityLabel="Good" />
          <ScoreBar value={50} tone="partial" accessibilityLabel="Partial" />
          <ScoreBar value={20} tone="low" accessibilityLabel="Low" />
          <StackedBar
            segments={[
              { label: "Strong match", count: 2, tone: "strong" },
              { label: "Good match", count: 3, tone: "good" },
              { label: "Partial match", count: 4, tone: "partial" },
              { label: "Low match", count: 1, tone: "low" },
            ]}
          />
          <LegendRow label="Strong match" value={2} tone="strong" />
          <LegendRow label="Low match" value={1} tone="low" />
        </Section>

        <Section title="Job rows">
          <Card>
            <AnalysisRow {...job} status={{ label: "Saved", tone: "neutral" }} />
            <HistoryRow
              {...job}
              title="Senior UX Researcher with a very long job title that wraps"
              status={{ label: "Interviewing", tone: "accent" }}
              cvName="Design CV v2"
            />
            <MatchRow
              {...job}
              skills={["Figma", "Prototyping", "User research", "SQL"]}
              onMarkApplied={noop}
            />
          </Card>
        </Section>

        <Section title="RequirementRow, CheckList">
          <Card>
            <RequirementRow
              title="3+ years in product design"
              evidence="CV shows 3.5 years across two studios."
              status="met"
              importance="must-have"
            />
            <RequirementRow
              title="Design systems"
              evidence="Mentioned once, no detail."
              status="partial"
              importance="must-have"
            />
            <RequirementRow
              title="Motion design"
              evidence="Not in CV."
              status="missing"
              importance="nice-to-have"
            />
          </Card>
          <CheckList
            icon={CircleCheck}
            tone="met"
            items={["Strong Figma skills", "Shipped a design system"]}
          />
          <CheckList
            icon={Lightbulb}
            items={["Lead with your design system work in the summary."]}
          />
        </Section>

        <Section title="Inputs">
          <SearchField value={search} onChangeText={setSearch} placeholder="Search jobs" />
          <TextArea
            label="Job description"
            value={jobText}
            onChangeText={setJobText}
            max={200}
            placeholder="Paste the full job description here"
            action={{ label: "Paste", onPress: () => setJobText("Pasted text ".repeat(20)) }}
          />
          <TextArea label="Disabled" value="Read only" onChangeText={noop} max={100} disabled />
          <TextArea
            label="With error"
            value=""
            onChangeText={noop}
            max={100}
            error="Paste at least 200 characters."
          />
          <StatusPicker
            title="Application status"
            value={status}
            options={STATUSES}
            onChange={setStatus}
          />
        </Section>

        <Section title="Files, versions, settings">
          <FilePickerCard accept="PDF or DOCX" maxMb={4} onPress={noop} />
          <FilePickerCard accept="PDF or DOCX" maxMb={4} state="uploading" onPress={noop} />
          <FilePickerCard
            accept="PDF or DOCX"
            maxMb={4}
            state="error"
            message="We couldn't read text from this file. Paste your CV text instead."
            onPress={noop}
          />
          <FilePickerCard
            accept="PDF or DOCX"
            maxMb={4}
            disabled
            message="You're offline. You can still paste your CV text."
            onPress={noop}
          />
          <FileCard name="jay-cv-october.pdf" type="pdf" pages={2} onReplace={noop} />
          <Card>
            <VersionRow name="CV – October 2026" active savedAt="30 Oct 2026" onPress={noop} />
            <VersionRow
              name="CV – September 2026"
              active={false}
              savedAt="2 Sep 2026"
              onPress={noop}
            />
          </Card>
          <Card>
            <SettingsRow
              title="Privacy & data"
              description="Last backup: 30 Oct 2026"
              trailing="chevron"
              onPress={noop}
            />
            <SettingsRow title="App version" trailing={{ value: "1.0.0" }} />
          </Card>
        </Section>

        <Section title="Feedback">
          <Banner message="Analyses use your active CV." />
          <Banner
            tone="warning"
            icon={WifiOff}
            message="You're offline. Analyses need a connection."
          />
          <Card>
            <DotMatrixLoader />
          </Card>
          <EmptyState
            title="No analyses yet"
            body="Paste a job description to see how well your CV matches."
            action={{ label: "Analyze a job", onPress: noop }}
          />
          <Button
            label="Open bottom sheet"
            variant="secondary"
            onPress={() => setSheetOpen(true)}
          />
          <Button
            label={toast ? "Hide toast" : "Show toast"}
            variant="secondary"
            onPress={() => setToast((v) => !v)}
          />
          {toast && <Toast message="Status updated" />}
        </Section>
      </ScrollView>

      <TabBar
        tabs={[
          tab("home", "Home", House),
          tab("cv", "CV", FileText),
          tab("history", "History", History),
          tab("profile", "Profile", CircleUser),
        ]}
        onAddPress={noop}
        addLabel="Analyze a job"
      />

      <BottomSheet title="Bottom sheet" visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Text style={styles.sheetText}>Sheet content. Tap outside or use back to close.</Text>
        <Button label="Close" onPress={() => setSheetOpen(false)} fullWidth />
      </BottomSheet>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: t.color.bgPage },
    content: {
      paddingHorizontal: t.layout.screenPadding,
      paddingBottom: t.space[12],
      gap: t.space[8],
    },
    section: { gap: t.layout.cardGap },
    sectionTitle: { ...t.text.title, color: t.color.textSecondary },
    wrap: { flexDirection: "row", flexWrap: "wrap", gap: t.space[2], alignItems: "center" },
    row: { flexDirection: "row", gap: t.layout.cardGap },
    sheetText: { ...t.text.body, color: t.color.textPrimary },
  });
