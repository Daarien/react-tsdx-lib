import React from 'react';
import debounce from '../utils/debounce';

export interface TextareaAutosizeProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Maximum number of rows to display.
   */
  rowsMax?: number;
  /**
   * Minimum number of rows to display.
   */
  rowsMin?: number;
}

function getStyleValue(computedStyle, property) {
  return parseInt(computedStyle[property], 10) || 0;
}

const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

const styles: Record<string, React.CSSProperties> = {
  /* Styles applied to the shadow textarea element. */
  shadow: {
    // Visibility needed to hide the extra text area on iPads
    visibility: 'hidden',
    // Remove from the content flow
    position: 'absolute',
    // Ignore the scrollbar width
    overflow: 'hidden',
    height: 0,
    top: 0,
    left: 0,
    // Create a new layer, increase the isolation of the computed values
    transform: 'translateZ(0)',
  },
};

const TextareaAutosize = React.forwardRef<HTMLTextAreaElement>(function TextareaAutosize(
  props: TextareaAutosizeProps,
  ref
) {
  const { onChange, rows, rowsMax, rowsMin: rowsMinProp = 1, style, value, ...other } = props;

  const rowsMin = rows || rowsMinProp;

  const { current: isControlled } = React.useRef(value != null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const shadowRef = React.useRef<HTMLTextAreaElement>(null);
  const renders = React.useRef(0);
  const [state, setState] = React.useState({} as { outerHeightStyle: number; overflow: boolean });

  const syncHeight = React.useCallback(() => {
    const input = inputRef.current;
    const computedStyle = window.getComputedStyle(input!);

    const inputShallow = shadowRef.current!;
    inputShallow!.style.width = computedStyle.width;
    inputShallow!.value = input?.value || props.placeholder || 'x';
    if (inputShallow.value.slice(-1) === '\n') {
      // Certain fonts which overflow the line height will cause the textarea
      // to report a different scrollHeight depending on whether the last line
      // is empty. Make it non-empty to avoid this issue.
      inputShallow.value += ' ';
    }

    const boxSizing = computedStyle['box-sizing'];
    const padding =
      getStyleValue(computedStyle, 'padding-bottom') + getStyleValue(computedStyle, 'padding-top');
    const border =
      getStyleValue(computedStyle, 'border-bottom-width') +
      getStyleValue(computedStyle, 'border-top-width');

    // The height of the inner content
    const innerHeight = inputShallow.scrollHeight - padding;

    // Measure height of a textarea with a single row
    inputShallow.value = 'x';
    const singleRowHeight = inputShallow.scrollHeight - padding;

    // The height of the outer content
    let outerHeight = innerHeight;

    if (rowsMin) {
      outerHeight = Math.max(Number(rowsMin) * singleRowHeight, outerHeight);
    }
    if (rowsMax) {
      outerHeight = Math.min(Number(rowsMax) * singleRowHeight, outerHeight);
    }
    outerHeight = Math.max(outerHeight, singleRowHeight);

    // Take the box sizing into account for applying this value as a style.
    const outerHeightStyle = outerHeight + (boxSizing === 'border-box' ? padding + border : 0);
    const overflow = Math.abs(outerHeight - innerHeight) <= 1;

    setState(prevState => {
      // Need a large enough difference to update the height.
      // This prevents infinite rendering loop.
      if (
        renders.current < 20 &&
        ((outerHeightStyle > 0 &&
          Math.abs((prevState.outerHeightStyle || 0) - outerHeightStyle) > 1) ||
          prevState.overflow !== overflow)
      ) {
        renders.current += 1;
        return {
          overflow,
          outerHeightStyle,
        };
      }

      if (process.env.NODE_ENV !== 'production') {
        if (renders.current === 20) {
          console.error(
            [
              'Material-UI: Too many re-renders. The layout is unstable.',
              'TextareaAutosize limits the number of renders to prevent an infinite loop.',
            ].join('\n')
          );
        }
      }

      return prevState;
    });
  }, [rowsMax, rowsMin, props.placeholder]);

  React.useEffect(() => {
    const handleResize = debounce(() => {
      renders.current = 0;
      syncHeight();
    });

    window.addEventListener('resize', handleResize);
    return () => {
      handleResize.clear();
      window.removeEventListener('resize', handleResize);
    };
  }, [syncHeight]);

  useEnhancedEffect(() => {
    syncHeight();
  });

  React.useEffect(() => {
    renders.current = 0;
  }, [value]);

  const handleChange = event => {
    renders.current = 0;

    if (!isControlled) {
      syncHeight();
    }

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <React.Fragment>
      <textarea
        value={value}
        onChange={handleChange}
        ref={ref}
        // Apply the rows prop to get a "correct" first SSR paint
        rows={rowsMin}
        style={{
          height: state.outerHeightStyle,
          // Need a large enough difference to allow scrolling.
          // This prevents infinite rendering loop.
          overflow: state.overflow ? 'hidden' : undefined,
          ...style,
        }}
        {...other}
      />
      <textarea
        aria-hidden
        className={props.className}
        readOnly
        ref={shadowRef}
        tabIndex={-1}
        style={{ ...styles.shadow, ...style }}
      />
    </React.Fragment>
  );
});

export default TextareaAutosize;