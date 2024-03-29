import { useGuessContext } from "@/contexts/GuessContext";
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";
import { Pie as VisxPie } from "@visx/shape";
import { PieArcDatum, ProvidedProps } from "@visx/shape/lib/shapes/Pie";
import { FC, createContext, useCallback, useContext, useMemo } from "react";

export interface Domain {
  sex: string;
  count: number;
}

export type ArcProps = PieArcDatum<Domain>;

export interface PieProps {}

export const DataContext = createContext<Domain[]>([
  { sex: "Mädchen", count: 0 },
  { sex: "Bub", count: 0 },
]);
export const PieContext = createContext<ProvidedProps<Domain> | null>(null);
export const SizeContext = createContext<{ height: number; width: number }>({
  height: 0,
  width: 0,
});

const Arc: FC<ArcProps> = (arc) => {
  const distribution = useContext(DataContext);
  const pie = useContext(PieContext) as ProvidedProps<Domain>;

  const { count, sex } = arc.data;

  const [arcPath, centroidX, centroidY] = useMemo(
    () => [pie.path(arc), ...pie.path.centroid(arc)],
    [arc, pie]
  );

  const hasSpaceForLabel = useMemo(
    () => arc.endAngle - arc.startAngle > 0.01,
    [arc]
  );

  const domain = useMemo(
    () => distribution.map((value) => value.sex),
    [distribution]
  );

  const scale = useMemo(
    () =>
      scaleOrdinal({
        domain,
        range: ["hsl(323, 90%, 76%)", "hsl(190, 100%, 72%)"],
      }),
    [domain]
  );

  const fill = useMemo(() => scale(sex), [scale, sex]);

  return arcPath ? (
    <g>
      <path d={arcPath} fill={fill} />
      {hasSpaceForLabel && (
        <>
          <text
            x={centroidX}
            y={centroidY}
            dy=".33em"
            fill="currentColor"
            fontSize={16}
            textAnchor="middle"
            pointerEvents="none"
          >
            {sex}
          </text>
          <text
            x={centroidX}
            y={centroidY + 20}
            fontSize={12}
            textAnchor="middle"
            pointerEvents="none"
          >
            {count}
          </text>
        </>
      )}
    </g>
  ) : null;
};

const DONUT_THICKNESS_FACTOR = 0.5;

const DEFAULT_DISTRIBUTION = [
  { sex: "Mädchen", count: 0 },
  { sex: "Bub", count: 0 },
];

export const Pie: FC<PieProps> = () => {
  const data = useGuessContext();
  const { height, width } = useContext(SizeContext);

  const [centerX, centerY, radius] = useMemo(
    () => [width * 0.5, height * 0.5, Math.min(height, width) * 0.5],
    [height, width]
  );

  const distribution = useMemo(
    () =>
      data?.state.guesses.reduce((obj, guess) => {
        if (guess.sex === "female") {
          return [
            {
              ...obj[0],
              count: obj[0].count + 1,
            },
            obj[1],
          ];
        } else {
          return [
            obj[0],
            {
              ...obj[1],
              count: obj[1].count + 1,
            },
          ];
        }
      }, DEFAULT_DISTRIBUTION) ?? DEFAULT_DISTRIBUTION,
    [data?.state.guesses]
  );

  const getCount = useCallback((value: { count: number }) => value.count, []);

  const renderArcs = useCallback(
    (pie: ProvidedProps<Domain>) =>
      pie.arcs.map((arc: ArcProps, i: number) => (
        <PieContext.Provider key={`arc-${i}`} value={pie}>
          <Arc {...arc} />
        </PieContext.Provider>
      )),
    []
  );

  return (
    <DataContext.Provider value={distribution}>
      <Group top={centerY} left={centerX}>
        <VisxPie
          cornerRadius={8}
          data={distribution}
          innerRadius={radius * DONUT_THICKNESS_FACTOR}
          outerRadius={radius}
          padAngle={0.01}
          pieValue={getCount}
        >
          {renderArcs}
        </VisxPie>
      </Group>
    </DataContext.Provider>
  );
};
