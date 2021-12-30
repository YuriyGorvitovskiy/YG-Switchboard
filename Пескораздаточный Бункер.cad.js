// use https://openjscad.xyz/
const jscad = require("@jscad/modeling");
const { cylinder, cylinderElliptic, cuboid, polygon, rectangle, sphere } =
  jscad.primitives;
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
const DRAWING2_DUST_CATCHER_CYL6_HEIGHT_PX = 56;
const DRAWING2_DUST_CATCHER_CYL7_HEIGHT_PX = 40;

const DRAWING2_DUST_CATCHER_CYL1_DIAMETER_PX = 10;
const DRAWING2_DUST_CATCHER_CYL2_DIAMETER_PX =
  DRAWING2_DUST_CATCHER_BASEMENT_LENGTH_PX;
const DRAWING2_DUST_CATCHER_CYL3_DIAMETER_PX = 54;
const DRAWING2_DUST_CATCHER_CYL4_DIAMETER_PX = 36;
const DRAWING2_DUST_CATCHER_CYL5_DIAMETER_PX = 67;
const DRAWING2_DUST_CATCHER_CYL6_DIAMETER_PX = 40;
const DRAWING2_DUST_CATCHER_CYL7_DIAMETER_PX = 62;

const DRAWING2_DUST_CATCHER_INPUT_HEIGHT_PX = 43;

// Drawing 2 Scale
const DRAWING2_MODEL_X_SCALE =
  MODEL_PLATFORM_LENGTH_MM / DRAWING2_PLATFORM_LENGTH_PX;
const DRAWING2_MODEL_Y_SCALE =
  MODEL_PLATFORM_WIDTH_MM / DRAWING2_PLATFORM_WIDTH_PX;
const DRAWING2_MODEL_Z_SCALE =
  MODEL_NARROW_CYLINDER_HEIGHT_MM / DRAWING2_NARROW_CYLYNDER_HEIGHT_PX;

const spiral = (shape, a, radius1, radius2, y, segments) => {
  return extrudeFromSlices(
    {
      numberOfSlices: segments + 1,
      callback: (p, i, b) => {
        const rot = mat4.fromYRotation(mat4.create(), -(a * i) / segments);
        const tr = mat4.fromTranslation(mat4.create(), [
          radius1 + ((radius2 - radius1) * i) / segments,
          (y * i) / segments,
          0,
        ]);
        return slice.transform(mat4.multiply(mat4.create(), rot, tr), b);
      },
    },
    shape
  );
};

const dust_cyclon = () => {
  const centerX =
    MODEL_PLATFORM_DISTAMCE_FLAT_MM +
    MODEL_RIM_PLATE_WIDTH_MM +
    (DRAWING2_DUST_CATCHER_BASEMENT_LENGTH_PX * DRAWING2_MODEL_X_SCALE) / 2;
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

  const in_width = r5 / 2;
  const in_height =
    DRAWING2_DUST_CATCHER_INPUT_HEIGHT_PX * DRAWING2_MODEL_X_SCALE;
  const in_radius = r5 - in_width / 2;

  const rect = slice.fromSides(
    geom2.toSides(rectangle({ size: [in_width, in_height] }))
  );
  return union(
    translate(
      [centerX, 0, z7],
      cylinder({
        radius: r7,
        height: DRAWING2_DUST_CATCHER_CYL7_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [centerX, 0, z6],
      cylinder({
        radius: r6,
        height: DRAWING2_DUST_CATCHER_CYL6_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [
        centerX,
        0,
        z5 +
          (DRAWING2_DUST_CATCHER_CYL5_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE) / 2 +
          in_height / 2,
      ],
      rotateZ(
        Math.PI / 2,
        rotateX(
          Math.PI / 2,
          spiral(rect, (Math.PI * 3) / 2, in_radius, in_radius, -in_height, 128)
        )
      )
    ),
    translate(
      [centerX, 0, z5],
      cylinder({
        radius: r5,
        height: DRAWING2_DUST_CATCHER_CYL5_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [centerX, 0, z4],
      cylinderElliptic({
        endRadius: [r5, r5],
        startRadius: [r4, r4],
        height: DRAWING2_DUST_CATCHER_CYL4_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [centerX, 0, z3],
      cylinderElliptic({
        endRadius: [r4, r4],
        startRadius: [r3, r3],
        height: DRAWING2_DUST_CATCHER_CYL3_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [
        MODEL_PLATFORM_DISTAMCE_FLAT_MM + MODEL_RIM_PLATE_WIDTH_MM,
        0,
        MODEL_PLATFORM_SURFACE_MM,
      ],
      cuboid({
        size: [
          DRAWING2_DUST_CATCHER_BASEMENT_LENGTH_PX * DRAWING2_MODEL_X_SCALE,
          DRAWING2_DUST_CATCHER_BASEMENT_WIDTH_PX * DRAWING2_MODEL_Y_SCALE,
          DRAWING2_DUST_CATCHER_BASEMENT_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        ],
        center: [
          0.5 *
            DRAWING2_DUST_CATCHER_BASEMENT_LENGTH_PX *
            DRAWING2_MODEL_X_SCALE,
          0,
          0.5 *
            DRAWING2_DUST_CATCHER_BASEMENT_HEIGHT_PX *
            DRAWING2_MODEL_Z_SCALE,
        ],
      })
    ),
    translate(
      [centerX, 0, z2],
      cylinderElliptic({
        endRadius: [r2, r2],
        startRadius: [r1, r1],
        height: DRAWING2_DUST_CATCHER_CYL2_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    ),
    translate(
      [centerX, 0, z1],
      cylinder({
        radius: r1,
        height: DRAWING2_DUST_CATCHER_CYL1_HEIGHT_PX * DRAWING2_MODEL_Z_SCALE,
        segments: 128,
      })
    )
  );
};
const dust_catcher_assembly = () => {
  return dust_cyclon();
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
        radius:
          MODEL_NARROW_CYLINDER_DIAMETER_MM / 2 +
          MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
        height: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
        segments: 256,
      })
    ),
    translateZ(
      level1 + MODEL_RIM_PLATE_WIDTH_MM / 2,
      cylinder({
        radius: MODEL_NARROW_CYLINDER_DIAMETER_MM / 2,
        height: MODEL_RIM_PLATE_WIDTH_MM,
        segments: 256,
      })
    ),
    translateZ(
      level0,
      cylinder({
        radius:
          MODEL_NARROW_CYLINDER_DIAMETER_MM / 2 -
          MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
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
  const level2 = level1 + MODEL_SUPPORT_PLATE_DEPTH_MM;

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
      MODEL_CYLINDER_TOP_MM,
      cylinder({
        radius:
          (MODEL_NARROW_CYLINDER_DIAMETER_MM + MODEL_SUPPORT_PLATE_DEPTH_MM) /
          2,
        height: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
        segments: 64,
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
