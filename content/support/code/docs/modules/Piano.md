[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / Piano

# Module: Piano

## Table of contents

### Functions

- [init](Piano.md#init)
- [pianoAttack](Piano.md#pianoattack)
- [pianoOnce](Piano.md#pianoonce)
- [pianoRelease](Piano.md#pianorelease)
- [pianoReleaseAll](Piano.md#pianoreleaseall)
- [usePiano](Piano.md#usepiano)

## Functions

### init

▸ **init**(): `void`

#### Returns

`void`

#### Defined in

[use/piano.ts:16](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/piano.ts#L16)

___

### pianoAttack

▸ **pianoAttack**(`note?`, `velocity`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `note` | `string` | `"A4"` |
| `velocity` | `number` | `undefined` |

#### Returns

`void`

#### Defined in

[use/piano.ts:65](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/piano.ts#L65)

___

### pianoOnce

▸ **pianoOnce**(`note?`, `duration?`, `time`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `note` | `string` | `'A4'` |
| `duration` | `string` | `'8n'` |
| `time` | `string` | `undefined` |

#### Returns

`void`

#### Defined in

[use/piano.ts:60](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/piano.ts#L60)

___

### pianoRelease

▸ **pianoRelease**(`note?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `note` | `string` | `"A4"` |

#### Returns

`void`

#### Defined in

[use/piano.ts:70](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/piano.ts#L70)

___

### pianoReleaseAll

▸ **pianoReleaseAll**(): `void`

#### Returns

`void`

#### Defined in

[use/piano.ts:75](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/piano.ts#L75)

___

### usePiano

▸ **usePiano**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `attack` | (`note`: `string`, `velocity`: `number`) => `void` |
| `init` | () => `void` |
| `once` | (`note`: `string`, `duration`: `string`, `time`: `string`) => `void` |
| `piano` | `Sampler` |
| `release` | (`note`: `string`) => `void` |
| `releaseAll` | () => `void` |

#### Defined in

[use/piano.ts:11](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/piano.ts#L11)
