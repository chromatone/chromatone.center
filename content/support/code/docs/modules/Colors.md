[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / Colors

# Module: Colors

## Table of contents

### Variables

- [defaultScheme](Colors.md#defaultscheme)
- [scheme](Colors.md#scheme)

### Functions

- [calcBg](Colors.md#calcbg)
- [chromaColorMix](Colors.md#chromacolormix)
- [getColorInfo](Colors.md#getcolorinfo)
- [lchToHsl](Colors.md#lchtohsl)
- [levelColor](Colors.md#levelcolor)
- [noteColor](Colors.md#notecolor)

## Variables

### defaultScheme

• `Const` **defaultScheme**: `string`[]

#### Defined in

use/colors.ts:24

___

### scheme

• `Const` **scheme**: `any`

#### Defined in

use/colors.ts:26

## Functions

### calcBg

▸ **calcBg**(`i`, `bit`, `white?`, `black?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `i` | `any` | `undefined` |
| `bit` | `any` | `undefined` |
| `white` | `string` | `'hsla(0,0%,100%,0.3)'` |
| `black` | `string` | `'hsla(0,0%,10%,0.3)'` |

#### Returns

`string`

#### Defined in

use/colors.ts:49

___

### chromaColorMix

▸ **chromaColorMix**(`chroma`, `tonic`, `part?`): `Object`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `chroma` | `any` | `undefined` |
| `tonic` | `any` | `undefined` |
| `part` | `number` | `0.3` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `hsl` | `string` |
| `lch` | `string` |

#### Defined in

use/colors.ts:100

___

### getColorInfo

▸ **getColorInfo**(`color`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `color` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cmyk` | `string` |
| `dark` | `boolean` |
| `hex` | `string` |
| `hsl` | `string` |
| `lab` | `LabaColor` |
| `name` | `string` |
| `rgb` | `string` |

#### Defined in

use/colors.ts:73

___

### lchToHsl

▸ **lchToHsl**(`n?`, `total?`, `a?`, `s?`, `lightness?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `n` | `number` | `0` |
| `total` | `number` | `12` |
| `a` | `number` | `1` |
| `s` | `number` | `20` |
| `lightness` | `number` | `60` |

#### Returns

`string`

#### Defined in

use/colors.ts:65

___

### levelColor

▸ **levelColor**(`i?`, `n?`, `a?`, `s?`, `l?`, `reverse?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `i` | `number` | `0` |
| `n` | `number` | `3` |
| `a` | `number` | `0.5` |
| `s` | `number` | `0.8` |
| `l` | `number` | `0.5` |
| `reverse` | `boolean` | `false` |

#### Returns

`string`

#### Defined in

use/colors.ts:86

___

### noteColor

▸ **noteColor**(`pitch?`, `octave?`, `velocity?`, `alpha?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pitch` | `number` | `0` |
| `octave` | `number` | `2` |
| `velocity` | `number` | `1` |
| `alpha` | `number` | `1` |

#### Returns

`string`

#### Defined in

use/colors.ts:36
