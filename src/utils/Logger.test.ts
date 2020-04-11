import { removeUndefined } from './Logger';

test('removeUndefined removes undefined values from objects without issue', () => {
  const scenarios = [
    [{}, {}],
    [{ asd: 123 }, { asd: 123 }],
    [{ asd: 123, test: undefined }, { asd: 123 }],
    [{ nested: { a: 1, b: undefined, c: null } }, { nested: { a: 1, c: null } }],
    // Non objects are ignored, no thrown errors
    [undefined, undefined],
    [null, null],
    ['test', 'test'],
    [
      [1, 2, undefined],
      [1, 2, undefined],
    ],
  ];

  scenarios.map(([toRemove, expected]) => {
    const obj = toRemove;
    removeUndefined(obj);
    expect(obj).toStrictEqual(expected);
  });
});
