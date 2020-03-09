# Are (combined) changes in _hue_ and _saturation_ (in HSL space) pre-attentive?

This is a basic experiment to study the pre-attentive charactertistics of changes in certain dimensions of the HSL color space (one or more at the same time). It has been co-developed with Adrien C. as a group project for the Avanced Evaluation of Interactive Systems class of Paris-Saclay University.

## Organisation of the repository

The repository is organised as follows:

- `analysis` contains scripts we used to analyse and plot the collected data (in Python and in R);
- `colors` contains a script used to determine the desaturated colors from the vivid ones (using CIELAB and Delta E* equations);
- `results` contains the CSV files of the experimental data we collected from 9 anonymous participants;
- `src` contains the source code of the web application which implements the experiment.

## Building the application

The application is written in TypeScript and bundled using Rollup.

Run `yarn` (or `npm`) to install the dependencies.
Then, run `yarn build` to create your own build (in a `build` directory), or `yarn watch` to start Rollup in watch mode.