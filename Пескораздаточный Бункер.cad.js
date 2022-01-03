// use https://openjscad.xyz/
const jscad = require("@jscad/modeling");
const {
  circle,
  cylinder,
  cylinderElliptic,
  cuboid,
  polygon,
  rectangle,
  sphere,
} = jscad.primitives;
const {
  mirrorX,
  mirrorY,
  rotateX,
  rotateY,
  rotateZ,
  translate,
  translateX,
  translateY,
  translateZ,
} = jscad.transforms;
const { subtract, union } = jscad.booleans;
const { extrudeFromSlices, extrudeLinear, slice } = jscad.extrusions;
const { geom2 } = jscad.geometries;
const { mat4 } = jscad.maths;

// Prototype mesurments
const PROTO_TOTAL_HEIGHT_MM = 4225;
const PROTO_TOTAL_LENGTH_MM = 3295;
const PROTO_WIDE_CYLINDER_DIAMETER_MM = 2305;

// Drawing 1 mesurments
const DRAWING1_TOTAL_HEIGH_PX = 478;

const DRAWING1_NARROW_CYLINDER_HEIGHT_PX = 174;
const DRAWING1_NARROW_CYLINDER_DIAMETER_PX = 59;

const DRAWING1_CONЕ_HEIGHT_PX = 27;

const DRAWING1_WIDE_CYLINDER_TOTAL_HEIGHT_PX = 225;
const DRAWING1_WIDE_CYLINDER_SPLIT_HEIGHT_PX = 105;
const DRAWING1_WIDE_CYLINDER_DIAMETER_PX = 235;

const DRAWING1_DISTRIBUTION_BOX_HEIGHT_PX = 18;

// Scale
const PROTO_MODEL_SCALE = 1.0 / 87.1;
const VERTICAL_DRAWING1_MODEL_SCALE =
  (PROTO_MODEL_SCALE * PROTO_TOTAL_HEIGHT_MM) / DRAWING1_TOTAL_HEIGH_PX;
const HORIZONTAL_DRAWING1_MODEL_SCALE =
  (PROTO_MODEL_SCALE * PROTO_WIDE_CYLINDER_DIAMETER_MM) /
  DRAWING1_WIDE_CYLINDER_DIAMETER_PX;

// Model mesurments
const MODEL_NARROW_CYLINDER_HEIGHT_MM =
  DRAWING1_NARROW_CYLINDER_HEIGHT_PX * VERTICAL_DRAWING1_MODEL_SCALE;
const MODEL_NARROW_CYLINDER_DIAMETER_MM =
  DRAWING1_NARROW_CYLINDER_DIAMETER_PX * HORIZONTAL_DRAWING1_MODEL_SCALE;

const MODEL_CONЕ_HEIGHT_MM =
  DRAWING1_CONЕ_HEIGHT_PX * VERTICAL_DRAWING1_MODEL_SCALE;

const MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM =
  DRAWING1_WIDE_CYLINDER_TOTAL_HEIGHT_PX * VERTICAL_DRAWING1_MODEL_SCALE;
const MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM =
  DRAWING1_WIDE_CYLINDER_SPLIT_HEIGHT_PX * VERTICAL_DRAWING1_MODEL_SCALE;
const MODEL_WIDE_CYLINDER_DIAMETER_MM =
  PROTO_WIDE_CYLINDER_DIAMETER_MM * PROTO_MODEL_SCALE;

const MODEL_CYLINDER_TOP_MM =
  MODEL_NARROW_CYLINDER_HEIGHT_MM +
  MODEL_CONЕ_HEIGHT_MM +
  MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM;

const MODEL_DISTRIBUTION_BOX_HEIGHT_MM =
  DRAWING1_DISTRIBUTION_BOX_HEIGHT_PX * VERTICAL_DRAWING1_MODEL_SCALE;

const MODEL_PLATFORM_DISTANCE_CURVE_MM = MODEL_WIDE_CYLINDER_DIAMETER_MM / 4;
const MODEL_PLATFORM_DISTAMCE_FLAT_MM = MODEL_WIDE_CYLINDER_DIAMETER_MM / 2;
const MODEL_PLATFORM_SURFACE_MM = MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM;
const MODEL_PLATFORM_LENGTH_MM =
  PROTO_TOTAL_LENGTH_MM * PROTO_MODEL_SCALE -
  MODEL_WIDE_CYLINDER_DIAMETER_MM / 2 -
  MODEL_PLATFORM_DISTANCE_CURVE_MM;
const MODEL_PLATFORM_WIDTH_MM =
  MODEL_WIDE_CYLINDER_DIAMETER_MM * Math.sin(Math.PI / 3);

const MODEL_CENTER_RIM_BOTTOM_MM = MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM / 2;
const MODEL_RIM_PLATE_WIDTH_MM = 1;

const MODEL_SUPPORT_PLATE_DEPTH_MM = 0.5;
const MODEL_SUPPORT_PLATE_WIDTH_MM = 2;

// Drawing 2 mesurments
const DRAWING2_PLATFORM_LENGTH_PX = 363;
const DRAWING2_PLATFORM_WIDTH_PX = 162;
const DRAWING2_NARROW_CYLYNDER_HEIGHT_PX = 295;

