export type AvatarPillProps = { size: number; number: number };

const AvatarPill: React.FC<AvatarPillProps> = ({ size, number }) => {
  const pillWidth = number < 99 ? size * 0.3 : size * 0.45;
  const pillHeight = size * 0.25;

  return (
    <>
      <rect
        x={"0"}
        y={"7%"}
        width={pillWidth}
        height={pillHeight}
        rx={pillHeight / 2} // Radio de las esquinas redondeadas
        ry={pillHeight / 2}
        strokeWidth="0"
        fill={"red"}
      />
      <text
        x={number < 99 ? "15%" : "20%"}
        y={"22%"}
        z={"20"}
        fill={"white"}
        fontFamily="Arial"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={size * 0.17}
      >
        {number >= 100 ? "+99" : number}
      </text>
    </>
  );
};

export default AvatarPill;
