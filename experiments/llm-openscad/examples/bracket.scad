// Parametric L-Bracket
// Adjustable dimensions for mounting applications

// Parameters
base_length = 40;      // Length of horizontal base
base_width = 30;       // Width of horizontal base  
base_thickness = 3;    // Thickness of base plate
wall_height = 30;      // Height of vertical wall
wall_thickness = 3;    // Thickness of vertical wall
hole_diameter = 4;     // Diameter of mounting holes
hole_spacing = 20;     // Spacing between holes
fillet_radius = 2;     // Radius for rounded edges

module rounded_cube(size, radius) {
    hull() {
        for (x = [radius, size[0] - radius]) {
            for (y = [radius, size[1] - radius]) {
                for (z = [0, size[2]]) {
                    translate([x, y, z])
                        cylinder(h=0.01, r=radius, center=false, $fn=20);
                }
            }
        }
    }
}

module bracket() {
    difference() {
        union() {
            // Horizontal base
            rounded_cube([base_length, base_width, base_thickness], fillet_radius);
            
            // Vertical wall
            translate([0, 0, base_thickness])
                rounded_cube([base_length, wall_thickness, wall_height], fillet_radius);
            
            // Connecting fillet
            translate([0, wall_thickness, base_thickness])
                rotate([0, 90, 0])
                    linear_extrude(height=base_length)
                        polygon([[0, 0], [wall_height/3, 0], [0, base_width - wall_thickness]]);
        }
        
        // Mounting holes in base
        for (x = [base_length/4, 3*base_length/4]) {
            translate([x, base_width/2, -1])
                cylinder(h=base_thickness + 2, d=hole_diameter, $fn=30);
        }
        
        // Mounting holes in wall
        for (z = [base_thickness + wall_height/3, base_thickness + 2*wall_height/3]) {
            translate([base_length/2, -1, z])
                rotate([-90, 0, 0])
                    cylinder(h=wall_thickness + 2, d=hole_diameter, $fn=30);
        }
    }
}

// Generate the bracket
bracket();
