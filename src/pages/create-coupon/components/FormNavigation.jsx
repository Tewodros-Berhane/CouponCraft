import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FormNavigation = ({
  currentStep,
  totalSteps,
  onStepChange,
  onSaveDraft,
  onPreview,
  onPublish,
  isValid,
  isSaving
}) => {
  const steps = [
    { id: 1, name: 'Template', icon: 'Palette', description: 'Choose design' },
    { id: 2, name: 'Discount', icon: 'Tag', description: 'Set offer details' },
    { id: 3, name: 'Validity', icon: 'Calendar', description: 'Configure timing' },
    { id: 4, name: 'Customize', icon: 'Brush', description: 'Brand & style' },
    { id: 5, name: 'Preview', icon: 'Eye', description: 'Review & finalize' }
  ];

  const isStepCompleted = (stepId) => {
    return stepId < currentStep;
  };

  const isStepActive = (stepId) => {
    return stepId === currentStep;
  };

  const canNavigateToStep = (stepId) => {
    return stepId <= currentStep || isStepCompleted(stepId);
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground">Progress</h4>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Step Indicators */}
        <div className="space-y-3">
          {steps?.map((step, index) => (
            <div key={step?.id} className="flex items-center">
              <button
                onClick={() => canNavigateToStep(step?.id) && onStepChange(step?.id)}
                disabled={!canNavigateToStep(step?.id)}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all w-full text-left ${
                  isStepActive(step?.id)
                    ? 'bg-primary/10 text-primary'
                    : isStepCompleted(step?.id)
                    ? 'bg-success/10 text-success hover:bg-success/20'
                    : canNavigateToStep(step?.id)
                    ? 'hover:bg-muted text-muted-foreground'
                    : 'text-muted-foreground/50 cursor-not-allowed'
                }`}
              >
                {/* Step Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isStepActive(step?.id)
                      ? 'bg-primary text-primary-foreground'
                      : isStepCompleted(step?.id)
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isStepCompleted(step?.id) ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step?.icon} size={16} />
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1">
                  <div className="font-medium">{step?.name}</div>
                  <div className="text-xs opacity-75">{step?.description}</div>
                </div>

                {/* Navigation Arrow */}
                {canNavigateToStep(step?.id) && !isStepActive(step?.id) && (
                  <Icon name="ChevronRight" size={16} className="opacity-50" />
                )}
              </button>

              {/* Progress Line */}
              {index < steps?.length - 1 && (
                <div className="ml-4 mt-2 mb-1">
                  <div
                    className={`w-0.5 h-4 ${
                      isStepCompleted(step?.id) ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Navigation Actions */}
      <div className="space-y-3">
        {/* Primary Actions */}
        <div className="flex space-x-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => onStepChange(currentStep - 1)}
              iconName="ChevronLeft"
              iconPosition="left"
              className="flex-1"
            >
              Previous
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              variant="default"
              onClick={() => onStepChange(currentStep + 1)}
              disabled={!isValid}
              iconName="ChevronRight"
              iconPosition="right"
              className="flex-1"
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={onPreview}
              disabled={!isValid}
              iconName="Eye"
              iconPosition="left"
              className="flex-1"
            >
              Preview Coupon
            </Button>
          )}
        </div>

        {/* Secondary Actions */}
        <div className="flex space-x-3">
          <Button
            variant="ghost"
            onClick={onSaveDraft}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
            className="flex-1"
          >
            Save Draft
          </Button>

          {currentStep === totalSteps && (
            <>
              <Button
                variant="outline"
                onClick={onPreview}
                iconName="ExternalLink"
                iconPosition="left"
                className="flex-1"
              >
                Preview
              </Button>
              <Button
                variant="default"
                onClick={onPublish}
                iconName="Send"
                iconPosition="left"
                className="flex-1"
                disabled={!isValid}
              >
                Publish & Share
              </Button>
            </>
          )}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-muted/30 rounded-lg p-3">
        <h5 className="text-sm font-medium text-foreground mb-2">Quick Actions</h5>
        <div className="space-y-2">
          <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
            <Icon name="Copy" size={14} />
            <span>Duplicate from existing</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
            <Icon name="RotateCcw" size={14} />
            <span>Reset to defaults</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
            <Icon name="HelpCircle" size={14} />
            <span>Get help</span>
          </button>
        </div>
      </div>
      {/* Validation Messages */}
      {!isValid && currentStep > 1 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Complete required fields</p>
              <p className="text-muted-foreground">
                Please fill in all required information before proceeding to the next step.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormNavigation;