const DRAWING2_DUST_CATCHER_BASEMENT_LENGTH_PX = 120;
const DRAWING2_DUST_CATCHER_BASEMENT_WIDTH_PX = 58;
const DRAWING2_DUST_CATCHER_BASEMENT_HEIGHT_PX = 70;

const DRAWING2_DUST_CATCHER_CYL1_HEIGHT_PX = 264;
const DRAWING2_DUST_CATCHER_CYL2_HEIGHT_PX = 63;
const DRAWING2_DUST_CATCHER_CYL3_HEIGHT_PX = 18;
const DRAWING2_DUST_CATCHER_CYL4_HEIGHT_PX = 93;
const DRAWING2_DUST_CATCHER_CYL5_HEIGHT_PX = 115;
const DRAWING2_DUST_CATCHER_CYL5_RIM_HEIGHT_PX = 47;
const DRAWING2_DUST_CATCHER_CYL6_HEIGHT_PX = 56;
const DRAWING2_DUST_CATCHER_CYL7_HEIGHT_PX = 40;

const DRAWING2_DUST_CATCHER_CYL1_DIAMETER_PX = 10;
const DRAWING2_DUST_CATCHER_CYL2_DIAMETER_PX =
  DRAWING2_DUST_CATCHER_BASEMENT_LENGTH_PX;
const DRAWING2_DUST_CATCHER_CYL3_DIAMETER_PX = 54;
const DRAWING2_DUST_CATCHER_CYL4_DIAMETER_PX = 36;
const DRAWING2_DUST_CATCHER_CYL5_DIAMETER_PX = 67;
const DRAWING2_DUST_CATCHER_CYL6_DIAMETER_PX = 40;
const DRAWING2_DUST_CATCHER_CYL5_RIM_DIAMETER_PX = 53;
const DRAWING2_DUST_CATCHER_CYL7_DIAMETER_PX = 62;

const DRAWING2_DUST_CATCHER_INPUT_HEIGHT_PX = 43;
const DRAWING2_DUST_CATCHER_INPUT_DIAMETER_PX = 39;
const DRAWING2_DUST_CATCHER_INPUT_TRANSITION_PX = 55;

const DRAWING2_DUST_IN_TUBE_CYL1_DIAMETER_PX = 50;
const DRAWING2_DUST_IN_TUBE_CYL2_DIAMETER_PX = 65;
const DRAWING2_DUST_IN_TUBE_CYL3_DIAMETER_PX = 50;

const DRAWING2_DUST_IN_TUBE_CYL1_POSITION_PX = 17;
const DRAWING2_DUST_IN_TUBE_CYL2_POSITION_PX = 70;
const DRAWING2_DUST_IN_TUBE_CYL3_POSITION_PX = 63;

const DRAWING2_DUST_OUTTAKE_WIDTH_PX = 17;
const DRAWING2_DUST_OUTTAKE_DIAMETER_PX = 26;
const DRAWING2_DUST_OUTTAKE_TRANSITION_PX = 15;
const DRAWING2_DUST_OUTTAKE_LENGTH1_PX = 9;

const DRAWING2_DUST_MOTOR_CENTER_Z_PX = 114;

const DRAWING2_DUST_MOTOR_LENGTH1_PX = 32;
const DRAWING2_DUST_MOTOR_LENGTH2_PX = 40;
const DRAWING2_DUST_MOTOR_LENGTH3_PX = 30;

const DRAWING2_DUST_MOTOR_DIAMETER1_PX = 86;
const DRAWING2_DUST_MOTOR_DIAMETER2_PX = 95;
const DRAWING2_DUST_MOTOR_DIAMETER3_PX = 105;
const DRAWING2_DUST_MOTOR_DIAMETER4_PX = 180;

const DRAWING2_DUST_MOTOR_EXHAUST_WIDTH_PX = 60;

// Drawing 2 Scale
const DRAWING2_MODEL_X_SCALE =
  MODEL_PLATFORM_LENGTH_MM / DRAWING2_PLATFORM_LENGTH_PX;
const DRAWING2_MODEL_Y_SCALE =
  MODEL_PLATFORM_WIDTH_MM / DRAWING2_PLATFORM_WIDTH_PX;
const DRAWING2_MODEL_Z_SCALE =
  MODEL_NARROW_CYLINDER_HEIGHT_MM / DRAWING2_NARROW_CYLYNDER_HEIGHT_PX;

const spiral = (shape, a, radius1, radius2, shift, segments) => {
  return extrudeFromSlices(
    {
      numberOfSlices: segments + 1,
      callback: (p, i, b) => {
        const angle = (a * i) / segments;
        const radius = radius1 + ((radius2 - radius1) * i) / segments;
        const y = (shift * i) / segments;
        const rot = mat4.fromYRotation(mat4.create(), -angle);
        const tr = mat4.fromTranslation(mat4.create(), [radius, y, 0]);
        return slice.transform(mat4.multiply(mat4.create(), rot, tr), b);
      },
    },
    shape
  );
};
const rect_rect_extrude = (size1, size2, shift) => {
  const rect1 = slice.fromSides(geom2.toSides(rectangle({ size: size1 })));
  const rect2 = slice.transform(
    mat4.fromTranslation(mat4.create(), shift),
    slice.fromSides(geom2.toSides(rectangle({ size: size2 })))
  );
  return extrudeFromSlices(
    {
      numberOfSlices: 2,
      callback: (p, i, b) => b[i],
    },
    [rect1, rect2]
  );
};
const rect_cycle_extrude = (size, radius, length, segments) => {
  const rect = slice.fromSides(geom2.toSides(rectangle({ size })));
  const circ = slice.transform(
    mat4.fromZRotation(mat4.create(), (3 * Math.PI) / 4),
    slice.fromSides(geom2.toSides(circle({ radius, segments })))
  );
  return extrudeFromSlices(
    {
      numberOfSlices: 2,
      callback: (p, i, b) => {
        const tr = mat4.fromTranslation(mat4.create(), [0, 0, i * length]);
        return slice.transform(tr, b[i]);
      },
    },
    [rect, circ]
  );
};

