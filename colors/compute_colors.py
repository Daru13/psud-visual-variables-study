import numpy as np
from tqdm import tqdm
from colormath.color_objects import LabColor, HSLColor, sRGBColor
from colormath.color_conversions import convert_color
from colormath.color_diff import delta_e_cie2000


# Base colors
#color_1 = sRGBColor.new_from_rgb_hex("#d95f02")
#color_2 = sRGBColor.new_from_rgb_hex("#7570b3")
#color_2 = sRGBColor.new_from_rgb_hex("#3E36B3")

color_1 = sRGBColor.new_from_rgb_hex("#D95E00")
color_2 = sRGBColor.new_from_rgb_hex("#0C00B3")




# Optimisation parameters
nb_final_candidates = 5

max_luminance_distance = 0.05
min_saturation_distance = 0.5

min_saturation = 0.25

max_luminance = 0.75
min_luminance = 0.15

luminance_step = 0.01
saturation_step = 0.01


# Convert them to Lab and HSL coordinates
lab_color_1 = convert_color(color_1, LabColor)
lab_color_2 = convert_color(color_2, LabColor)

hsl_color_1 = convert_color(color_1, HSLColor)
hsl_color_2 = convert_color(color_2, HSLColor)


# Extract useful coordinates
color_1_hue = hsl_color_1.get_value_tuple()[0]
color_2_hue = hsl_color_2.get_value_tuple()[0]

color_1_saturation = hsl_color_1.get_value_tuple()[1]
color_2_saturation = hsl_color_2.get_value_tuple()[1]

color_1_luminance = hsl_color_1.get_value_tuple()[2]
color_2_luminance = hsl_color_2.get_value_tuple()[2]

max_saturation = min(color_1_saturation, color_2_saturation)


# Compute the distance between the two base colors
initial_distance = delta_e_cie2000(lab_color_1, lab_color_2)


# Search for the top candidate desaturated colors
final_candidates = [{"distance_diff": float("inf")} for rank in range(1, nb_final_candidates + 1)]

sat_domain = np.arange(min_saturation, max_saturation, saturation_step)

print(color_1_saturation, color_2_saturation)

for sat in tqdm(sat_domain):
    #print(sat)
    #print(color_2_saturation)
    #print(np.abs(sat - color_2_saturation))
    #print(np.abs(sat - color_2_saturation) < min_saturation_distance)

    if sat < min_saturation or np.abs(sat - color_1_saturation) < min_saturation_distance or np.abs(sat - color_2_saturation) < min_saturation_distance:
        continue

    lum_1_domain = np.arange(min(color_1_luminance - max_luminance_distance, min_luminance), max(color_1_luminance + max_luminance_distance, max_luminance), luminance_step)

    for lum_1 in lum_1_domain:
        if lum_1 < min_luminance:
            continue

        lum_2_domain = np.arange(min(color_2_luminance - max_luminance_distance, min_luminance), max(color_2_luminance + max_luminance_distance, max_luminance), luminance_step)

        for lum_2 in lum_2_domain:
            if lum_2 < min_luminance:
                continue

            # Compute desaturated colors
            desaturated_color_1 = HSLColor(color_1_hue, sat, lum_1)
            desaturated_color_2 = HSLColor(color_2_hue, sat, lum_2)

            desaturated_lab_color_1 = convert_color(desaturated_color_1, LabColor)
            desaturated_lab_color_2 = convert_color(desaturated_color_2, LabColor)

            # Compute the distance_diff between them and the diff of distance
            distance = delta_e_cie2000(desaturated_lab_color_1, desaturated_lab_color_2) + delta_e_cie2000(desaturated_lab_color_1, lab_color_1) + delta_e_cie2000(desaturated_lab_color_2, lab_color_2)
            distance_diff = np.abs(distance - initial_distance)

            # Update the list of candidates
            final_candidates.append({
                "distance_diff": distance_diff,
                "color_1": desaturated_color_1,
                "color_2": desaturated_color_2,
            })
            final_candidates.sort(key = lambda c: c["distance_diff"])
            final_candidates.pop()


# Print the best candidates as HSL colors (scaled for CSS' HSL model)
print()
print("Initial colors (d = {})".format(initial_distance))
print(convert_color(color_1, sRGBColor).get_rgb_hex())
print(convert_color(color_2, sRGBColor).get_rgb_hex())
print()

#print("Candidates")
for n, candidate in enumerate(final_candidates):
    if "color_1" not in candidate:
        continue;

    print("Candidate {} (dist_diff = {})".format(n + 1, candidate["distance_diff"]))

    #print(candidate["color_1"].get_value_tuple())
    #print(candidate["color_2"].get_value_tuple())

    print(convert_color(candidate["color_1"], sRGBColor).get_rgb_hex())
    print(convert_color(candidate["color_2"], sRGBColor).get_rgb_hex())
    print()


# print(final_candidates)