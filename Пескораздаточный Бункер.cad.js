// Prototype mesurments
const PROTO_TOTAL_HEIGHT_MM = 4225;
const PROTO_TOTAL_LENGTH_MM = 3295;
const PROTO_WIDE_CYLINDER_DIAMETER_MM = 2305;

// Drawing mesurments
const DRAWING_TOTAL_HEIGH_PX = 478;

const DRAWING_NARROW_CYLINDER_HEIGHT_PX = 174;
const DRAWING_NARROW_CYLINDER_DIAMETER_PX = 59;

const DRAWING_CONЕ_HEIGHT_PX = 27;

const DRAWING_WIDE_CYLINDER_TOTAL_HEIGHT_PX = 225;
const DRAWING_WIDE_CYLINDER_SPLIT_HEIGHT_PX = 105;
const DRAWING_WIDE_CYLINDER_DIAMETER_PX = 235;

const DRAWING_DISTRIBUTION_BOX_HEIGHT_PX = 18;

// Scale
const PROTO_MODEL_SCALE = 1.0 / 87.1;
const VERTICAL_DRAWING_MODEL_SCALE =
  (PROTO_MODEL_SCALE * PROTO_TOTAL_HEIGHT_MM) / DRAWING_TOTAL_HEIGH_PX;
const HORIZONTAL_DRAWING_MODEL_SCALE =
  (PROTO_MODEL_SCALE * PROTO_WIDE_CYLINDER_DIAMETER_MM) /
  DRAWING_WIDE_CYLINDER_DIAMETER_PX;

// Model mesurments
const MODEL_NARROW_CYLINDER_HEIGHT_MM =
  DRAWING_NARROW_CYLINDER_HEIGHT_PX * VERTICAL_DRAWING_MODEL_SCALE;
const MODEL_NARROW_CYLINDER_DIAMETER_MM =
  DRAWING_NARROW_CYLINDER_DIAMETER_PX * HORIZONTAL_DRAWING_MODEL_SCALE;

const MODEL_CONЕ_HEIGHT_MM =
  DRAWING_CONЕ_HEIGHT_PX * VERTICAL_DRAWING_MODEL_SCALE;

const MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM =
  DRAWING_WIDE_CYLINDER_TOTAL_HEIGHT_PX * VERTICAL_DRAWING_MODEL_SCALE;
const MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM =
  DRAWING_WIDE_CYLINDER_SPLIT_HEIGHT_PX * VERTICAL_DRAWING_MODEL_SCALE;
const MODEL_WIDE_CYLINDER_DIAMETER_MM =
  PROTO_WIDE_CYLINDER_DIAMETER_MM * PROTO_MODEL_SCALE;

const MODEL_CYLINDER_TOP_MM =
  MODEL_NARROW_CYLINDER_HEIGHT_MM +
  MODEL_CONЕ_HEIGHT_MM +
  MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM;

const MODEL_DISTRIBUTION_BOX_HEIGHT_MM =
  DRAWING_DISTRIBUTION_BOX_HEIGHT_PX * VERTICAL_DRAWING_MODEL_SCALE;

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

