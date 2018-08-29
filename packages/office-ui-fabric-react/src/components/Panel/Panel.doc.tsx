import * as React from 'react';
import { PanelSmallRightExample } from './examples/Panel.SmallRight.Example';

import { IDocPageProps } from '../../common/DocPage.types';
import { PanelSmallLeftExample } from './examples/Panel.SmallLeft.Example';
import { PanelSmallFluidExample } from './examples/Panel.SmallFluid.Example';
import { PanelMediumExample } from './examples/Panel.Medium.Example';
import { PanelLargeExample } from './examples/Panel.Large.Example';
import { PanelLargeFixedExample } from './examples/Panel.LargeFixed.Example';
import { PanelExtraLargeExample } from './examples/Panel.ExtraLarge.Example';
import { PanelCustomExample } from './examples/Panel.Custom.Example';
import { PanelHiddenOnDismissExample } from './examples/Panel.HiddenOnDismiss.Example';
import { PanelLightDismissExample } from './examples/Panel.LightDismiss.Example';
import { PanelLightDismissCustomExample } from './examples/Panel.LightDismissCustom.Example';
import { PanelNonModalExample } from './examples/Panel.NonModal.Example';
import { PanelFooterExample } from './examples/Panel.Footer.Example';
import { PanelStatus } from './Panel.checklist';

const PanelSmallRightExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.SmallRight.Example.tsx') as string;
const PanelSmallRightExampleCodepen = require('!raw-loader!office-ui-fabric-react/lib/codepen/components/Panel/Panel.SmallRight.Example.Codepen.txt') as string;
const PanelSmallLeftExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.SmallLeft.Example.tsx') as string;
const PanelSmallFluidExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.SmallFluid.Example.tsx') as string;
const PanelMediumExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.Medium.Example.tsx') as string;
const PanelLargeExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.Large.Example.tsx') as string;
const PanelLargeFixedExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.LargeFixed.Example.tsx') as string;
const PanelExtraLargeExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.ExtraLarge.Example.tsx') as string;
const PanelCustomExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.Custom.Example.tsx') as string;
const PanelHiddenOnDismissExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.HiddenOnDismiss.Example.tsx') as string;
const PanelLightDismissExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.LightDismiss.Example.tsx') as string;
const PanelLightDismissCustomExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.LightDismissCustom.Example.tsx') as string;
const PanelNonModalExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.NonModal.Example.tsx') as string;
const PanelFooterExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Panel/examples/Panel.Footer.Example.tsx') as string;

export const PanelPageProps: IDocPageProps = {
  title: 'Panel',
  componentName: 'Panel',
  componentUrl:
    'https://github.com/OfficeDev/office-ui-fabric-react/tree/master/packages/office-ui-fabric-react/src/components/Panel',
  componentStatus: PanelStatus,
  examples: [
    {
      title: 'Panel - Small Panel, Anchored Right, Fixed Width',
      code: PanelSmallRightExampleCode,
      view: <PanelSmallRightExample />,
      codepenJS: PanelSmallRightExampleCodepen
    },
    {
      title: 'Panel - Small Panel, Anchored Left, Fixed Width',
      code: PanelSmallLeftExampleCode,
      view: <PanelSmallLeftExample />
    },
    {
      title: 'Panel - Small Panel, Full Screen, Fluid Width',
      code: PanelSmallFluidExampleCode,
      view: <PanelSmallFluidExample />
    },
    {
      title: 'Panel - Medium',
      code: PanelMediumExampleCode,
      view: <PanelMediumExample />
    },
    {
      title: 'Panel - Large',
      code: PanelLargeExampleCode,
      view: <PanelLargeExample />
    },
    {
      title: 'Panel - LargeFixed',
      code: PanelLargeFixedExampleCode,
      view: <PanelLargeFixedExample />
    },
    {
      title: 'Panel - Extra Large',
      code: PanelExtraLargeExampleCode,
      view: <PanelExtraLargeExample />
    },
    {
      title: 'Panel - Custom',
      code: PanelCustomExampleCode,
      view: <PanelCustomExample />
    },
    {
      title: 'Panel - Hidden on Dismiss',
      code: PanelHiddenOnDismissExampleCode,
      view: <PanelHiddenOnDismissExample />
    },
    {
      title: 'Panel - Light Dismiss',
      code: PanelLightDismissExampleCode,
      view: <PanelLightDismissExample />
    },
    {
      title: 'Panel - Custom Light Dismiss',
      code: PanelLightDismissCustomExampleCode,
      view: <PanelLightDismissCustomExample />
    },
    {
      title: 'Panel - Non-Modal',
      code: PanelNonModalExampleCode,
      view: <PanelNonModalExample />
    },
    {
      title: 'Panel - Footer',
      code: PanelFooterExampleCode,
      view: <PanelFooterExample />
    }
  ],
  propertiesTablesSources: [require<string>('!raw-loader!office-ui-fabric-react/src/components/Panel/Panel.types.ts')],
  overview: require<string>('!raw-loader!office-ui-fabric-react/src/components/Panel/docs/PanelOverview.md'),
  bestPractices: '',
  dos: require<string>('!raw-loader!office-ui-fabric-react/src/components/Panel/docs/PanelDos.md'),
  donts: require<string>('!raw-loader!office-ui-fabric-react/src/components/Panel/docs/PanelDonts.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true,
  allowNativeProps: true
};
