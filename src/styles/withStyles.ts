import { withStyles as withStylesWithoutDefault } from '@material-ui/styles';
import defaultTheme from './defaultTheme';
import { Theme } from '.';
import {
  ClassNameMap,
  WithStylesOptions,
  Styles,
  ClassKeyOfStyles,
} from '@material-ui/styles/withStyles';

export type WithStyles<
  StylesOrClassKey extends string | Styles<any, any, any> = string,
  IncludeTheme extends boolean | undefined = false
> = (IncludeTheme extends true ? { theme: Theme } : {}) & {
  classes: ClassNameMap<ClassKeyOfStyles<StylesOrClassKey>>;
};

function withStyles<
  ClassKey extends string,
  Options extends WithStylesOptions<Theme> = {},
  Props extends object = {}
>(styles: Styles<Theme, Props, ClassKey>, options?: Options) {
  return withStylesWithoutDefault(styles, {
    defaultTheme,
    ...options,
  });
}

export default withStyles;
