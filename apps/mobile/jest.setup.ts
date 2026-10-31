// Reanimated 4 needs the native worklets runtime, and its shipped mock still loads native-only
// internals in Jest. Minimal stand-in for the APIs we use: animations resolve to their end value.
jest.mock("react-native-reanimated", () => {
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  const passthrough = <T>(v: T) => v;
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: passthrough },
    createAnimatedComponent: passthrough,
    useSharedValue: <T>(value: T) => ({ value }),
    useAnimatedStyle: <T>(fn: () => T) => fn(),
    withTiming: passthrough,
    withDelay: (_ms: number, v: unknown) => v,
    withRepeat: passthrough,
    withSequence: (...steps: unknown[]) => steps[0],
    cancelAnimation: () => undefined,
    // Layout animations: builders whose modifiers return themselves.
    FadeInDown: { duration: () => ({}) },
    FadeOutDown: { duration: () => ({}) },
  };
});
