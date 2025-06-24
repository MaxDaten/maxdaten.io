import '$lib/scss/global.scss';
import { themes } from 'storybook/theming';

/** @type { import('@storybook/sveltekit').Preview } */
const preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      theme: themes.dark,
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;