const platform = () => {
  return cube({
    size: [
      MODEL_PLATFORM_LENGTH_MM,
      MODEL_PLATFORM_WIDTH_MM,
      MODEL_RIM_PLATE_WIDTH_MM,
    ],
    center: [false, true, false],
  }).translate([
    MODEL_PLATFORM_DISTANCE_CURVE_MM,
    0,
    MODEL_PLATFORM_SURFACE_MM - MODEL_RIM_PLATE_WIDTH_MM,
  ]);
};
const platform_support = () => {
  const bottom = MODEL_CENTER_RIM_BOTTOM_MM + MODEL_RIM_PLATE_WIDTH_MM;
  const top = MODEL_PLATFORM_SURFACE_MM - MODEL_RIM_PLATE_WIDTH_MM;
  const side = MODEL_PLATFORM_WIDTH_MM / 2;

  const side_support_angle_rad = Math.atan(
    (top - bottom) / MODEL_PLATFORM_LENGTH_MM
  );
  const side_support_angle = (180 * side_support_angle_rad) / Math.PI;
  const side_support = union(
    cube({
      size: [
        MODEL_PLATFORM_LENGTH_MM / Math.cos(side_support_angle_rad),
        MODEL_RIM_PLATE_WIDTH_MM,
        MODEL_SUPPORT_PLATE_DEPTH_MM,
      ],
      center: false,
    }),
    cube({
      size: [
        MODEL_PLATFORM_LENGTH_MM / Math.cos(side_support_angle_rad),
        MODEL_SUPPORT_PLATE_DEPTH_MM,
        MODEL_RIM_PLATE_WIDTH_MM,
      ],
      center: false,
    })
  )
    .rotateY(-side_support_angle)
    .translate([MODEL_PLATFORM_DISTANCE_CURVE_MM, -side, bottom]);

  const center_length =
    MODEL_PLATFORM_LENGTH_MM -
    (MODEL_PLATFORM_DISTAMCE_FLAT_MM - MODEL_PLATFORM_DISTANCE_CURVE_MM);
  const center_support_angle_rad = Math.atan((top - bottom) / center_length);

  const center_support_angle = (180 * center_support_angle_rad) / Math.PI;
  const center_support = union(
    cube({
      size: [
        center_length / Math.cos(center_support_angle_rad),
        MODEL_RIM_PLATE_WIDTH_MM,
        MODEL_SUPPORT_PLATE_DEPTH_MM,
      ],
      center: false,
    }),
    cube({
      size: [
        center_length / Math.cos(center_support_angle_rad),
        MODEL_SUPPORT_PLATE_DEPTH_MM,
        MODEL_RIM_PLATE_WIDTH_MM,
      ],
      center: false,
    })
  )
    .rotateY(-center_support_angle)
    .translate([MODEL_PLATFORM_DISTAMCE_FLAT_MM, 0, bottom]);

  return union(side_support, side_support.mirroredY(), center_support);
};

const platform_assembly = () => {
  return union(platform(), platform_support());
};
const hatch = () => {
  const level0 = 0;
  const level1 = level0 + MODEL_SUPPORT_PLATE_DEPTH_MM / 2;
  const level2 = level1 + MODEL_RIM_PLATE_WIDTH_MM;
  const level3 = level2 + MODEL_SUPPORT_PLATE_DEPTH_MM / 2;

  const angle_rad = Math.atan(
    (2 * MODEL_CONЕ_HEIGHT_MM) /
      (MODEL_WIDE_CYLINDER_DIAMETER_MM -
        MODEL_NARROW_CYLINDER_DIAMETER_MM +
        MODEL_SUPPORT_PLATE_DEPTH_MM)
  );
  const position =
    MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM +
    Math.tan(angle_rad) * (MODEL_WIDE_CYLINDER_DIAMETER_MM / 2);

  const angle = (180 * angle_rad) / Math.PI;

  return union(
    cylinder({
      d2: MODEL_NARROW_CYLINDER_DIAMETER_MM / 2,
      d1: MODEL_NARROW_CYLINDER_DIAMETER_MM + MODEL_SUPPORT_PLATE_DEPTH_MM,
      h: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
      fn: 256,
    }).translate([0, 0, level3]),
    cylinder({
      d: MODEL_NARROW_CYLINDER_DIAMETER_MM + MODEL_SUPPORT_PLATE_DEPTH_MM,
      h: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
      fn: 256,
    }).translate([0, 0, level2]),
    cylinder({
      d: MODEL_NARROW_CYLINDER_DIAMETER_MM,
      h: MODEL_RIM_PLATE_WIDTH_MM,
      fn: 256,
    }).translate([0, 0, level1]),
    cylinder({
      d: MODEL_NARROW_CYLINDER_DIAMETER_MM - MODEL_SUPPORT_PLATE_DEPTH_MM,
      h: MODEL_SUPPORT_PLATE_DEPTH_MM, // extends twise so sides deep into cone
      center: true,
      fn: 256,
    }).translate([0, 0, level0])
  )
    .translate([
      (MODEL_WIDE_CYLINDER_DIAMETER_MM + MODEL_NARROW_CYLINDER_DIAMETER_MM) / 4,
      0,
      0,
    ])
    .rotateY(angle)
    .translate([0, 0, position])
    .rotateZ(45);
};
const top_column_lid = () => {
  const level0 = MODEL_CYLINDER_TOP_MM;
  const level1 = level0 + MODEL_SUPPORT_PLATE_DEPTH_MM / 2;
  const level2 = level1 + MODEL_SUPPORT_PLATE_DEPTH_MM;

  return union(
    sphere({
      r: MODEL_SUPPORT_PLATE_DEPTH_MM,
      center: true,
    }).translate([0, 0, level2]),
    cylinder({
      d: 4 * MODEL_SUPPORT_PLATE_DEPTH_MM,
      h: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
      fn: 64,
    }).translate([0, 0, level2]),
    cylinder({
      d: 2 * MODEL_SUPPORT_PLATE_DEPTH_MM,
      h: MODEL_SUPPORT_PLATE_DEPTH_MM,
      fn: 64,
    }).translate([0, 0, level1]),
    cylinder({
      d: MODEL_NARROW_CYLINDER_DIAMETER_MM + MODEL_SUPPORT_PLATE_DEPTH_MM,
      h: MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
      fn: 64,
    }).translate([0, 0, MODEL_CYLINDER_TOP_MM])
  );
};

