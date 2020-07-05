export type StandardProps<C, ClassKey extends string, Removals extends keyof C = never> = Omit<
  C,
  'classes' | Removals
> & {
  classes: Record<ClassKey, string>;
};

export { default as Button } from './Button';

export { default as ButtonBase } from './ButtonBase';
export * from './ButtonBase';

export { default as ButtonTab } from './ButtonTab';
export * from './ButtonTab';

export { default as ButtonTabs } from './ButtonTabs';
export * from './ButtonTabs';

export { default as Checkbox } from './Checkbox';
export * from './Checkbox';

export { default as Flex } from './Flex';

export { default as FormControl } from './FormControl';

export { default as FormControlLabel } from './FormControlLabel';

export { default as FormGroup } from './FormGroup';

export { default as FormLabel } from './FormLabel';

export { default as Input } from './Input';

export { default as Paper } from './Paper';
export * from './Paper';

export { default as Radio } from './Radio';
export * from './Radio';

export { default as RadioGroup } from './RadioGroup';
export * from './RadioGroup';
