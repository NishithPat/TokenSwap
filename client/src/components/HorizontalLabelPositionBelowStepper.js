import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Start', 'Approve', 'Transfer'];
}

function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return 'Start swapping';
        case 1:
            return 'Need your approval';
        case 2:
            return 'Transfer Tokens';
        default:
            return 'Unknown stepIndex';
    }
}

export default function HorizontalLabelPositionBelowStepper(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const { approved, transferred } = props;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep === 1) {
            approved()
            console.log("approved");
        }
        if (activeStep === 2) {
            transferred();
            console.log("transfered");
        }
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Card >
            <CardContent>
                <div className={classes.root}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <div>
                        {activeStep === steps.length ? (
                            <div>
                                {handleReset()}
                            </div>
                        ) : (
                            <div>
                                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                                <div>
                                    {activeStep === steps.length - 1 ? (
                                        <Button variant="contained" color="secondary" onClick={handleNext}>
                                            Finish
                                        </ Button>
                                    ) : (
                                        <Button variant="contained" color="primary" onClick={handleNext}>
                                            Next
                                        </Button>)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </ CardContent>
        </Card>
    );
}
