import React from "react";
import { getRandomColor } from "../../utilities/getRandomColor";

const gradientColor1 = getRandomColor();
const gradientColor2 = getRandomColor();

const Avatar: React.FC<{
  sizing: number;
  letter?: string;
  badge?: React.ReactNode;
}> = React.memo(({ letter = "?", sizing, badge, ...props }) => {
  return (
    <svg
      width={sizing}
      height={sizing}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient
          id={`gradient-${letter}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            style={{ stopColor: gradientColor1, stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: gradientColor2, stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>

      <circle
        cx={sizing >> 1}
        cy={sizing >> 1}
        r="44%"
        stroke={"transparent"}
        fill={`url(#gradient-${letter})`}
      />
      <text
        x={sizing >> 1}
        y="58%"
        fill={"white"}
        fontFamily="Arial"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={sizing * 0.65}
      >
        {letter.charAt(0).toUpperCase()}
      </text>
      {badge}
    </svg>
  );
});

export default Avatar;
