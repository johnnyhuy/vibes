// Parametric Involute Gear
// Based on public domain OpenSCAD gear library

// Gear Parameters
number_of_teeth = 20;
circular_pitch = 5;      // Distance between teeth
pressure_angle = 20;     // Standard is 20 degrees
clearance = 0.2;
gear_thickness = 5;
rim_thickness = gear_thickness;
hub_thickness = gear_thickness;
hub_diameter = 10;
bore_diameter = 5;

// Calculations
pitch_radius = number_of_teeth * circular_pitch / (2 * PI);
base_radius = pitch_radius * cos(pressure_angle);
outer_radius = pitch_radius + circular_pitch / PI;
root_radius = pitch_radius - (circular_pitch / PI + clearance);

module gear_tooth() {
    angle = 360 / number_of_teeth;
    
    polygon([
        [0, 0],
        polar(root_radius, -angle/4),
        polar(pitch_radius, -angle/4),
        polar(outer_radius, 0),
        polar(pitch_radius, angle/4),
        polar(root_radius, angle/4),
    ]);
}

function polar(r, theta) = [r * cos(theta), r * sin(theta)];

module gear_2d() {
    difference() {
        union() {
            // Teeth
            for (i = [0:number_of_teeth-1]) {
                rotate([0, 0, i * 360 / number_of_teeth])
                    gear_tooth();
            }
            
            // Rim
            circle(r=root_radius, $fn=100);
        }
        
        // Hub hole
        circle(d=hub_diameter, $fn=50);
    }
}

module gear() {
    difference() {
        union() {
            // Main gear body
            linear_extrude(height=gear_thickness)
                gear_2d();
            
            // Hub
            cylinder(d=hub_diameter + 2, h=hub_thickness, $fn=50);
        }
        
        // Bore hole
        translate([0, 0, -1])
            cylinder(d=bore_diameter, h=hub_thickness + 2, $fn=30);
    }
}

// Generate the gear
gear();
