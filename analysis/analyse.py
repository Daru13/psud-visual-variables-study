import numpy as np
import pandas as pd
import pingouin as pg
import matplotlib.pyplot as plt
import seaborn as sbs


# Define utility functions
def print_with_title(title, result):
    print()
    print(title)
    print(result)
    print()


# Load the results
results = pd.read_csv("../results/all.csv")

print(results)


# Define some convenient variables
results_low = results.loc[results["OC"] == "Low"]
results_medium = results.loc[results["OC"] == "Medium"]
results_high = results.loc[results["OC"] == "High"]

results_hue = results.loc[results["VV"] == "Hue"]
results_sat = results.loc[results["VV"] == "Saturation"]
results_hue_sat = results.loc[results["VV"] == "Hue_Saturation"]


# One-way repeated measures ANOVA for each
aov_hue = results_hue.rm_anova(subject = "ParticipantID", dv = "Duration", within = "OC", detailed = True)
aov_sat = results_sat.rm_anova(subject = "ParticipantID", dv = "Duration", within = "OC", detailed = True)
aov_hue_sat = results_hue_sat.rm_anova(subject = "ParticipantID", dv = "Duration", within = "OC", detailed = True)

print_with_title("AOV - Hue on Duration", aov_hue)
print_with_title("AOV - Saturation on Duration", aov_sat)
print_with_title("AOV - Hue_Saturation on Duration", aov_hue_sat)


# Pingouin does not include any Tukey's post-hoc test for within-subject experiment's data
# We therefore do not run any post-hoc test in Python (only in R)


# Some plots
results_for_plots = pd.concat([results_low, results_medium, results_high])
results_for_plots.replace({"Hue_Saturation": "Hue + Saturation"}, inplace = True)

plt.rc("axes", labelsize = 14)  

fig, ax = plt.subplots()

palette = sbs.color_palette("Blues_d", n_colors = 3)
barplot = sbs.barplot(data = results_for_plots, x = "VV", y = "Duration", hue = "OC",
            order = ["Hue", "Saturation", "Hue + Saturation"],
            hue_order = ["Low", "Medium", "High"],
            palette = palette,
            capsize = 0.1,
            errwidth = 1.5,
            ax = ax)
barplot.set(xlabel = "Visual variables",
            ylabel = "Duration (ms)",
            ylim = (0, 2400))

# palette = sbs.color_palette("Set1", n_colors = 3)
# lineplot = sbs.lineplot(data = results_for_plots, x = "OC", y = "Duration", hue = "VV",
#             hue_order = ["Hue", "Saturation", "Hue + Saturation"],
#             sort = False,
#             palette = palette,
#             ax = ax2)
# lineplot.set(xlabel = "Visual variables",
#              ylabel = "Duration (ms)",
#              ylim = (0, 2400))

plt.show()



results_for_regs = results_for_plots
results_for_plots.replace({"Low": 9, "Medium": 25, "High": 49}, inplace = True)

fig, (ax1, ax2, ax3) = plt.subplots(1, 3)
fig.tight_layout(pad = 0.5, h_pad = 0.3)
palette = sbs.color_palette("Set1", n_colors = 3)

regplot_hue = sbs.regplot(data = results_for_regs.loc[results_for_regs["VV"] == "Hue"],
                          x = "OC", y = "Duration",
                        #   x_estimator = np.mean,
                          robust = False,
                          color = palette[0],
                          ax = ax1)
regplot_hue.set(xlabel = "Number of objects",
                ylabel = "Duration (ms)",
                ylim = (0, 2400))
regplot_hue.set_title("VV = Hue", fontsize = 16)

regplot_sat = sbs.regplot(data = results_for_regs.loc[results_for_regs["VV"] == "Saturation"],
                          x = "OC", y = "Duration",
                        #   x_estimator = np.mean,
                          robust = False,
                          color = palette[1],
                          ax = ax2)
regplot_sat.set(xlabel = "Number of objects",
                ylabel = "Duration (ms)",
                ylim = (0, 2400))
regplot_sat.set_title("VV = Saturation", fontsize = 16)

regplot_hue_sat = sbs.regplot(data = results_for_regs.loc[results_for_regs["VV"] == "Hue + Saturation"],
                              x = "OC", y = "Duration",
                            #   x_estimator = np.mean,
                              robust = False,
                              color = palette[2],
                              ax = ax3)
regplot_hue_sat.set(xlabel = "Number of objects",
                    ylabel = "Duration (ms)",
                    ylim = (0, 2400))
regplot_hue_sat.set_title("VV = Hue + Saturation", fontsize = 16)

plt.show()