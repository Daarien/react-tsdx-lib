import React from 'react';
import setRef from './setRef';

export default function useForkRef(
  refA: ((instance: any | null) => void) | React.RefObject<any> | null | undefined,
  refB: ((instance: any | null) => void) | React.RefObject<any> | null | undefined
) {
  /**
   * This will create a new function if the ref props change and are defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior
   */
  return React.useMemo(() => {
    if (refA == null && refB == null) {
      return null;
    }
    return refValue => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}
