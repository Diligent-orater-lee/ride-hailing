import { OperatorFunction, Observable, filter, scan } from "rxjs"
import { RealtimeChanges } from "../interfaces/common-interfaces"

export function GetRealtimeValueChangeScanner<T = any>(): OperatorFunction<T, RealtimeChanges<T>> {
  return (source: Observable<T>) => source.pipe(
      filter(x => x !== null && x !== undefined),
      scan((acc: RealtimeChanges<T>, value: T) => {
          return {
              previousValue: acc.currentValue,
              currentValue: value
          };
      }, {
          previousValue: null,
          currentValue: null
      } as RealtimeChanges<T>)
  )
}