const dust_motor = (center_x, center_y, center_z) => {
  const r0 = (DRAWING2_DUST_OUTTAKE_DIAMETER_PX * DRAWING2_MODEL_X_SCALE) / 2;
  const r1 = (DRAWING2_DUST_MOTOR_DIAMETER1_PX * DRAWING2_MODEL_X_SCALE) / 2;
  const r2 = (DRAWING2_DUST_MOTOR_DIAMETER2_PX * DRAWING2_MODEL_X_SCALE) / 2;
  const r3 = (DRAWING2_DUST_MOTOR_DIAMETER3_PX * DRAWING2_MODEL_X_SCALE) / 2;
  const r4 = (DRAWING2_DUST_MOTOR_DIAMETER4_PX * DRAWING2_MODEL_X_SCALE) / 2;

  const l1 = DRAWING2_DUST_MOTOR_LENGTH1_PX * DRAWING2_MODEL_Y_SCALE;
  const l2 = DRAWING2_DUST_MOTOR_LENGTH2_PX * DRAWING2_MODEL_Y_SCALE;
  const l_rim = MODEL_SUPPORT_PLATE_DEPTH_MM / 2;
  const l3 = DRAWING2_DUST_MOTOR_LENGTH3_PX * DRAWING2_MODEL_Y_SCALE;

  const ex_width =
    DRAWING2_DUST_MOTOR_EXHAUST_WIDTH_PX * DRAWING2_MODEL_X_SCALE;

  const rect = slice.fromSides(geom2.toSides(rectangle({ size: [r3, l3] })));

  return translate(
    [center_x, center_y, center_z],
    rotateX(
      -Math.PI / 2,
      union(
        translateZ(
          l1 + l2 + l3,
          cylinder({
            radius: r2,
            height: l_rim,
            segments: 128,
          })
        ),
        translate(
          [r4 / 2, -r3 / 2, l1 + l2 + l3 / 2],
          cuboid({ size: [r4, r3, l3] })
        ),
        translateZ(
          l1 + l2 + l3 / 2,
          rotateZ(
            Math.PI,
            rotateX(
              Math.PI / 2,
              subtract(
                spiral(rect, Math.PI, r3 / 2, r4 - r3 / 2, 0, 128),
                translateX((3 * r3) / 2, cuboid({ size: [r3, l3, 2 * r4] }))
              )
            )
          )
        ),
        translateZ(
          l1 + l2 + l3 / 2,
          cylinder({
            radius: r3,
            height: l3,
            segments: 128,
          })
        ),
        translateZ(
          l1 + l2,
          cylinder({
            radius: r2,
            height: l_rim,
            segments: 128,
          })
        ),
        translateZ(
          l1 + l2 / 2,
          cylinderElliptic({
            endRadius: [r1, r1],
            startRadius: [r0, r0],
            height: l2,
            segments: 128,
          })
        ),
        translateZ(
          l1 / 2,
          cylinder({
            radius: r0,
            height: l1,
            segments: 128,
          })
        )
      )
    )
  );
};

const dust_outtake_tube = (x, y, z) => {
  const tube_radius =
    (DRAWING2_DUST_OUTTAKE_DIAMETER_PX * DRAWING2_MODEL_X_SCALE) / 2;
  const tube_transition =
    DRAWING2_DUST_OUTTAKE_TRANSITION_PX * DRAWING2_MODEL_Y_SCALE;
  const tube_l1 = DRAWING2_DUST_OUTTAKE_LENGTH1_PX * DRAWING2_MODEL_Y_SCALE;

  const width = DRAWING2_DUST_OUTTAKE_WIDTH_PX * DRAWING2_MODEL_X_SCALE;
  const height = DRAWING2_DUST_CATCHER_CYL7_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE;
  const rim = MODEL_SUPPORT_PLATE_DEPTH_MM / 2;
  return translate(
    [x, y, z],
    rotateZ(
      Math.PI / 2,
      rotateY(
        -Math.PI / 2,
        union(
          rect_cycle_extrude(
            [height, width],
            tube_radius,
            tube_transition,
            128
          ),
          cuboid({
            size: [height + 2 * rim, width + 2 * rim, rim],
          }),
          translateZ(
            tube_transition + rim / 2,
            cylinder({
              radius: tube_radius + rim,
              height: rim,
            })
          ),
          translateZ(
            tube_transition + rim + tube_l1 / 2,
            cylinder({
              radius: tube_radius,
              height: tube_l1,
            })
          )
        )
      )
    )
  );
};

