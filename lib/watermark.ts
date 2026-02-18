import sharp from "sharp";

type WatermarkOptions = {
  text: string;
};

function buildWatermarkSvg(width: number, height: number, text: string): Buffer {
  const size = Math.max(22, Math.round(Math.min(width, height) * 0.06));
  const opacity = 0.28;
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="none"/>
      <g transform="translate(${width / 2} ${height / 2}) rotate(-24)">
        <text
          x="0"
          y="0"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="Arial, Helvetica, sans-serif"
          font-size="${size}"
          fill="white"
          fill-opacity="${opacity}"
          stroke="black"
          stroke-opacity="0.18"
          stroke-width="${Math.max(1, Math.round(size * 0.04))}"
          letter-spacing="${Math.round(size * 0.22)}"
        >
          ${text}
        </text>
      </g>
    </svg>
  `;

  return Buffer.from(svg);
}

export async function applyTextWatermark(input: Buffer, options: WatermarkOptions): Promise<Buffer> {
  const image = sharp(input);
  const metadata = await image.metadata();
  const width = metadata.width ?? 1200;
  const height = metadata.height ?? 800;

  const svg = buildWatermarkSvg(width, height, options.text);
  return image.composite([{ input: svg, gravity: "center" }]).toBuffer();
}
