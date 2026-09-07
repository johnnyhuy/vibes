// Parametric Enclosure Box with Lid
// Adjustable for electronics projects

// Box Parameters
box_width = 60;
box_length = 80;
box_height = 30;
wall_thickness = 2;
corner_radius = 3;
lid_clearance = 0.2;  // Gap for lid fit
lip_height = 3;       // Depth of lid lip

// Mounting bosses
boss_diameter = 6;
boss_height = box_height - wall_thickness - 2;
screw_hole_diameter = 3;

module rounded_box(size, radius, thickness) {
    difference() {
        // Outer shell
        minkowski() {
            cube([size[0] - 2*radius, size[1] - 2*radius, size[2]/2]);
            cylinder(r=radius, h=size[2]/2, $fn=30);
        }
        
        // Inner cavity
        translate([thickness, thickness, thickness])
            minkowski() {
                cube([size[0] - 2*radius - 2*thickness, 
                      size[1] - 2*radius - 2*thickness, 
                      size[2]/2]);
                cylinder(r=radius, h=size[2]/2, $fn=30);
            }
    }
}

module enclosure_base() {
    difference() {
        union() {
            // Main box
            rounded_box([box_width, box_length, box_height], corner_radius, wall_thickness);
            
            // Mounting bosses
            boss_positions = [
                [10, 10],
                [box_width - 10, 10],
                [10, box_length - 10],
                [box_width - 10, box_length - 10]
            ];
            
            for (pos = boss_positions) {
                translate([pos[0], pos[1], wall_thickness])
                    cylinder(d=boss_diameter, h=boss_height, $fn=30);
            }
        }
        
        // Screw holes in bosses
        boss_positions = [
            [10, 10],
            [box_width - 10, 10],
            [10, box_length - 10],
            [box_width - 10, box_length - 10]
        ];
        
        for (pos = boss_positions) {
            translate([pos[0], pos[1], wall_thickness - 1])
                cylinder(d=screw_hole_diameter, h=boss_height + 2, $fn=20);
        }
    }
}

module enclosure_lid() {
    union() {
        // Lid top plate
        rounded_box([box_width, box_length, wall_thickness + 1], corner_radius, 0);
        
        // Lid lip (fits inside box)
        translate([wall_thickness + lid_clearance, 
                   wall_thickness + lid_clearance, 
                   wall_thickness])
            cube([box_width - 2*wall_thickness - 2*lid_clearance,
                  box_length - 2*wall_thickness - 2*lid_clearance,
                  lip_height]);
    }
}

// Generate parts
// Uncomment one at a time for export

enclosure_base();

// Lid positioned next to base for export
translate([box_width + 10, 0, 0])
    enclosure_lid();
