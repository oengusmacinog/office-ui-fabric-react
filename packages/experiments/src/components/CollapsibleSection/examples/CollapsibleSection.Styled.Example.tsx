import * as React from 'react';
import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { ITheme, createTheme, DefaultPalette } from 'office-ui-fabric-react/lib/Styling';
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';
import {
  CollapsibleSection,
  CollapsibleSectionStateless,
  ICollapsibleSectionStyleProps,
  ICollapsibleSectionStyles,
  ICollapsibleSectionTitleStyleProps,
  ICollapsibleSectionTitleStyles
} from '@uifabric/experiments/lib/CollapsibleSection';

function getPropStyles(props: ICollapsibleSectionStyleProps): Partial<ICollapsibleSectionStyles> {
  const { theme } = props;
  return {
    root: [
      {
        background: theme.semanticColors.inputBackground
      }
    ],
    body: [
      theme.fonts.small,
      {
        background: theme.semanticColors.disabledBackground
      }
    ]
  };
}

function getCustomizerStyles(props: ICollapsibleSectionStyleProps): Partial<ICollapsibleSectionStyles> {
  const { theme } = props;
  return {
    body: [
      {
        color: theme.semanticColors.link
      }
    ]
  };
}

function getPropTitleStyles(props: ICollapsibleSectionTitleStyleProps): Partial<ICollapsibleSectionTitleStyles> {
  const { theme } = props;
  return {
    text: [theme.fonts.large]
  };
}

function getCustomizerTitleStyles(props: ICollapsibleSectionTitleStyleProps): Partial<ICollapsibleSectionTitleStyles> {
  const { theme } = props;
  return {
    icon: { color: theme.semanticColors.link },
    text: { color: theme.semanticColors.link }
  };
}

const csCustomizerTheme: ITheme = createTheme({
  semanticColors: {
    disabledBackground: DefaultPalette.themeLight,
    inputBackground: DefaultPalette.themeLighter
  }
});

const csPropTheme: ITheme = createTheme({
  semanticColors: {
    disabledBackground: DefaultPalette.themeDarker,
    inputBackground: DefaultPalette.themeDark
  }
});

export class CollapsibleSectionStyledExample extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <div>
        <p>
          This is a demonstration of the various levels of theming and styling that have effect on created components,
          with and without state. Themes and styles should have priority based on how locally they are defined:
          individual props as highest priority followed by contextual (Customizer) and finally global.
        </p>
        <p>
          If everything is working correctly color gradients should gradually get darker within each type of component
          with any variant having Theme prop looking identical.
        </p>
        <p>
          <b>Stateful Components</b>
        </p>
        <FocusZone>
          <CollapsibleSection
            key={1}
            defaultCollapsed={false}
            titleProps={{
              text: `No Styling`
            }}
          >
            Body
          </CollapsibleSection>
          <br />
          <CollapsibleSection
            key={2}
            defaultCollapsed={false}
            titleProps={{
              text: `Prop Styles`,
              styles: getPropTitleStyles
            }}
            styles={getPropStyles}
          >
            Body
          </CollapsibleSection>
          <br />
          <Customizer
            scopedSettings={{
              CollapsibleSection: { styles: getCustomizerStyles },
              CollapsibleSectionTitle: { styles: getCustomizerTitleStyles }
            }}
          >
            <CollapsibleSection
              key={3}
              defaultCollapsed={false}
              titleProps={{
                text: `Prop Styles + Customizer Styles`,
                styles: getPropTitleStyles
              }}
              styles={getPropStyles}
            >
              Body
            </CollapsibleSection>
          </Customizer>
          <br />
          <Customizer settings={{ theme: csCustomizerTheme }}>
            <CollapsibleSection
              key={4}
              defaultCollapsed={false}
              titleProps={{
                text: `Prop Styles + Customizer Theme`,
                styles: getPropTitleStyles
              }}
              styles={getPropStyles}
            >
              Body
            </CollapsibleSection>
          </Customizer>
          <br />
          <CollapsibleSection
            key={5}
            defaultCollapsed={false}
            titleProps={{
              text: `Prop Styles + Prop Theme`,
              styles: getPropTitleStyles
            }}
            styles={getPropStyles}
            theme={csPropTheme}
          >
            Body
          </CollapsibleSection>
          <br />
          <Customizer settings={{ theme: csCustomizerTheme }}>
            <CollapsibleSection
              key={6}
              defaultCollapsed={false}
              titleProps={{
                text: `Prop Styles + Customizer Theme + Prop Theme`,
                styles: getPropTitleStyles
              }}
              styles={getPropStyles}
              theme={csPropTheme}
            >
              Body
            </CollapsibleSection>
          </Customizer>
          <p>
            <b>Stateless Components</b>
          </p>
          <CollapsibleSectionStateless
            key={7}
            defaultCollapsed={false}
            titleProps={{
              text: `No Styling`
            }}
          >
            Body
          </CollapsibleSectionStateless>
          <br />
          <CollapsibleSectionStateless
            key={8}
            defaultCollapsed={false}
            titleProps={{
              text: `Prop Styles`,
              styles: getPropTitleStyles
            }}
            styles={getPropStyles}
          >
            Body
          </CollapsibleSectionStateless>
          <br />
          <Customizer
            scopedSettings={{
              CollapsibleSection: { styles: getCustomizerStyles },
              CollapsibleSectionTitle: { styles: getCustomizerTitleStyles }
            }}
          >
            <CollapsibleSectionStateless
              key={9}
              defaultCollapsed={false}
              titleProps={{
                text: `Prop Styles + Customizer Styles`,
                styles: getPropTitleStyles
              }}
              styles={getPropStyles}
            >
              Body
            </CollapsibleSectionStateless>
          </Customizer>
          <br />
          <Customizer settings={{ theme: csCustomizerTheme }}>
            <CollapsibleSectionStateless
              key={10}
              defaultCollapsed={false}
              titleProps={{
                text: `Prop Styles + Customizer Theme`,
                styles: getPropTitleStyles
              }}
              styles={getPropStyles}
            >
              Body
            </CollapsibleSectionStateless>
          </Customizer>
          <br />
          <CollapsibleSectionStateless
            key={11}
            defaultCollapsed={false}
            titleProps={{
              text: `Prop Styles + Prop Theme`,
              styles: getPropTitleStyles
            }}
            styles={getPropStyles}
            theme={csPropTheme}
          >
            Body
          </CollapsibleSectionStateless>
          <br />
          <Customizer settings={{ theme: csCustomizerTheme }}>
            <CollapsibleSectionStateless
              key={12}
              defaultCollapsed={false}
              titleProps={{
                text: `Prop Styles + Customizer Theme + Prop Theme`,
                styles: getPropTitleStyles
              }}
              styles={getPropStyles}
              theme={csPropTheme}
            >
              Body
            </CollapsibleSectionStateless>
          </Customizer>
        </FocusZone>
      </div>
    );
  }
}
