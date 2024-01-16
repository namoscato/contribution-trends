<script lang="ts">
  // inspired by: https://www.sveltecharts.com/charts/beee73dd-b59c-4d88-bdfa-c31a43381662
  import * as d3 from 'd3';
  import AxisX from './AxisX.svelte';
  import AxisY from './AxisY.svelte';
  import type { Margin, StreamgraphData } from './types';

  export let data: StreamgraphData[];

  const width = 928;
  const height = 500;

  const legendWidth = 130;

  const margin: Margin = {
    top: 10,
    right: 100,
    bottom: 20,
    left: 55
  };

  // Determine the series that need to be stacked.
  // We'll loop through this series with an {#each} block below
  // to construct the area chart for each of our our categories.
  const series = d3
    .stack<unknown, StreamgraphData, string>()
    .offset(d3.stackOffsetWiggle)
    .order(d3.stackOrderInsideOut)
    .keys(d3.union(data.map((d) => d.category))) // distinct series keys, in input order
    // @ts-expect-error TODO first destructured argument is not iterable
    .value(([, D], key) => D.get(key).count)(
    // get value for each series key and stack
    // @ts-expect-error TODO index signature is missing
    d3.index(
      data,
      (d) => d.date,
      (d) => d.category
    )
  ); // group by stack then series key

  // Prepare the scales for positional and color encodings.
  $: xScale = d3
    .scaleUtc()
    // @ts-expect-error TODO [undefined, undefined] extent return value is incompatible
    .domain(d3.extent(data, (d) => new Date(d.date)))
    .range([margin.left, width - margin.right]);

  $: yScale = d3
    .scaleLinear()
    // @ts-expect-error TODO [undefined, undefined] extent return value is incompatible
    .domain(d3.extent(series.flat(2)))
    .rangeRound([height - margin.bottom, margin.top]);

  const color = d3
    .scaleOrdinal<string>()
    .domain(series.map((d) => d.key))
    .range(d3.schemeTableau10);

  // Construct an area shape.
  // This will create the area shape (an SVG path) for
  // each of the categories within our series.
  const area = d3
    .area()
    // @ts-expect-error TODO data property does not exist on [number, number]
    .x((d) => xScale(new Date(d.data[0])))
    .y0((d) => yScale(d[0]))
    // TODO tighten up any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .y1((d) => yScale(d[1])) as any;
</script>

<svg {width} {height} viewBox="0 0 {width} {height}" style:max-width="100%" style:height="auto">
  <AxisY {yScale} {width} {margin} />

  <AxisX {xScale} {height} {margin} />

  <!-- Append a path for each series -->
  <g class="data">
    {#each series as s}
      <!-- @ts-expect-error ignore -->
      <path id={s.key} fill={color(s.key)} d={area(s)} />
    {/each}
  </g>

  <g id="legend">
    {#each series as s}
      <circle cx={width - legendWidth} cy={margin.top + s.index * 25} r="6" fill={color(s.key)} />
      <text
        x={20 + width - legendWidth}
        y={margin.top + s.index * 25}
        text-anchor="left"
        alignment-baseline="middle">{s.key}</text
      >
    {/each}
  </g>
</svg>