const dust_intake_tube = (x, z, rect) => {
  const tube_radius =
    (DRAWING2_DUST_CATCHER_INPUT_DIAMETER_PX * DRAWING2_MODEL_Z_SCALE) / 2;
  const tube_transition =
    (DRAWING2_DUST_CATCHER_INPUT_TRANSITION_PX * DRAWING2_MODEL_X_SCALE) / 2;

  const x3 = DRAWING2_DUST_IN_TUBE_CYL3_POSITION_PX * DRAWING2_MODEL_X_SCALE;
  const x2 =
    x3 + DRAWING2_DUST_IN_TUBE_CYL2_POSITION_PX * DRAWING2_MODEL_X_SCALE;
  const x1 =
    x2 +
    DRAWING2_DUST_IN_TUBE_CYL1_POSITION_PX * DRAWING2_MODEL_X_SCALE +
    MODEL_RIM_PLATE_WIDTH_MM;

  const r1 =
    (DRAWING2_DUST_IN_TUBE_CYL1_DIAMETER_PX * DRAWING2_MODEL_Z_SCALE) / 2;
  const r2 =
    (DRAWING2_DUST_IN_TUBE_CYL2_DIAMETER_PX * DRAWING2_MODEL_Z_SCALE) / 2;
  const r3 =
    (DRAWING2_DUST_IN_TUBE_CYL3_DIAMETER_PX * DRAWING2_MODEL_Z_SCALE) / 2;

  const rim = 2 * (r1 - tube_radius);

  return translate(
    [x, 0, z],
    rotateY(
      -Math.PI / 2,
      union(
        rect_cycle_extrude(rect, tube_radius, tube_transition, 128),
        translateZ(
          tube_transition + x / 2,
          cylinder({
            radius: tube_radius,
            height: x,
            segments: 128,
          })
        ),
        translateZ(
          x1,
          cylinder({
            radius: r1,
            height: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
            segments: 128,
          })
        ),
        translateZ(
          x2,
          cylinderElliptic({
            endRadius: [r2, r2],
            startRadius: [tube_radius, tube_radius],
            height: MODEL_RIM_PLATE_WIDTH_MM,
            segments: 128,
          })
        ),
        translateZ(
          x3,
          cylinder({
            radius: r3,
            height: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
            segments: 128,
          })
        ),
        translateZ(
          0,
          cuboid({
            size: [
              rect[0] + rim,
              rect[1] + rim,
              MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
            ],
          })
        )
      )
    )
  );
};

