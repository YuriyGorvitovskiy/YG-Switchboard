const jscad = require("@jscad/modeling");
const { extrudeFromSlices, slice } = jscad.extrusions;
const { geom2 } = jscad.geometries;
const { mat4 } = jscad.maths;
const { rectangle } = jscad.primitives;

const main = () => {
  const rect = slice.fromSides(geom2.toSides(rectangle({ size: [1, 2] })));
  const a = (Math.PI * 3) / 2;
  const d = 3;
  const n = 256;

  //return cube({size: 1});
  return extrudeFromSlices(
    {
      numberOfSlices: n + 1,
      callback: (p, i, b) => {
        const rot = mat4.fromYRotation(mat4.create(), -(a * i) / n);
        const tr = mat4.fromTranslation(mat4.create(), [d, 0, 0]);
        return slice.transform(mat4.multiply(mat4.create(), rot, tr), b);
      },
    },
    rect
  );
};

module.exports = { main };
