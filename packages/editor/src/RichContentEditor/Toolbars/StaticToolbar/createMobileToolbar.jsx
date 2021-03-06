import classNames from 'classnames';
import get from 'lodash/get';
import { decorateComponentWithProps, WixUtils } from 'wix-rich-content-common';
import createStaticToolbar from './createStaticToolbar';
import { AddPluginButton, MobileTextButtonList } from '../buttons';
import { getTextButtonsFromList, reducePluginTextButtons, reducePluginTextButtonNames, mergeButtonLists } from '../buttons/utils';
import toolbarStyles from '../../../../statics/styles/mobile-toolbar.scss';
import buttonStyles from '../../../../statics/styles/mobile-toolbar-button.scss';
import separatorStyles from '../../../../statics/styles/mobile-toolbar-separator.scss';

const createMobileToolbar = ({
  buttons, pluginTextButtonMappers, helpers, pubsub, getEditorState, setEditorState,
  anchorTarget, relValue, theme, t
}) => {
  const mobileTheme = getMobileTheme(theme);
  return createStaticToolbar({
    helpers,
    t,
    name: 'MobileToolbar',
    theme: mobileTheme,
    structure: getMobileButtons({ buttons, pluginTextButtonMappers, helpers, pubsub, getEditorState, setEditorState, mobileTheme, t }),
    anchorTarget,
    relValue,
    isMobile: true
  });
};

const getMobileTheme = theme => {
  const {
    toolbarStyles: toolbarTheme,
    buttonStyles: buttonTheme,
    separatorStyles: separatorTheme,
    ...rest
  } = theme || {};

  return {
    toolbarStyles: {
      toolbar: classNames(
        toolbarStyles.mobileToolbar,
        toolbarTheme && toolbarTheme.mobileToolbar,
        {
          [toolbarStyles.mobileToolbar_fixed]: !WixUtils.isiOS(),
          [toolbarTheme.mobileToolbar_fixed]: (toolbarTheme && toolbarTheme.mobileToolbar_fixed) && !WixUtils.isiOS(),
        }
      ),
      scrollableContainer: classNames(
        toolbarStyles.mobileToolbar_scrollableContainer,
        toolbarTheme && toolbarTheme.mobileToolbar_scrollableContainer
      ),
      buttons: classNames(
        toolbarStyles.mobileToolbar_buttons,
        toolbarTheme && toolbarTheme.mobileToolbar_buttons
      ),
      extend: classNames(
        toolbarStyles.mobileToolbar_extend,
        toolbarTheme && toolbarTheme.mobileToolbar_extend
      ),
      responsiveSpacer: toolbarStyles.mobileToolbar_responsiveSpacer,
      responsiveArrow: classNames(
        toolbarStyles.mobileToolbar_responsiveArrow,
        toolbarTheme && toolbarTheme.mobileToolbar_responsiveArrow
      ),
      responsiveArrowLeft: classNames(
        toolbarStyles.mobileToolbar_responsiveArrowLeft,
        toolbarTheme && toolbarTheme.mobileToolbar_responsiveArrowLeft
      ),
      responsiveArrowRight: classNames(
        toolbarStyles.mobileToolbar_responsiveArrowRight,
        toolbarTheme && toolbarTheme.mobileToolbar_responsiveArrowRight
      ),
      responsiveArrowLeft_icon: classNames( //eslint-disable-line camelcase
        toolbarStyles.mobileToolbar_responsiveArrowLeft_icon,
        toolbarTheme && toolbarTheme.mobileToolbar_responsiveArrowLeft_icon
      ),
      responsiveArrowRight_icon: classNames( //eslint-disable-line camelcase
        toolbarStyles.mobileToolbar_responsiveArrowRight_icon,
        toolbarTheme && toolbarTheme.mobileToolbar_responsiveArrowRight_icon
      ),
    },
    buttonStyles: {
      inlineToolbarButton_wrapper: classNames( //eslint-disable-line camelcase
        buttonStyles.mobileToolbarButton_wrapper,
        buttonTheme && buttonTheme.mobileToolbarButton_wrapper
      ),
      inlineToolbarButton: classNames(
        buttonStyles.mobileToolbarButton,
        buttonTheme && buttonTheme.mobileToolbarButton
      ),
      inlineToolbarButton_icon: classNames( //eslint-disable-line camelcase
        buttonStyles.mobileToolbarButton_icon,
        buttonTheme && buttonTheme.mobileToolbarButton_icon
      ),
    },
    separatorStyles: {
      separator: classNames(
        separatorStyles.mobileToolbarSeparator,
        separatorTheme && separatorTheme.mobileToolbarSeparator
      ),
    },
    ...rest
  };
};

const getMobileButtons = ({ buttons, pluginTextButtonMappers, helpers, pubsub, getEditorState, setEditorState, mobileTheme, t }) => {
  const pluginButtons = reducePluginTextButtons(pluginTextButtonMappers, buttonData => buttonData.isMobile !== false);
  const pluginButtonNames = reducePluginTextButtonNames(pluginTextButtonMappers, buttonData => buttonData.isMobile !== false);
  const mergedList = mergeButtonLists(MobileTextButtonList, pluginButtonNames, 'mobile');
  const requestedButtons = get(buttons, 'textButtons.mobile');
  const textButtons = Array.isArray(requestedButtons) ? [...requestedButtons] : [...mergedList];
  const addPluginIndex = textButtons.findIndex(b => b === 'AddPlugin');

  if (addPluginIndex !== -1) {
    textButtons.splice(addPluginIndex, 1);
  }

  const structure = getTextButtonsFromList({ buttons: textButtons, pluginButtons, theme: mobileTheme, isMobile: true, t });

  if (addPluginIndex !== -1) {
    const addAddPluginButton = buttons.pluginButtons && buttons.pluginButtons.length;
    if (addAddPluginButton) {
      structure.splice(addPluginIndex, 0, decorateComponentWithProps(AddPluginButton, {
        openModal: helpers.openModal,
        closeModal: helpers.closeModal,
        pluginButtons: buttons.pluginButtons,
        getEditorState,
        setEditorState,
        pubsub,
        t,
        theme: mobileTheme
      }));
    }
  }

  return structure;
};

export default createMobileToolbar;
