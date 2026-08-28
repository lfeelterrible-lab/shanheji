import { MapPin } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

import { useAppTheme, typography } from '@/components/theme';
import type { MapTarget } from '@/types/geography';

type MapState = 'neutral' | 'correct' | 'wrong';

const zones: Record<MapTarget, { left: `${number}%`; top: `${number}%`; width: `${number}%`; height: `${number}%`; cx: number; cy: number }> = {
  sichuan: { left: '39%', top: '48%', width: '20%', height: '19%', cx: 151, cy: 128 },
  taihang: { left: '59%', top: '34%', width: '15%', height: '43%', cx: 211, cy: 111 },
  daxingan: { left: '68%', top: '10%', width: '20%', height: '47%', cx: 246, cy: 57 },
  'qinghai-tibet': { left: '18%', top: '37%', width: '42%', height: '35%', cx: 111, cy: 123 },
  'heihe-tengchong': { left: '17%', top: '10%', width: '70%', height: '78%', cx: 143, cy: 126 },
};

export function GeographyMapCard({
  target,
  state = 'neutral',
  onSelect,
}: {
  target: MapTarget;
  state?: MapState;
  onSelect: (value: string) => void;
}) {
  const theme = useAppTheme();
  const zone = zones[target];
  const targetColor = state === 'correct' ? theme.success : state === 'wrong' ? theme.danger : theme.accent;

  return (
    <View style={[styles.shell, { backgroundColor: theme.surface, borderColor: theme.line }]}>
      <View style={styles.mapWrap}>
        <Svg viewBox="0 0 320 220" width="100%" height="220">
          <Path
            d="M39 73 L58 48 L91 35 L121 29 L153 35 L179 29 L208 39 L238 48 L271 64 L293 78 L288 98 L302 116 L292 133 L271 143 L255 163 L238 182 L214 188 L195 174 L172 181 L151 172 L133 183 L113 174 L92 177 L79 159 L62 153 L57 133 L42 123 L32 103 Z"
            fill={theme.mapFill}
            stroke={theme.mapLine}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Polyline points="47,100 91,88 134,91 179,83 229,91 278,78" fill="none" stroke={theme.mapLine} strokeWidth="1" strokeDasharray="3 5" />
          <Polyline points="73,143 116,133 159,139 196,130 232,141 270,124" fill="none" stroke={theme.mapLine} strokeWidth="1" strokeDasharray="2 6" />
          <Line x1="203" y1="62" x2="211" y2="154" stroke={theme.mapLine} strokeWidth="1.5" />
          <Line x1="221" y1="58" x2="230" y2="142" stroke={theme.mapLine} strokeWidth="1" />
          {target === 'daxingan' ? <Line x1="247" y1="40" x2="226" y2="112" stroke={targetColor} strokeWidth="4" strokeLinecap="round" /> : null}
          {target === 'taihang' ? <Line x1="207" y1="85" x2="206" y2="151" stroke={targetColor} strokeWidth="4" strokeLinecap="round" /> : null}
          {target === 'heihe-tengchong' ? <Line x1="67" y1="65" x2="249" y2="159" stroke={targetColor} strokeWidth="3" strokeDasharray="7 6" strokeLinecap="round" /> : null}
          <Circle cx={zone.cx} cy={zone.cy} r={state === 'neutral' ? 7 : 10} fill={state === 'neutral' ? theme.accentSoft : targetColor} stroke={targetColor} strokeWidth="2" />
          <Circle cx={zone.cx} cy={zone.cy} r="2.5" fill={state === 'neutral' ? theme.accent : theme.surface} />
        </Svg>

        <Pressable
          accessibilityLabel="中国地图"
          accessibilityRole="imagebutton"
          onPress={() => onSelect('other')}
          style={StyleSheet.absoluteFill}
        />
        <Pressable
          accessibilityLabel="目标位置"
          accessibilityRole="button"
          onPress={() => onSelect(target)}
          style={[styles.targetHit, { left: zone.left, top: zone.top, width: zone.width, height: zone.height }]}
        >
          <View style={[styles.targetBadge, { borderColor: targetColor, backgroundColor: theme.surface }]}>
            <MapPin size={14} color={targetColor} strokeWidth={2.5} />
          </View>
        </Pressable>
      </View>
      <View style={styles.legendRow}>
        <View style={[styles.legendDot, { backgroundColor: targetColor }]} />
        <Text style={[styles.legend, { color: theme.muted }]}>示意定位 · 不按比例</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { borderWidth: 1, borderRadius: 20, padding: 10 },
  mapWrap: { height: 220, borderRadius: 14, overflow: 'hidden' },
  targetHit: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  targetBadge: { width: 29, height: 29, borderRadius: 15, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  legendRow: { flexDirection: 'row', gap: 7, alignItems: 'center', paddingHorizontal: 7, paddingBottom: 4 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legend: { ...typography.caption },
});
