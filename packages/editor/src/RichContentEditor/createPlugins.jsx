import { composeDecorators } from 'draft-js-plugins-editor';
import createFocusPlugin from 'draft-js-focus-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';

const createPlugins = ({ plugins, config, helpers, theme, t, isMobile, anchorTarget, relValue, getEditorState, setEditorState }) => {
  const focusPlugin = createFocusPlugin();
  const dndPlugin = createBlockDndPlugin();

  const wixPluginsDecorators = composeDecorators(focusPlugin.decorator, dndPlugin.decorator);
  const wixPluginConfig = {
    decorator: wixPluginsDecorators,
    helpers, theme, t, isMobile, anchorTarget, relValue, getEditorState, setEditorState, ...config
  };
  const wixPlugins = (plugins || []).map(createPlugin => createPlugin(wixPluginConfig));

  let pluginButtons = [];
  let pluginTextButtonMappers = [];
  let pubsubs = [];
  wixPlugins.forEach(wixPlugin => {
    pluginButtons = [...pluginButtons, ...(wixPlugin.InsertPluginButtons || [])];
    pluginTextButtonMappers = [...pluginTextButtonMappers, ...(wixPlugin.TextButtonMapper ? [wixPlugin.TextButtonMapper] : [])];
    pubsubs = [...pubsubs, ...(wixPlugin.pubsub ? [wixPlugin.pubsub] : [])];
  });

  const pluginInstances = [
    focusPlugin,
    dndPlugin,
    ...wixPlugins,
  ];

  return {
    pluginInstances,
    pluginButtons,
    pluginTextButtonMappers,
    pubsubs
  };
};

export default createPlugins;
