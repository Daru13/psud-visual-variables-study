import { Experiment } from './Experiment';

function newExperiment(demoMode = false) {
    new Experiment(demoMode);
}

(window as any)["newExperiment"] = newExperiment;