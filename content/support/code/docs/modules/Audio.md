[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / Audio

# Module: Audio

**`Description`**

Main audio bus controller

## Table of contents

### Interfaces

- [AudioInterface](../interfaces/Audio.AudioInterface.md)
- [MasterInterface](../interfaces/Audio.MasterInterface.md)

### Variables

- [channels](Audio.md#channels)
- [master](Audio.md#master)

### Functions

- [createChannel](Audio.md#createchannel)
- [initGetUserMedia](Audio.md#initgetusermedia)
- [useAudio](Audio.md#useaudio)

## Variables

### channels

• `Const` **channels**: `Record`<`string`, `Limiter`\>

#### Defined in

use/audio.ts:37

___

### master

• `Const` **master**: [`MasterInterface`](../interfaces/Audio.MasterInterface.md)

#### Defined in

use/audio.ts:35

## Functions

### createChannel

▸ **createChannel**(`title?`, `options?`): `Limiter`

#### Parameters

| Name | Type |
| :------ | :------ |
| `title` | `string` |
| `options?` | `LimiterOptions` |

#### Returns

`Limiter`

#### Defined in

use/audio.ts:79

___

### initGetUserMedia

▸ **initGetUserMedia**(): `void`

#### Returns

`void`

#### Defined in

use/audio.ts:87

___

### useAudio

▸ **useAudio**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `audio` | [`AudioInterface`](../interfaces/Audio.AudioInterface.md) |
| `channels` | `Record`<`string`, `Limiter`\> |
| `master` | [`MasterInterface`](../interfaces/Audio.MasterInterface.md) |

#### Defined in

use/audio.ts:39
