import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { TimeFrame, CurrencyTimeSeries } from "../types/types";
import StatsSummary from "./StatsSummary";
import TimeFrameSelector from "./TimeFrameSelector";
// import { useCurrencyConverter } from "../../../context/currencyContext";

interface HistoryProps {
  timeframe: TimeFrame;
  setTimeframe: Dispatch<SetStateAction<TimeFrame>>;
  stats: CurrencyTimeSeries | null;
}

export default function CurrencyHistoryTab({
  timeframe,
  setTimeframe,
  stats,
}: HistoryProps) {
  // const { send, receive } = useCurrencyConverter();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !stats) return;

    const svg = d3.select(svgRef.current);

    // Remove previous drawing
    svg.selectAll("*").remove();
    // const width = svgRef.current.clientWidth;
    // const height = svgRef.current.clientHeight;
    const { width, height } = svgRef.current.getBoundingClientRect();

    const margin = {
      top: 20,
      right: 20,
      bottom: 40,
      left: 60,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(
        d3.extent(stats.points, (d) => new Date(d.timestamp)) as [Date, Date],
      )
      .range([0, innerWidth]);

    const min = d3.min(stats.points, (d) => d.value)!;
    const max = d3.max(stats.points, (d) => d.value)!;

    const padding = (max - min) * 0.1;

    const yScale = d3
      .scaleLinear()
      .domain([min - padding, max + padding])
      .nice()
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);

    chart
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis)
      .call((g) => {
        // Horizontal axis line
        g.select("path")
          .attr("stroke", "#3d3d3d")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "4,4");

        // Tick marks
        g.selectAll("line").attr("stroke", "#3d3d3d");

        // Tick labels
        g.selectAll("text").attr("fill", "#c6c6c6");
      });

    const yAxis = d3.axisLeft(yScale);

    chart
      .append("g")
      .call(yAxis)
      .call((g) => {
        // Vertical axis line
        g.select("path")
          .attr("stroke", "#3d3d3d")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "4,4");

        // Tick marks
        g.selectAll("line").attr("stroke", "#3d3d3d");

        // Tick labels
        g.selectAll("text").attr("fill", "#c6c6c6");
      });

    // drawing the area beneath the curve
    const defs = svg.append("defs");

    const gradient = defs
      .append("linearGradient")
      .attr("id", "chart-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#cef739")
      .attr("stop-opacity", 0.35);

    gradient
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#cef739")
      .attr("stop-opacity", 0.15);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#cef739")
      .attr("stop-opacity", 0);

    const area = d3
      .area<(typeof stats.points)[number]>()
      .x((d) => xScale(new Date(d.timestamp)))
      .y0(innerHeight) // Bottom of the chart
      .y1((d) => yScale(d.value));

    chart
      .append("path")
      .datum(stats.points)
      .attr("fill", "url(#chart-gradient)")
      .attr("d", area);

    const line = d3
      .line<(typeof stats.points)[number]>()
      .x((d) => xScale(new Date(d.timestamp)))
      .y((d) => yScale(d.value));
    // .curve(d3.curveMonotoneX);

    chart
      .append("path")
      .datum(stats.points)
      .attr("fill", "none")
      .attr("stroke", "#cef739")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  }, [stats, timeframe]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex gap-2 flex-col md:flex-row justify-between items-center">
        <StatsSummary stats={stats} />
        <TimeFrameSelector value={timeframe} onChange={setTimeframe} />
      </div>
      {/* the currency graph goes here */}
      <article className="bg-neutral-700 border border-neutral-500 p-3 rounded-xl ">
        <p className="text-neutral-50">{stats?.pair}</p>
        <div className="w-full h-48 sm:h-64 h-80">
          <svg
            className="w-full h-full"
            ref={svgRef}
            preserveAspectRatio="xMidYMid meet"
          ></svg>
        </div>
      </article>
    </section>
  );
}