const dust_cyclon = (
  centerX,
  centerY,
  in_width,
  in_height,
  in_z,
  { r1, r2, r3, r4, r5, r6, r7, z1, z2, z3, z4, z5, z6, z7 }
) => {
  const spiral_length = (3 * Math.PI * r5) / 2;
  const intake_length = r5;

  const in_radius = r5 - in_width / 2;
  const spiral_z2 =
    in_z - (in_height * intake_length) / (spiral_length + intake_length);
  const spiral_z1 =
    spiral_z2 - (in_height * spiral_length) / (spiral_length + intake_length);

  const z5_rim =
    z5 +
    (DRAWING2_DUST_CATCHER_CYL5_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2 +
    DRAWING2_DUST_CATCHER_CYL5_RIM_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE;

  const r5_rim =
    (DRAWING2_DUST_CATCHER_CYL5_RIM_DIAMETER_PX * DRAWING2_MODEL_X_SCALE) / 2;

  const rect = slice.fromSides(
    geom2.toSides(rectangle({ size: [in_width, in_height] }))
  );

  return union(
    translate(
      [centerX, centerY, z7],
      cylinder({
        radius: r7,
        height: DRAWING2_DUST_CATCHER_CYL7_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [centerX - r7 / 2, centerY - r7 / 2, z7],
      cuboid({
        size: [
          r7,
          r7,
          DRAWING2_DUST_CATCHER_CYL7_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        ],
      })
    ),
    translate(
      [centerX, centerY, z6],
      cylinder({
        radius: r6,
        height: DRAWING2_DUST_CATCHER_CYL6_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [centerX, centerY, z5_rim],
      cylinder({
        radius: r5_rim,
        height: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
        segments: 128,
      })
    ),

    translate(
      [centerX, centerY, spiral_z2],
      rotateZ(
        Math.PI / 2,
        rotateX(
          Math.PI / 2,
          spiral(
            rect,
            (Math.PI * 3) / 2,
            in_radius,
            in_radius,
            spiral_z1 - spiral_z2,
            128
          )
        )
      )
    ),
    translate(
      [centerX, 0, spiral_z2],
      rotateY(
        -Math.PI / 2,
        rect_rect_extrude(
          [in_height, r5 - r6],
          [in_height, in_width],
          [in_z - spiral_z2, 0, r5]
        )
      )
    ),
    translate(
      [centerX, centerY, z5],
      cylinder({
        radius: r5,
        height: DRAWING2_DUST_CATCHER_CYL5_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [centerX, centerY, z4],
      cylinderElliptic({
        endRadius: [r5, r5],
        startRadius: [r4, r4],
        height: DRAWING2_DUST_CATCHER_CYL4_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [centerX, centerY, z3],
      cylinderElliptic({
        endRadius: [r4, r4],
        startRadius: [r3, r3],
        height: DRAWING2_DUST_CATCHER_CYL3_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [
        centerX,
        centerY,
        MODEL_PLATFORM_SURFACE_MM +
          (DRAWING2_DUST_CATCHER_BASEMENT_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) /
            2,
      ],
      cuboid({
        size: [
          DRAWING2_DUST_CATCHER_BASEMENT_LENGTH_PX * DRAWING2_MODEL_X_SCALE,
          DRAWING2_DUST_CATCHER_BASEMENT_WIDTH_PX * DRAWING2_MODEL_Y_SCALE,
          DRAWING2_DUST_CATCHER_BASEMENT_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        ],
      })
    ),
    translate(
      [centerX, centerY, z2],
      cylinderElliptic({
        endRadius: [r2, r2],
        startRadius: [r1, r1],
        height: DRAWING2_DUST_CATCHER_CYL2_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [centerX, centerY, z1],
      cylinder({
        radius: r1,
        height: DRAWING2_DUST_CATCHER_CYL1_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    )
  );
};
const dust_catcher_assembly = () => {
  const z2 =
    MODEL_PLATFORM_SURFACE_MM -
    (DRAWING2_DUST_CATCHER_CYL2_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2;
  const z1 =
    z2 - (DRAWING2_DUST_CATCHER_CYL1_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2;
  const z3 =
    MODEL_PLATFORM_SURFACE_MM +
    (DRAWING2_DUST_CATCHER_BASEMENT_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2 +
    (DRAWING2_DUST_CATCHER_CYL3_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2;
  const z4 =
    z3 +
    (DRAWING2_DUST_CATCHER_CYL3_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2 +
    (DRAWING2_DUST_CATCHER_CYL4_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2;
  const z5 =
    z4 +
    (DRAWING2_DUST_CATCHER_CYL4_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2 +
    (DRAWING2_DUST_CATCHER_CYL5_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2;
  const z6 =
    z5 +
    (DRAWING2_DUST_CATCHER_CYL5_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2 +
    (DRAWING2_DUST_CATCHER_CYL6_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2;
  const z7 =
    z6 +
    (DRAWING2_DUST_CATCHER_CYL6_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2 +
    (DRAWING2_DUST_CATCHER_CYL7_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2;

  const r1 =
    (DRAWING2_DUST_CATCHER_CYL1_DIAMETER_PX * DRAWING2_MODEL_X_SCALE) / 2;
  const r2 =
    (DRAWING2_DUST_CATCHER_CYL2_DIAMETER_PX * DRAWING2_MODEL_X_SCALE) / 2;
  const r3 =
    (DRAWING2_DUST_CATCHER_CYL3_DIAMETER_PX * DRAWING2_MODEL_X_SCALE) / 2;
  const r4 =
    (DRAWING2_DUST_CATCHER_CYL4_DIAMETER_PX * DRAWING2_MODEL_X_SCALE) / 2;
  const r5 =
    (DRAWING2_DUST_CATCHER_CYL5_DIAMETER_PX * DRAWING2_MODEL_X_SCALE) / 2;
  const r6 =
    (DRAWING2_DUST_CATCHER_CYL6_DIAMETER_PX * DRAWING2_MODEL_X_SCALE) / 2;
  const r7 =
    (DRAWING2_DUST_CATCHER_CYL7_DIAMETER_PX * DRAWING2_MODEL_X_SCALE) / 2;

  const centerX =
    MODEL_PLATFORM_DISTAMCE_FLAT_MM +
    MODEL_RIM_PLATE_WIDTH_MM +
    (DRAWING2_DUST_CATCHER_BASEMENT_LENGTH_PX * DRAWING2_MODEL_X_SCALE) / 2;

  const centerY = -(r5 + r6) / 2;

  const in_width = (r5 * 2) / 3;
  const in_height =
    DRAWING2_DUST_CATCHER_INPUT_HEIGHT_PX * DRAWING2_MODEL_X_SCALE;

  const in_z =
    z5 +
    (DRAWING2_DUST_CATCHER_CYL5_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2 +
    in_height / 2;

  return union(
    dust_intake_tube(centerX - r5, in_z, [in_height, in_width]),
    dust_cyclon(centerX, centerY, in_width, in_height, in_z, {
      r1,
      r2,
      r3,
      r4,
      r5,
      r6,
      r7,
      z1,
      z2,
      z3,
      z4,
      z5,
      z6,
      z7,
    }),
    dust_outtake_tube(
      centerX -
        r7 +
        (DRAWING2_DUST_OUTTAKE_WIDTH_PX * DRAWING2_MODEL_X_SCALE) / 2,
      centerY - r7,
      z7
    ),
    dust_motor(
      MODEL_PLATFORM_DISTAMCE_FLAT_MM +
        MODEL_RIM_PLATE_WIDTH_MM +
        DRAWING2_DUST_CATCHER_BASEMENT_LENGTH_PX * DRAWING2_MODEL_X_SCALE,
      centerY -
        r7 -
        (DRAWING2_DUST_OUTTAKE_TRANSITION_PX +
          DRAWING2_DUST_OUTTAKE_LENGTH1_PX) *
          DRAWING2_MODEL_Y_SCALE,
      MODEL_PLATFORM_SURFACE_MM +
        DRAWING2_DUST_MOTOR_CENTER_Z_PX * DRAWING2_MODEL_Z_SCALE
    )
  );
};

const platform = () => {
  return translateZ(
    MODEL_PLATFORM_SURFACE_MM -
      MODEL_RIM_PLATE_WIDTH_MM +
      MODEL_RIM_PLATE_WIDTH_MM / 2,
    translateX(
      MODEL_PLATFORM_DISTANCE_CURVE_MM + MODEL_PLATFORM_LENGTH_MM / 2,
      cuboid({
        size: [
          MODEL_PLATFORM_LENGTH_MM,
          MODEL_PLATFORM_WIDTH_MM,
          MODEL_RIM_PLATE_WIDTH_MM,
        ],
      })
    )
  );
};

const platform_support = () => {
  const bottom = MODEL_CENTER_RIM_BOTTOM_MM + MODEL_RIM_PLATE_WIDTH_MM;
  const top = MODEL_PLATFORM_SURFACE_MM - MODEL_RIM_PLATE_WIDTH_MM;
  const side = MODEL_PLATFORM_WIDTH_MM / 2;

  const side_support_angle = Math.atan(
    (top - bottom) / MODEL_PLATFORM_LENGTH_MM
  );
  const side_support = translate(
    [MODEL_PLATFORM_DISTANCE_CURVE_MM, -side, bottom],
    rotateY(
      -side_support_angle,
      union(
        cuboid({
          size: [
            MODEL_PLATFORM_LENGTH_MM / Math.cos(side_support_angle),
            MODEL_RIM_PLATE_WIDTH_MM,
            MODEL_SUPPORT_PLATE_DEPTH_MM,
          ],
          center: [
            MODEL_PLATFORM_LENGTH_MM / (2 * Math.cos(side_support_angle)),
            MODEL_RIM_PLATE_WIDTH_MM / 2,
            MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
          ],
        }),
        cuboid({
          size: [
            MODEL_PLATFORM_LENGTH_MM / Math.cos(side_support_angle),
            MODEL_SUPPORT_PLATE_DEPTH_MM,
            MODEL_RIM_PLATE_WIDTH_MM,
          ],
          center: [
            MODEL_PLATFORM_LENGTH_MM / (2 * Math.cos(side_support_angle)),
            MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
            MODEL_RIM_PLATE_WIDTH_MM / 2,
          ],
        })
      )
    )
  );

  const center_length =
    MODEL_PLATFORM_LENGTH_MM -
    (MODEL_PLATFORM_DISTAMCE_FLAT_MM - MODEL_PLATFORM_DISTANCE_CURVE_MM);
  const center_support_angle = Math.atan((top - bottom) / center_length);
  const center_support = translate(
    [MODEL_PLATFORM_DISTAMCE_FLAT_MM, 0, bottom],
    rotateY(
      -center_support_angle,
      union(
        cuboid({
          size: [
            center_length / Math.cos(center_support_angle),
            MODEL_RIM_PLATE_WIDTH_MM,
            MODEL_SUPPORT_PLATE_DEPTH_MM,
          ],
          center: [
            center_length / (2 * Math.cos(center_support_angle)),
            MODEL_RIM_PLATE_WIDTH_MM / 2,
            MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
          ],
        }),
        cuboid({
          size: [
            center_length / Math.cos(center_support_angle),
            MODEL_SUPPORT_PLATE_DEPTH_MM,
            MODEL_RIM_PLATE_WIDTH_MM,
          ],
          center: [
            center_length / (2 * Math.cos(center_support_angle)),
            MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
            MODEL_RIM_PLATE_WIDTH_MM / 2,
          ],
        })
      )
    )
  );

  return union(side_support, mirrorY(side_support), center_support);
};

const platform_assembly = () => {
  return union(platform(), platform_support(), dust_catcher_assembly());
};
const hatch = () => {
  const level0 = 0;
  const level1 = level0 + MODEL_SUPPORT_PLATE_DEPTH_MM / 2;
  const level2 = level1 + MODEL_RIM_PLATE_WIDTH_MM;
  const level3 = level2 + MODEL_SUPPORT_PLATE_DEPTH_MM / 2;

  const angle = Math.atan(
    (2 * MODEL_CONЕ_HEIGHT_MM) /
      (MODEL_WIDE_CYLINDER_DIAMETER_MM -
        MODEL_NARROW_CYLINDER_DIAMETER_MM +
        MODEL_SUPPORT_PLATE_DEPTH_MM)
  );
  const position =
    MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM +
    Math.tan(angle) * (MODEL_WIDE_CYLINDER_DIAMETER_MM / 2);

  const r1 = MODEL_NARROW_CYLINDER_DIAMETER_MM / 4;
  const r2 =
    MODEL_NARROW_CYLINDER_DIAMETER_MM / 2 + MODEL_SUPPORT_PLATE_DEPTH_MM / 2;
  const r3 = MODEL_NARROW_CYLINDER_DIAMETER_MM / 2;
  const r4 =
    MODEL_NARROW_CYLINDER_DIAMETER_MM / 2 - MODEL_SUPPORT_PLATE_DEPTH_MM / 2;

  const flat_hatch = union(
    translateZ(
      level3 + MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
      cylinderElliptic({
        endRadius: [r1, r1],
        startRadius: [r2, r2],
        height: MODEL_SUPPORT_PLATE_DEPTH_MM,
        segments: 256,
      })
    ),
    translateZ(
      level2 + MODEL_SUPPORT_PLATE_DEPTH_MM / 4,
      cylinder({
        radius: r2,
        height: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
        segments: 256,
      })
    ),
    translateZ(
      level1 + MODEL_RIM_PLATE_WIDTH_MM / 2,
      cylinder({
        radius: r3,
        height: MODEL_RIM_PLATE_WIDTH_MM,
        segments: 256,
      })
    ),
    translateZ(
      level0,
      cylinder({
        radius: r4,
        height: MODEL_SUPPORT_PLATE_DEPTH_MM, // extends twise so sides deep into cone
        segments: 256,
      })
    )
  );

  return rotateZ(
    Math.PI / 4,
    translateZ(
      position,
      rotateY(
        angle,
        translateX(
          MODEL_WIDE_CYLINDER_DIAMETER_MM / 4 +
            MODEL_NARROW_CYLINDER_DIAMETER_MM / 4,
          flat_hatch
        )
      )
    )
  );
};
const top_column_lid = () => {
  const level0 = MODEL_CYLINDER_TOP_MM;
  const level1 = level0 + MODEL_SUPPORT_PLATE_DEPTH_MM / 2;
  const level2 = level1 + MODEL_SUPPORT_PLATE_DEPTH_MM / 2;

  return union(
    translateZ(
      level2,
      sphere({
        radius: MODEL_SUPPORT_PLATE_DEPTH_MM,
      })
    ),
    translateZ(
      level2,
      cylinder({
        radius: 2 * MODEL_SUPPORT_PLATE_DEPTH_MM,
        height: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
        segments: 64,
      })
    ),
    translateZ(
      level1,
      cylinder({
        radius: MODEL_SUPPORT_PLATE_DEPTH_MM,
        height: MODEL_SUPPORT_PLATE_DEPTH_MM,
        segments: 64,
      })
    ),
    translateZ(
      level0,
      cylinder({
        radius:
          (MODEL_NARROW_CYLINDER_DIAMETER_MM + MODEL_SUPPORT_PLATE_DEPTH_MM) /
          2,
        height: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
        segments: 256,
      })
    )
  );
};

const top_column = () => {
  return union(
    translateZ(
      MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM +
        MODEL_CONЕ_HEIGHT_MM +
        MODEL_RIM_PLATE_WIDTH_MM +
        MODEL_NARROW_CYLINDER_HEIGHT_MM / 2 -
        MODEL_RIM_PLATE_WIDTH_MM / 2,
      cylinder({
        radius: MODEL_NARROW_CYLINDER_DIAMETER_MM / 2,
        height: MODEL_NARROW_CYLINDER_HEIGHT_MM - MODEL_RIM_PLATE_WIDTH_MM,
        segments: 256,
      })
    ),
    translateZ(
      MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM +
        MODEL_CONЕ_HEIGHT_MM +
        MODEL_RIM_PLATE_WIDTH_MM / 2,
      cylinder({
        radius:
          MODEL_NARROW_CYLINDER_DIAMETER_MM / 2 -
          MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
        height: MODEL_RIM_PLATE_WIDTH_MM,
        segments: 256,
      })
    )
  );
};
const top_bottom_transition = () => {
  const r1 = MODEL_WIDE_CYLINDER_DIAMETER_MM / 2;
  const r2 =
    MODEL_NARROW_CYLINDER_DIAMETER_MM / 2 - MODEL_SUPPORT_PLATE_DEPTH_MM / 2;
  return translateZ(
    MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM + MODEL_CONЕ_HEIGHT_MM / 2,
    cylinderElliptic({
      startRadius: [r1, r1],
      endRadius: [r2, r2],
      height: MODEL_CONЕ_HEIGHT_MM,
      segments: 256,
    })
  );
};
const top_assembly = () => {
  return union(
    top_column_lid(),
    top_column(),
    top_bottom_transition(),
    hatch()
  );
};

const bottom_cylinder = () => {
  const main = translateZ(
    MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM / 2,
    cylinder({
      radius: MODEL_WIDE_CYLINDER_DIAMETER_MM / 2,
      height: MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM,
      segments: 256,
    })
  );
  const rim = cylinder({
    radius: MODEL_WIDE_CYLINDER_DIAMETER_MM / 2 + MODEL_SUPPORT_PLATE_DEPTH_MM,
    height: MODEL_RIM_PLATE_WIDTH_MM,
    segments: 256,
  });

  const rim1 = translateZ(
    MODEL_CENTER_RIM_BOTTOM_MM + MODEL_RIM_PLATE_WIDTH_MM / 2,
    rim
  );
  const rim2 = translateZ(
    MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM - MODEL_RIM_PLATE_WIDTH_MM / 2,
    rim
  );
  const triangle_cut = translateY(
    MODEL_WIDE_CYLINDER_DIAMETER_MM / 2,
    rotateX(
      Math.PI / 2,
      extrudeLinear(
        { height: MODEL_WIDE_CYLINDER_DIAMETER_MM },
        polygon({
          points: [
            [MODEL_WIDE_CYLINDER_DIAMETER_MM / 2, 0],
            [0, MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM],
            [-MODEL_WIDE_CYLINDER_DIAMETER_MM / 2, 0],
          ],
        })
      )
    )
  );

  const flat_cut = cuboid({
    size: [
      MODEL_WIDE_CYLINDER_DIAMETER_MM,
      MODEL_WIDE_CYLINDER_DIAMETER_MM,
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
    ],
    center: [0, 0, MODEL_DISTRIBUTION_BOX_HEIGHT_MM / 2],
  });

  return subtract(union(main, rim1, rim2), union(triangle_cut, flat_cut));
};

const bottom_cylinder_support = () => {
  const round_bar = translateZ(
    MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM / 2 + MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
    cylinder({
      radius: MODEL_NARROW_CYLINDER_DIAMETER_MM / 2,
      height: MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
      segments: 256,
    })
  );

  const round_corner = translateZ(
    MODEL_SUPPORT_PLATE_DEPTH_MM / 2 + MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
    cylinder({
      radius:
        (MODEL_NARROW_CYLINDER_DIAMETER_MM + MODEL_SUPPORT_PLATE_WIDTH_MM) / 2,
      height: MODEL_SUPPORT_PLATE_DEPTH_MM,
      segments: 256,
    })
  );

  const flat_bar = translateZ(
    MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM / 2 + MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
    cuboid({
      size: [
        MODEL_WIDE_CYLINDER_DIAMETER_MM - MODEL_SUPPORT_PLATE_DEPTH_MM,
        MODEL_SUPPORT_PLATE_DEPTH_MM,
        MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
      ],
    })
  );

  const flat_corner = translateZ(
    MODEL_SUPPORT_PLATE_DEPTH_MM / 2 + MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
    cuboid({
      size: [
        MODEL_WIDE_CYLINDER_DIAMETER_MM - MODEL_SUPPORT_PLATE_DEPTH_MM,
        MODEL_SUPPORT_PLATE_WIDTH_MM,
        MODEL_SUPPORT_PLATE_DEPTH_MM,
      ],
    })
  );

  const angle_bar = translateX(
    MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
    rotateY(
      -Math.PI / 2,
      extrudeLinear(
        { height: MODEL_SUPPORT_PLATE_DEPTH_MM },
        polygon({
          points: [
            [
              MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
              -MODEL_WIDE_CYLINDER_DIAMETER_MM / 2 +
                MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
            ],
            [
              MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
              MODEL_WIDE_CYLINDER_DIAMETER_MM / 2 -
                MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
            ],
            [
              MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
              MODEL_NARROW_CYLINDER_DIAMETER_MM / 2,
            ],
            [
              MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
              -MODEL_NARROW_CYLINDER_DIAMETER_MM / 2,
            ],
          ],
        })
      )
    )
  );
  const angle_corner1 = translateX(
    MODEL_SUPPORT_PLATE_WIDTH_MM / 2,
    rotateY(
      -Math.PI / 2,
      extrudeLinear(
        { height: MODEL_SUPPORT_PLATE_WIDTH_MM },
        polygon({
          points: [
            [
              MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
              MODEL_NARROW_CYLINDER_DIAMETER_MM / 2,
            ],
            [
              MODEL_DISTRIBUTION_BOX_HEIGHT_MM + MODEL_SUPPORT_PLATE_DEPTH_MM,
              MODEL_NARROW_CYLINDER_DIAMETER_MM / 2,
            ],
            [
              MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
              MODEL_WIDE_CYLINDER_DIAMETER_MM / 2 -
                MODEL_SUPPORT_PLATE_DEPTH_MM * 1.5,
            ],
            [
              MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
              MODEL_WIDE_CYLINDER_DIAMETER_MM / 2 -
                MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
            ],
          ],
        })
      )
    )
  );

  const angle_corner2 = mirrorY(angle_corner1);

  return union(
    round_bar,
    round_corner,
    flat_bar,
    flat_corner,
    angle_bar,
    angle_corner1,
    angle_corner2
  );
};

const distribution_boxes = () => {
  const box = cuboid({
    size: [
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM * 2,
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
    ],
    center: [0, 0, MODEL_DISTRIBUTION_BOX_HEIGHT_MM / 2],
  });

  const hole = translateZ(
    MODEL_DISTRIBUTION_BOX_HEIGHT_MM / 2,
    rotateX(
      Math.PI / 2,
      cylinder({
        radius: MODEL_DISTRIBUTION_BOX_HEIGHT_MM / 4,
        height: MODEL_DISTRIBUTION_BOX_HEIGHT_MM * 2,
      })
    )
  );

  const pipe1 = translateZ(
    MODEL_DISTRIBUTION_BOX_HEIGHT_MM / 2,
    translateX(
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM * 0.8,
      rotateY(
        (Math.PI * 2) / 3,
        cylinder({
          radius: MODEL_DISTRIBUTION_BOX_HEIGHT_MM / 6,
          height: MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
        })
      )
    )
  );
  const pipe2 = mirrorX(pipe1);

  const box_assembly = subtract(union(box, pipe1, pipe2), hole);

  const shift =
    (MODEL_WIDE_CYLINDER_DIAMETER_MM -
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM -
      MODEL_SUPPORT_PLATE_DEPTH_MM) /
    2;
  return union(
    translateX(shift, box_assembly),
    translateX(-shift, box_assembly)
  );
};

const bottom_assembly = () => {
  return union(
    bottom_cylinder(),
    bottom_cylinder_support(),
    distribution_boxes()
  );
};

const main = () => {
  return union(bottom_assembly(), top_assembly(), platform_assembly());
};

module.exports = { main };
