<script lang="ts">
  import type { ScaleLinear } from 'd3';
  import { format } from 'd3-format';
  import type { Margin } from './types';

  export let yScale: ScaleLinear<number, number>;
  export let width: number;
  export let margin: Margin;

  // Determine ticks based on y-scale.
  // Try changing this number to haver e.g. fewer ticks.
  $: yTicks = yScale.ticks(8);

  // Prepare a formatting function to display 4-5 digit numbers nicely.
  // this takes care of adding the comma to make thousands more readable.
  const formattingHelper = format(',.0r');
  // this takes the formatter and first runs the numbers
  // through Math.abs which makes all digits absolute (omitting the "-" sign).
  const formatter = (x: number) => formattingHelper(Math.abs(x));
  // see the docs for more examples on formatting numbers: https://github.com/d3/d3-format
</script>

<g class="y-axis" transform="translate({margin.left}, 0)">
  <!-- Loop through the y-ticks defined in the script tag and define a tick with it's label respectively. -->
  {#each yTicks as tick}
    <g class="tick" transform="translate(0, {yScale(tick)})">
      <!-- Y-Axis Ticks -->
      <line x1={0} x2={width} y1={0} y2={0} stroke="hsla(212, 10%, 53%, 0.3)" />

      <!-- Y-Axis Tick Labels -->
      <text x={-5} y={0} dominant-baseline="middle" text-anchor="end">
        {formatter(tick)}
      </text>
    </g>
  {/each}
</g>
