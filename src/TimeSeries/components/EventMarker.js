import React from "react";
import { fontFamily } from "../../theme";

const EventMarker = ({
  cx = 0,
  cy = 0,
  r,
  fill,
  arrow = true,
  arrowDir,
  children,
  ...props
}) => {
  const angle = arrowDir === "right" ? 0 : arrowDir === "left" ? 180 : 90;
  return (
    <g {...props}>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      {arrow && (
        <path
          transform={`rotate(${angle} ${cx} ${cy}) scale(${r / 9}) translate(${
            cx + r - 1
          },${cy - r / 2 + 0.5})`}
          d="M0 0C2.00003 3 6 4 6 4C6 4 2.00003 5 0 8V0Z"
          fill={fill}
        />
      )}
      <text
        textAnchor="middle"
        dy="0.3em"
        x={cx}
        y={cy}
        stroke="#fff"
        strokeWidth="1px"
        fill="#fff"
        fontSize="10px"
        fontFamily={fontFamily}
      >
        {children}
      </text>
    </g>
  );
};

export default EventMarker;
