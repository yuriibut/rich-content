import CodeUtils from 'draft-js-code';
import merge from 'lodash/merge';
import { createBasePlugin } from 'wix-rich-content-common';
import { CODE_BLOCK_TYPE } from './types';
import PrismDecorator from './PrismDecorator';
import createCodeBlockToolbar from './toolbar/createCodeBlockToolbar';

const defaultSettings = {
  position: {
    mobile: 7,
  },
};

const createUnderlyingPlugin = ({ theme }) => ({
  keyBindingFn: (event, { getEditorState }) => {
    if (CodeUtils.hasSelectionInBlock(getEditorState())) {
      return CodeUtils.getKeyBinding(event);
    }
  },

  handleKeyCommand: (command, editorState, { setEditorState }) => {
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      const newState = CodeUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEditorState(newState);
        return 'handled';
      }
    }
    return 'not-handled';
  },

  handleReturn: (event, editorState, { setEditorState }) => {
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      setEditorState(CodeUtils.handleReturn(event, editorState));
      return 'handled';
    }
    return 'not-handled';
  },

  onTab: (event, { getEditorState, setEditorState }) => {
    const editorState = getEditorState();
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      let newState;
      if (event.shiftKey) {
        // since backspace removes tabs in CodeUtils
        // https://github.com/SamyPesse/draft-js-code/blob/9783c0f6bbedda6b7089712f9c657a72fdae636d/lib/handleKeyCommand.js#L11
        event.preventDefault();
        newState = CodeUtils.handleKeyCommand(editorState, 'backspace');
      } else {
        newState = CodeUtils.onTab(event, editorState);
      }
      if (newState) {
        setEditorState(newState);
        return 'handled';
      }
    }
    return 'not-handled';
  },

  decorators: [new PrismDecorator(theme)],
});

const createCodeBlockPlugin = (config = {}) => {
  const type = CODE_BLOCK_TYPE;
  const {
    decorator,
    helpers,
    theme,
    isMobile,
    t,
    anchorTarget,
    relValue,
    getEditorState,
    setEditorState,
    codeBlock: userSettings = {},
  } = config;
  const settings = merge(defaultSettings, userSettings);
  const plugin = createUnderlyingPlugin({ theme });
  const toolbar = createCodeBlockToolbar({
    helpers,
    theme,
    isMobile,
    t,
    anchorTarget,
    relValue,
    getEditorState,
    setEditorState,
    settings,
  });

  return createBasePlugin(
    {
      decorator,
      theme,
      toolbar,
      type,
      helpers,
      isMobile,
      anchorTarget,
      relValue,
      t,
    },
    plugin,
  );
};

export { createCodeBlockPlugin };
