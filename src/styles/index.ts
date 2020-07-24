import { Theme } from '@material-ui/core/styles/createMuiTheme';

export { Theme };

export { default as withStyles, WithStyles, Styles } from './withStyles';

export type Classes<T extends string> = Record<T, string>;
