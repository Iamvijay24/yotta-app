import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const BAR_COUNT = 5;

const LoadSpinner = ({ size = 'large', color = '#7a8fa6' }) => {
  const isLarge = size === 'large';
  const barHeight = isLarge ? 40 : 24;
  const barWidth = isLarge ? 6 : 4;
  const gap = isLarge ? 5 : 4;

  return (
    <View style={styles.container}>
      <View style={[styles.barsWrapper, { height: barHeight, gap }]}>
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <BouncingBar
            key={i}
            index={i}
            color={color}
            barWidth={barWidth}
            maxHeight={barHeight}
          />
        ))}
      </View>
    </View>
  );
};

const BouncingBar = ({ index, color, barWidth, maxHeight }) => {
  const [height, setHeight] = React.useState(maxHeight * 0.3);

  React.useEffect(() => {
    const delay = index * 200;  // wider stagger gap
    const period = 1600;        // slow wave: 1.6s per cycle
    let frame;

    const animate = () => {
      const elapsed = (Date.now() - start + delay) % period;
      const t = elapsed / period;
      const sine = Math.sin(t * Math.PI * 2 - Math.PI / 2);
      const normalized = (sine + 1) / 2;
      const minH = maxHeight * 0.25;
      setHeight(minH + normalized * (maxHeight - minH));
      frame = requestAnimationFrame(animate);
    };

    const start = Date.now();
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [index, maxHeight]);

  return (
    <View
      style={{
        width: barWidth,
        height,
        backgroundColor: color,
        borderRadius: barWidth / 2,
        alignSelf: 'flex-end',
        opacity: 0.75,
      }}
    />
  );
};

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
});

export default LoadSpinner;