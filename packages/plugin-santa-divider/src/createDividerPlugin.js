import { createBasePlugin, mergeStyles } from 'wix-rich-content-common';

import { DIVIDER_TYPE } from './constants';
import DividerComponent from './components/divider-component';
import createToolbar from './toolbar';
import Styles from './default-styles.scss';

const createSantaDividerPlugin = (config = {}) => {
  const { decorator, helpers, theme, isMobile, t, anchorTarget, relValue, divider: settings } = config;
  const styles = mergeStyles({ styles: Styles, theme });

  return createBasePlugin({
    component: DividerComponent,
    decorator,
    settings,
    theme,
    type: DIVIDER_TYPE,
    toolbar: createToolbar({
      helpers,
      styles,
      theme,
      t
    }),
    helpers,
    isMobile,
    anchorTarget,
    relValue,
    t,
  });
};

export { createSantaDividerPlugin, DIVIDER_TYPE };
