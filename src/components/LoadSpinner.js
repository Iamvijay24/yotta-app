import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// ─── Constants ────────────────────────────────────────────────────────────────

const BAR_COUNT = 5;
const ANIMATION_PERIOD = 1600;
const STAGGER_DELAY = 200;
const MIN_HEIGHT_RATIO = 0.25;
const INITIAL_HEIGHT_RATIO = 0.3;
const BAR_OPACITY = 0.85;

const BAR_COLORS = [
  '#F2A8C4', // soft pink
  '#A8C4F2', // soft blue
  '#A8F2C4', // soft mint
  '#F2D9A8', // soft peach
  '#C4A8F2', // soft lavender
];

// ─── Config ───────────────────────────────────────────────────────────────────

const SIZE_CONFIG = {
  large: { barHeight: 40, barWidth: 6, gap: 5 },
  small: { barHeight: 24, barWidth: 4, gap: 4 },
};

// ─── BouncingBar ──────────────────────────────────────────────────────────────

const BouncingBar = ({ index, barWidth, maxHeight }) => {
  const [height, setHeight] = React.useState(maxHeight * INITIAL_HEIGHT_RATIO);

  React.useEffect(() => {
    const delay = index * STAGGER_DELAY;
    const minH = maxHeight * MIN_HEIGHT_RATIO;
    const range = maxHeight - minH;
    const start = Date.now();
    let frame;

    const animate = () => {
      const elapsed = (Date.now() - start + delay) % ANIMATION_PERIOD;
      const t = elapsed / ANIMATION_PERIOD;
      const sine = Math.sin(t * Math.PI * 2 - Math.PI / 2);
      const normalized = (sine + 1) / 2;
      setHeight(minH + normalized * range);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [index, maxHeight]);

  return (
    <View
      style={[
        styles.bar,
        {
          width: barWidth,
          height,
          backgroundColor: BAR_COLORS[index],
          borderRadius: barWidth / 2,
        },
      ]}
    />
  );
};

// ─── LoadSpinner ──────────────────────────────────────────────────────────────

const LoadSpinner = ({ size = 'large' }) => {
  const { barHeight, barWidth, gap } = SIZE_CONFIG[size] ?? SIZE_CONFIG.large;

  return (
    <View style={styles.container}>
      <View style={[styles.barsWrapper, { height: barHeight, gap }]}>
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <BouncingBar
            key={i}
            index={i}
            barWidth={barWidth}
            maxHeight={barHeight}
          />
        ))}
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bar: {
    alignSelf: 'flex-end',
    opacity: BAR_OPACITY,
  },
});

export default LoadSpinner;