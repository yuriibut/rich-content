import classNames from 'classnames';
import get from 'lodash/get';
import createStaticToolbar from './createStaticToolbar';
import { DesktopTextButtonList } from '../buttons/';
import { getTextButtonsFromList, reducePluginTextButtons, reducePluginTextButtonNames, mergeButtonLists } from '../buttons/utils';
import { getStaticTextToolbarId } from '../toolbar-id';
import toolbarStyles from '../../../../statics/styles/text-static-toolbar.scss';
import separatorStyles from '../../../../statics/styles/text-static-toolbar-separator.scss';
import tooltipStyles from '../../../../statics/styles/tooltip.scss';

const getStaticTextTheme = theme => {
  const {
    toolbarStyles: toolbarTheme,
    buttonStyles: buttonTheme,
    separatorStyles: separatorTheme,
    ...rest
  } = theme || {};

  return {
    toolbarStyles: {
      toolbar: classNames(
        toolbarStyles.textToolbar,
        toolbarTheme && toolbarTheme.textToolbar,
      ),
      scrollableContainer: classNames(
        toolbarStyles.textToolbar_scrollableContainer,
        toolbarTheme && toolbarTheme.textToolbar_scrollableContainer,
        tooltipStyles.fixedTooltip
      ),
      buttons: classNames(
        toolbarStyles.textToolbar_buttons,
        toolbarTheme && toolbarTheme.textToolbar_buttons
      ),
      extend: classNames(
        toolbarStyles.textToolbar_extend,
        toolbarTheme && toolbarTheme.textToolbar_extend
      ),
      responsiveSpacer: toolbarStyles.textToolbar_responsiveSpacer,
      responsiveArrow: classNames(
        toolbarStyles.textToolbar_responsiveArrow,
        toolbarTheme && toolbarTheme.textToolbar_responsiveArrow
      ),
      responsiveArrowLeft: classNames(
        toolbarStyles.textToolbar_responsiveArrowLeft,
        toolbarTheme && toolbarTheme.textToolbar_responsiveArrowLeft
      ),
      responsiveArrowRight: classNames(
        toolbarStyles.textToolbar_responsiveArrowRight,
        toolbarTheme && toolbarTheme.textToolbar_responsiveArrowRight
      ),
      responsiveArrowLeft_icon: classNames( //eslint-disable-line camelcase
        toolbarStyles.textToolbar_responsiveArrowLeft_icon,
        toolbarTheme && toolbarTheme.textToolbar_responsiveArrowLeft_icon
      ),
      responsiveArrowRight_icon: classNames( //eslint-disable-line camelcase
        toolbarStyles.textToolbar_responsiveArrowRight_icon,
        toolbarTheme && toolbarTheme.textToolbar_responsiveArrowRight_icon
      ),
    },
    buttonStyles: {
      inlineToolbarButton_wrapper: buttonTheme && buttonTheme.textToolbarButton_wrapper, //eslint-disable-line camelcase
      inlineToolbarButton: buttonTheme && buttonTheme.textToolbarButton, //eslint-disable-line camelcase
      inlineToolbarButton_icon: buttonTheme && buttonTheme.textToolbarButton_icon, //eslint-disable-line camelcase
    },
    separatorStyles: {
      separator: classNames(
        separatorStyles.textToolbarSeparator,
        separatorTheme && separatorTheme.textToolbarSeparator
      ),
    },
    ...rest
  };
};

export default ({ buttons, pluginTextButtonMappers, pubsub, theme, isMobile, helpers, anchorTarget, relValue, t, refId }) => {
  const staticTextTheme = getStaticTextTheme(theme);

  const appendSeparator = ({ mergedList, sourceList, buttonData, formFactor }) => {
    if (mergedList.length === sourceList.length &&
      (!buttonData.position || buttonData.position[formFactor] === undefined ||
        buttonData.position[formFactor] < 0 || buttonData.position[formFactor] > mergedList.length)) {
      return [...mergedList, 'Separator'];
    }
    return mergedList;
  };

  const pluginButtons = reducePluginTextButtons(pluginTextButtonMappers);
  const pluginButtonNames = reducePluginTextButtonNames(pluginTextButtonMappers);
  const mergedList = mergeButtonLists(DesktopTextButtonList, pluginButtonNames, 'desktop', appendSeparator);
  const textButtons = get(buttons, 'desktop', mergedList);
  const structure = getTextButtonsFromList({ buttons: textButtons, pluginButtons, pubsub, theme: staticTextTheme, t });

  const id = getStaticTextToolbarId(refId);

  return createStaticToolbar({
    name: 'StaticTextToolbar',
    structure,
    pubsub,
    theme: staticTextTheme,
    isMobile,
    helpers,
    linkModal: true,
    anchorTarget,
    relValue,
    t,
    id
  });
};
