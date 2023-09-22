[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / Tempo

# Module: Tempo

## Table of contents

### Variables

- [tempo](Tempo.md#tempo)

### Functions

- [tap](Tempo.md#tap)
- [useTempo](Tempo.md#usetempo)

## Variables

### tempo

• `Const` **tempo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blink` | `boolean` |
| `bpm` | `MaybeRef`<`number`\> |
| `clock?` | `number` |
| `color` | `MaybeRef`<`string`\> |
| `digit` | `MaybeRef`<`number`\> |
| `hz` | `MaybeRef`<`string`\> |
| `initialized` | `boolean` |
| `metre` | { `num`: `MaybeRef`<`string`\> ; `over`: `number` ; `under`: `number`  } |
| `metre.num` | `MaybeRef`<`string`\> |
| `metre.over` | `number` |
| `metre.under` | `number` |
| `midiClock` | `MaybeRef`<`boolean`\> |
| `mute` | `MaybeRef`<`boolean`\> |
| `note` | `MaybeRef`<`string`\> |
| `pitch` | `MaybeRef`<`number`\> |
| `playing` | `boolean` |
| `position` | `string` |
| `progress` | `number` |
| `set` | (`diff`: `number`) => `void` |
| `started` | `boolean` |
| `stopped` | `boolean` \| `number` |
| `tabSync` | `MaybeRef`<`boolean`\> |
| `tap` | { `bpm`: `number` ; `diff`: `number` ; `last`: `number` ; `tap`: `Function` ; `timeout`: `number` ; `times`: `number`[]  } |
| `tap.bpm` | `number` |
| `tap.diff` | `number` |
| `tap.last` | `number` |
| `tap.tap` | `Function` |
| `tap.timeout` | `number` |
| `tap.times` | `number`[] |
| `ticks` | `number` |
| `volume` | `MaybeRef`<`number`\> |

#### Defined in

[use/tempo.ts:19](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/tempo.ts#L19)

## Functions

### tap

▸ **tap**(): `void`

#### Returns

`void`

#### Defined in

[use/tempo.ts:252](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/tempo.ts#L252)

___

### useTempo

▸ **useTempo**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `blink` | `boolean` |
| `bpm` | `MaybeRef`<`number`\> |
| `clock?` | `number` |
| `color` | `MaybeRef`<`string`\> |
| `digit` | `MaybeRef`<`number`\> |
| `hz` | `MaybeRef`<`string`\> |
| `initialized` | `boolean` |
| `metre` | { `num`: `MaybeRef`<`string`\> ; `over`: `number` ; `under`: `number`  } |
| `metre.num` | `MaybeRef`<`string`\> |
| `metre.over` | `number` |
| `metre.under` | `number` |
| `midiClock` | `MaybeRef`<`boolean`\> |
| `mute` | `MaybeRef`<`boolean`\> |
| `note` | `MaybeRef`<`string`\> |
| `pitch` | `MaybeRef`<`number`\> |
| `playing` | `boolean` |
| `position` | `string` |
| `progress` | `number` |
| `set` | (`diff`: `number`) => `void` |
| `started` | `boolean` |
| `stopped` | `number` \| `boolean` |
| `tabSync` | `MaybeRef`<`boolean`\> |
| `tap` | { `bpm`: `number` ; `diff`: `number` ; `last`: `number` ; `tap`: `Function` ; `timeout`: `number` ; `times`: `number`[]  } |
| `tap.bpm` | `number` |
| `tap.diff` | `number` |
| `tap.last` | `number` |
| `tap.tap` | `Function` |
| `tap.timeout` | `number` |
| `tap.times` | `number`[] |
| `ticks` | `number` |
| `volume` | `MaybeRef`<`number`\> |

#### Defined in

[use/tempo.ts:99](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/tempo.ts#L99)