const top_column = () => {
  return union(
    cylinder({
      d: MODEL_NARROW_CYLINDER_DIAMETER_MM,
      h: MODEL_NARROW_CYLINDER_HEIGHT_MM - MODEL_RIM_PLATE_WIDTH_MM,
      fn: 256,
    }).translate([
      0,
      0,
      MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM +
        MODEL_CONЕ_HEIGHT_MM +
        MODEL_RIM_PLATE_WIDTH_MM,
    ]),
    cylinder({
      d: MODEL_NARROW_CYLINDER_DIAMETER_MM - MODEL_SUPPORT_PLATE_DEPTH_MM,
      h: MODEL_RIM_PLATE_WIDTH_MM,
      fn: 256,
    }).translate([
      0,
      0,
      MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM + MODEL_CONЕ_HEIGHT_MM,
    ])
  );
};
const top_bottom_transition = () => {
  return translate(
    [0, 0, MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM],
    cylinder({
      d1: MODEL_WIDE_CYLINDER_DIAMETER_MM,
      d2: MODEL_NARROW_CYLINDER_DIAMETER_MM - MODEL_SUPPORT_PLATE_DEPTH_MM,
      h: MODEL_CONЕ_HEIGHT_MM,
      fn: 256,
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
  const main = cylinder({
    d: MODEL_WIDE_CYLINDER_DIAMETER_MM,
    h: MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM,
    fn: 256,
  });
  const rim = cylinder({
    d: MODEL_WIDE_CYLINDER_DIAMETER_MM + MODEL_SUPPORT_PLATE_DEPTH_MM,
    h: MODEL_RIM_PLATE_WIDTH_MM,
    fn: 256,
  });

  const rim1 = rim.translate([0, 0, MODEL_CENTER_RIM_BOTTOM_MM]);
  const rim2 = rim.translate([
    0,
    0,
    MODEL_WIDE_CYLINDER_TOTAL_HEIGHT_MM - MODEL_RIM_PLATE_WIDTH_MM,
  ]);

  const triangle_cut = linear_extrude(
    { height: MODEL_WIDE_CYLINDER_DIAMETER_MM },
    polygon([
      [-MODEL_WIDE_CYLINDER_DIAMETER_MM / 2, 0],
      [0, MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM],
      [MODEL_WIDE_CYLINDER_DIAMETER_MM / 2, 0],
    ])
  )
    .rotateX(90)
    .translate([0, MODEL_WIDE_CYLINDER_DIAMETER_MM / 2, 0]);

  const flat_cut = cube({
    size: [
      MODEL_WIDE_CYLINDER_DIAMETER_MM,
      MODEL_WIDE_CYLINDER_DIAMETER_MM,
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
    ],
    center: [true, true, false],
  });

  return difference(union(main, rim1, rim2), union(triangle_cut, flat_cut));
};

const bottom_cylinder_support = () => {
  const round_bar = cylinder({
    d: MODEL_NARROW_CYLINDER_DIAMETER_MM,
    h: MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
    fn: 256,
  }).translate([0, 0, MODEL_DISTRIBUTION_BOX_HEIGHT_MM]);

  const round_corner = cylinder({
    d: MODEL_NARROW_CYLINDER_DIAMETER_MM + MODEL_SUPPORT_PLATE_WIDTH_MM,
    h: MODEL_SUPPORT_PLATE_DEPTH_MM,
    fn: 256,
  }).translate([0, 0, MODEL_DISTRIBUTION_BOX_HEIGHT_MM]);

  const flat_bar = cube({
    size: [
      MODEL_WIDE_CYLINDER_DIAMETER_MM - MODEL_SUPPORT_PLATE_DEPTH_MM,
      MODEL_SUPPORT_PLATE_DEPTH_MM,
      MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
    ],
    center: [true, true, false],
  }).translate([0, 0, MODEL_DISTRIBUTION_BOX_HEIGHT_MM]);

  const flat_corner = cube({
    size: [
      MODEL_WIDE_CYLINDER_DIAMETER_MM - MODEL_SUPPORT_PLATE_DEPTH_MM,
      MODEL_SUPPORT_PLATE_WIDTH_MM,
      MODEL_SUPPORT_PLATE_DEPTH_MM,
    ],
    center: [true, true, false],
  }).translate([0, 0, MODEL_DISTRIBUTION_BOX_HEIGHT_MM]);

  const angle_bar = linear_extrude(
    { height: MODEL_SUPPORT_PLATE_DEPTH_MM },
    polygon([
      [
        MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
        -MODEL_WIDE_CYLINDER_DIAMETER_MM / 2 + MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
      ],
      [
        MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
        MODEL_WIDE_CYLINDER_DIAMETER_MM / 2 - MODEL_SUPPORT_PLATE_DEPTH_MM,
      ],
      [MODEL_DISTRIBUTION_BOX_HEIGHT_MM, MODEL_NARROW_CYLINDER_DIAMETER_MM / 2],
      [
        MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
        -MODEL_NARROW_CYLINDER_DIAMETER_MM / 2,
      ],
    ])
  )
    .rotateY(-90)
    .translate([MODEL_SUPPORT_PLATE_DEPTH_MM / 2, 0, 0]);

  const angle_corner1 = linear_extrude(
    { height: MODEL_SUPPORT_PLATE_WIDTH_MM },
    polygon([
      [
        MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
        MODEL_WIDE_CYLINDER_DIAMETER_MM / 2 - MODEL_SUPPORT_PLATE_DEPTH_MM / 2,
      ],
      [
        MODEL_WIDE_CYLINDER_SPLIT_HEIGHT_MM,
        MODEL_WIDE_CYLINDER_DIAMETER_MM / 2 -
          MODEL_SUPPORT_PLATE_DEPTH_MM * 1.5,
      ],
      [
        MODEL_DISTRIBUTION_BOX_HEIGHT_MM + MODEL_SUPPORT_PLATE_DEPTH_MM,
        MODEL_NARROW_CYLINDER_DIAMETER_MM / 2,
      ],
      [MODEL_DISTRIBUTION_BOX_HEIGHT_MM, MODEL_NARROW_CYLINDER_DIAMETER_MM / 2],
    ])
  )
    .rotateY(-90)
    .translate([MODEL_SUPPORT_PLATE_WIDTH_MM / 2, 0, 0]);

  const angle_corner2 = angle_corner1.mirroredY();

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
  const box = cube({
    size: [
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM * 2,
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
    ],
    center: [true, true, false],
  });
  const hole = cylinder({
    d: MODEL_DISTRIBUTION_BOX_HEIGHT_MM / 2,
    h: MODEL_DISTRIBUTION_BOX_HEIGHT_MM * 2,
  })
    .rotateX(90)
    .translate([
      0,
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM / 2,
    ]);

  const pipe1 = cylinder({
    d: MODEL_DISTRIBUTION_BOX_HEIGHT_MM / 3,
    h: MODEL_DISTRIBUTION_BOX_HEIGHT_MM,
  })
    .rotateY(120)
    .translate([
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM * 0.3,
      0,
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM / 2,
    ]);
  const pipe2 = pipe1.mirroredX();

  const box_assembly = difference(union(box, pipe1, pipe2), hole);

  const shift =
    (MODEL_WIDE_CYLINDER_DIAMETER_MM -
      MODEL_DISTRIBUTION_BOX_HEIGHT_MM -
      MODEL_SUPPORT_PLATE_DEPTH_MM) /
    2;
  return union(
    box_assembly.translate([shift, 0, 0]),
    box_assembly.translate([-shift, 0, 0])
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
