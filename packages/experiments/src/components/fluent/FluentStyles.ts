import { FontWeights } from 'office-ui-fabric-react/lib/Styling';
import { NeutralColors } from './FluentColors';
import {
  IChoiceGroupOptionStyleProps,
  IChoiceGroupOptionStyles
} from 'office-ui-fabric-react/lib/components/ChoiceGroup/ChoiceGroupOption';
import { ICalloutContentStyleProps } from 'office-ui-fabric-react/lib/components/Callout/Callout.types';
import { FontSizes } from './FluentType';
import { Depths } from './FluentDepths';

const fluentBorderRadius = '2px';

const BreadcrumbStyles = {
  itemLink: {
    fontSize: FontSizes.size18,
    fontWeight: 400,
    color: NeutralColors.gray130,
    selectors: {
      '&:last-child': {
        fontWeight: 600
      }
    }
  }
};

const PrimaryButtonStyles = {
  root: {
    borderRadius: fluentBorderRadius
    // boxShadow: Depths.depth4
  }
};

const CompoundButtonStyles = {
  root: {
    borderRadius: fluentBorderRadius
    // boxShadow: Depths.depth4
  }
};

const DefaultButtonStyles = {
  root: {
    borderRadius: fluentBorderRadius,
    backgroundColor: '#fff',
    border: `1px solid ${NeutralColors.gray20}`
  },
  rootHovered: {
    backgroundColor: '#f3f2f1'
  }
};

const CheckboxStyles = {
  checkbox: {
    borderRadius: fluentBorderRadius
  }
};

const ChoiceGroupOptionStyles = (props: IChoiceGroupOptionStyleProps): IChoiceGroupOptionStyles => {
  const { checked, disabled, hasIcon, hasImage } = props;
  const radioButtonSpacing = 1;
  const radioButtonInnerSize = 6;
  return {
    field: {
      selectors: {
        ':before': [
          disabled && {
            backgroundColor: NeutralColors.white,
            borderColor: NeutralColors.gray60
          }
        ],
        ':after': [
          {
            top: 4,
            left: 4,
            width: 12,
            height: 12,
            borderWidth: 6
          },
          checked &&
            (hasIcon || hasImage) && {
              top: radioButtonSpacing + radioButtonInnerSize,
              right: radioButtonSpacing + radioButtonInnerSize,
              left: 'auto' // To reset the value of 'left' to its default value, so that 'right' works
            },
          checked &&
            disabled && {
              borderColor: NeutralColors.gray60
            }
        ]
      }
    }
  };
};

// const CalloutContentStyles = {
//   root: {
//     // borderRadius: fluentBorderRadius, // waiting on child override ability before commenting this in
//     boxShadow: Depths.depth64
//   }
// };

const ComboBoxStyles = {
  root: {
    borderRadius: fluentBorderRadius // the bound input box
  },
  callout: {
    // Still requires to target calloutMain as well as it overlaps this element
    borderRadius: `0 0 ${fluentBorderRadius} ${fluentBorderRadius}`,
    overflow: 'hidden'
  }
  // subComponentStyles: {
  //   calloutContent: (props: ICalloutContentStyleProps) => ({
  //     root: {
  //       // borderRadius: fluentBorderRadius, // waiting on child override ability before commenting this in
  //       borderRadius: '0 0 20px 20px',
  //       boxShadow: Depths.depth64
  //     }
  //   })
  // }
};

const ContextualMenuStyles = {
  // root: {
  //   borderRadius: '0 0 20px 20px'
  // },
  subComponentStyles: {
    calloutContent: (props: ICalloutContentStyleProps) => ({
      root: {
        // borderRadius: fluentBorderRadius, // waiting on child override ability before commenting this in
        borderRadius: '0 0 20px 20px'
        // boxShadow: Depths.depth64
      }
    })
  }
};

const DialogStyles = {
  main: {
    selectors: {
      '.ms-Modal.ms-Dialog &': {
        boxShadow: Depths.depth64,
        borderRadius: fluentBorderRadius
      }
    }
  }
};

const DialogContentStyles = {
  title: {
    fontSize: FontSizes.size20,
    fontWeight: FontWeights.semibold,
    padding: '16px'
  },
  topButton: {
    padding: '16px 10px 0 0'
  },
  inner: {
    padding: '0 16px 16px'
  }
};

const DialogFooterStyles = {
  actions: {
    margin: '16px 0 0'
  }
};

const LabelStyles = {
  root: {
    fontWeight: FontWeights.semibold
  }
};
const ToggleStyles = {
  pill: {
    width: '40px',
    height: '20px',
    borderRadius: '10px',
    padding: '0 4px'
  },
  thumb: {
    width: '12px',
    height: '12px',
    borderRadius: '12px',
    borderColor: 'transparent'
  }
};

// Roll up all style overrides in a single "Fluent theme" object
export const FluentStyles = {
  Breadcrumb: {
    styles: BreadcrumbStyles
  },
  PrimaryButton: {
    styles: PrimaryButtonStyles
  },
  DefaultButton: {
    styles: DefaultButtonStyles
  },
  // CalloutContent: {
  //   styles: CalloutContentStyles
  // },
  CompoundButton: {
    styles: CompoundButtonStyles
  },
  Checkbox: {
    styles: CheckboxStyles
  },
  ChoiceGroupOption: {
    styles: ChoiceGroupOptionStyles
  },
  ComboBox: {
    styles: ComboBoxStyles
  },
  ContextualMenu: {
    styles: ContextualMenuStyles
  },
  Dialog: {
    styles: DialogStyles
  },
  DialogContent: {
    styles: DialogContentStyles
  },
  DialogFooter: {
    styles: DialogFooterStyles
  },
  Label: {
    styles: LabelStyles
  },
  Toggle: {
    styles: ToggleStyles
  }
};
