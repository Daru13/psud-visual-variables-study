import pandas as pd
import pingouin as pg
import matplotlib.pyplot as plt
import seaborn as sbs


# Load the results
results = pd.read_csv("../results/all.csv")

print(results)

results_low = results.loc[results["OC"] == "Low"]
results_medium = results.loc[results["OC"] == "Medium"]
results_high = results.loc[results["OC"] == "High"]

results_hue = results.loc[results["VV"] == "Hue"]
results_sat = results.loc[results["VV"] == "Saturation"]
results_hue_sat = results.loc[results["VV"] == "Hue_Saturation"]


# One-way repeated mesures ANOVAs for each
aov_hue = results_hue.rm_anova(subject = "ParticipantID", dv = "Duration", within = "OC", detailed = True)
aov_sat = results_sat.rm_anova(subject = "ParticipantID", dv = "Duration", within = "OC", detailed = True)
aov_hue_sat = results_hue_sat.rm_anova(subject = "ParticipantID", dv = "Duration", within = "OC", detailed = True)

print(aov_hue)
print(aov_sat)
print(aov_hue_sat)

# Some plots
fig, (ax1, ax2) = plt.subplots(1, 2)

sbs.barplot(data = results, x = "VV", y ="Duration", hue = "OC", ax = ax1)
sbs.lineplot(data = results, x = "OC", y ="Duration", hue = "VV", ax = ax2)

plt.show()