[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / Synth

# Module: Synth

## Table of contents

### Variables

- [quantizeModes](Synth.md#quantizemodes)
- [synth](Synth.md#synth)

### Functions

- [synthAttack](Synth.md#synthattack)
- [synthInit](Synth.md#synthinit)
- [synthOnce](Synth.md#synthonce)
- [synthRelease](Synth.md#synthrelease)
- [synthReleaseAll](Synth.md#synthreleaseall)
- [useSynth](Synth.md#usesynth)

## Variables

### quantizeModes

• `Const` **quantizeModes**: `string`[]

#### Defined in

[use/synth.ts:14](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/synth.ts#L14)

___

### synth

• `Const` **synth**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `compressor` | `Compressor` |
| `delay` | `Delay` |
| `pan` | `AutoPanner` |
| `params` | `any` |
| `poly` | `PolySynth` |
| `reverb` | `Reverb` |
| `state` | `any` |
| `widener` | `StereoWidener` |

#### Defined in

[use/synth.ts:16](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/synth.ts#L16)

## Functions

### synthAttack

▸ **synthAttack**(`note`, `velocity?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `string` \| `number` \| `string`[] |
| `velocity?` | `number` |

#### Returns

`void`

#### Defined in

[use/synth.ts:118](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/synth.ts#L118)

___

### synthInit

▸ **synthInit**(): `void`

#### Returns

`void`

#### Defined in

[use/synth.ts:94](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/synth.ts#L94)

___

### synthOnce

▸ **synthOnce**(`note`, `duration?`, `time?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `note` | `string` \| `number` \| `string`[] | `undefined` |
| `duration` | `string` \| `number` | `'16n'` |
| `time?` | `string` \| `number` | `undefined` |

#### Returns

`void`

#### Defined in

[use/synth.ts:112](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/synth.ts#L112)

___

### synthRelease

▸ **synthRelease**(`note`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `any` |

#### Returns

`void`

#### Defined in

[use/synth.ts:123](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/synth.ts#L123)

___

### synthReleaseAll

▸ **synthReleaseAll**(): `void`

#### Returns

`void`

#### Defined in

[use/synth.ts:128](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/synth.ts#L128)

___

### useSynth

▸ **useSynth**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `attack` | (`note`: `string` \| `number` \| `string`[], `velocity?`: `number`) => `void` |
| `init` | () => `void` |
| `once` | (`note`: `string` \| `number` \| `string`[], `duration`: `string` \| `number`, `time?`: `string` \| `number`) => `void` |
| `release` | (`note`: `any`) => `void` |
| `releaseAll` | () => `void` |
| `synth` | { `compressor`: `Compressor` ; `delay`: `Delay` ; `pan`: `AutoPanner` ; `params`: `any` ; `poly`: `PolySynth`<`Synth`<`SynthOptions`\>\> ; `reverb`: `Reverb` ; `state`: `any` ; `widener`: `StereoWidener`  } |
| `synth.compressor` | `Compressor` |
| `synth.delay` | `Delay` |
| `synth.pan` | `AutoPanner` |
| `synth.params` | `any` |
| `synth.poly` | `PolySynth`<`Synth`<`SynthOptions`\>\> |
| `synth.reverb` | `Reverb` |
| `synth.state` | `any` |
| `synth.widener` | `StereoWidener` |

#### Defined in

[use/synth.ts:62](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/synth.ts#L62)
