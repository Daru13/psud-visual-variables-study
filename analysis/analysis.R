#### DON'T FORGET TO IMPORT FUNCTIONS FROM helpers_functions.R

# Adding a column with numerical values for object count
all$OCNb <- 0
all$OCNb[all$OC == "High"] <- 49
all$OCNb[all$OC == "Medium"] <- 25
all$OCNb[all$OC == "Low"] <- 9

# Transform participant id to be a factor
all$ParticipantID = as.factor(all$ParticipantID)

# Create the 3 subsets that we will analysed
hue = subset(all, all$VV == "Hue")
sat = subset(all, all$VV == "Saturation")
h_S = subset(all, all$VV == "Hue_Saturation")



library(ez)
library(lsr)

# Test if OC has an impact on Duration for the Hue
ezANOVA(data=hue, dv=.(Duration), wid=.(ParticipantID), within=.(OC), detailed = TRUE)

# Test if OC has an impact on Duration for the Saturation
ezANOVA(data=sat, dv=.(Duration), wid=.(ParticipantID), within=.(OC), detailed = TRUE)

# Test if OC has an impact on Duration for the Hue and Saturation
ezANOVA(data=h_S, dv=.(Duration), wid=.(ParticipantID), within=.(OC), detailed = TRUE)

# Plot the 3 datasets
library(ggplot2)
s <- summarySE(all, measurevar="Duration", groupvars=c("VV", "OC"))

ggplot(s, aes(x=VV, y=Duration, fill=OC)) +
geom_bar(stat="identity", position=position_dodge()) +
geom_errorbar(aes(ymin=Duration-ci, ymax=Duration+ci), width=.2, position=position_dodge(.9))

# Post-Hoc tests
pairwise.t.test(hue$Duration, hue$OC,paired=TRUE)
pairwise.t.test(sat$Duration, sat$OC,paired=TRUE)
pairwise.t.test(h_S$Duration, h_S$OC,paired=TRUE)

# Linear Model analysis
hue_s <- summarySE(hue, measurevar="Duration", groupvars=c("VV", "OCNb", "NbErrors"))
summary(lm(formula = Duration ~ OCNb, data = hue_s))

sat_s <- summarySE(sat, measurevar="Duration", groupvars=c("VV", "OCNb", "NbErrors"))
summary(lm(formula = Duration ~ OCNb, data = sat_s))

h_S_s <- summarySE(h_S, measurevar="Duration", groupvars=c("VV", "OCNb", "NbErrors"))
summary(lm(formula = Duration ~ OCNb, data = h_S_s))

# Plotting linear models
exp_summary <- summarySE(all, measurevar="Duration", groupvars=c("OC", "VV", "ParticipantID"))
ggplot(exp_summary, aes(x=OCNb, y=Duration, color=VV)) + # map chart attributes to data geom_point(shape=1) + # add a point layer (one circle per data point)
  geom_smooth(method=lm, se=FALSE) + # add a regression line layer
  theme(text = element_text(size=30), legend.position = "top")


# Compare if there is a difference between Hue and Saturation as preattentive visual variable
t.test(hue_s$Duration, sat_s$Duration, paired=TRUE)

cohen_effect_size <- abs(mean(hue_s$Duration - sat_s$Duration)) / sd(hue_s$Duration - sat_s$Duration)

# Error analysis
summarySE(all, measurevar = "NbErrors", groupvars = c("OC", "VV"))

# Test if OC has an impact on the number of Error for the Hue and Saturation
ezANOVA(data=h_S, dv=.(NbErrors), wid=.(ParticipantID), within=.(OC), detailed = TRUE)