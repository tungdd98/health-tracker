import { Step, StepLabel, Stepper } from '@mui/material';

type FormStepperProps = {
  activeStep: number;
  steps: string[];
};

export function FormStepper({ activeStep, steps }: FormStepperProps) {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
