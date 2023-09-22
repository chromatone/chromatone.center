[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / Audio

# Module: Audio

**`Description`**

Main audio bus controller

## Table of contents

### Variables

- [channels](Audio.md#channels)
- [master](Audio.md#master)

### Functions

- [createChannel](Audio.md#createchannel)
- [initGetUserMedia](Audio.md#initgetusermedia)
- [useAudio](Audio.md#useaudio)

## Variables

### channels

• `Const` **channels**: `Record`<`string`, { `channel`: `Limiter` ; `volume`: `Volume`  }\>

#### Defined in

[use/audio.ts:35](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/audio.ts#L35)

___

### master

• `Const` **master**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `context?` | `AnyAudioContext` |
| `destination?` | typeof `Destination` |
| `limiter?` | `Limiter` |
| `meter?` | `Meter` |
| `reverb?` | `Reverb` |
| `stream?` | `MediaStreamAudioDestinationNode` |

#### Defined in

[use/audio.ts:26](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/audio.ts#L26)

## Functions

### createChannel

▸ **createChannel**(`title?`, `options?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `title` | `string` |
| `options?` | `LimiterOptions` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `channel` | `Limiter` |
| `volume` | `Volume` |

#### Defined in

[use/audio.ts:76](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/audio.ts#L76)

___

### initGetUserMedia

▸ **initGetUserMedia**(): `void`

#### Returns

`void`

#### Defined in

[use/audio.ts:87](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/audio.ts#L87)

___

### useAudio

▸ **useAudio**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `audio` | { `initiated`: `boolean` ; `meter`: `number` \| `number`[] ; `mute`: `boolean` ; `volume`: `number`  } |
| `audio.initiated` | `boolean` |
| `audio.meter` | `number` \| `number`[] |
| `audio.mute` | `boolean` |
| `audio.volume` | `number` |
| `channels` | `Record`<`string`, { `channel`: `Limiter` ; `volume`: `Volume`  }\> |
| `master` | { `context?`: `AnyAudioContext` ; `destination?`: `Destination` ; `limiter?`: `Limiter` ; `meter?`: `Meter` ; `reverb?`: `Reverb` ; `stream?`: `MediaStreamAudioDestinationNode`  } |
| `master.context?` | `AnyAudioContext` |
| `master.destination?` | `Destination` |
| `master.limiter?` | `Limiter` |
| `master.meter?` | `Meter` |
| `master.reverb?` | `Reverb` |
| `master.stream?` | `MediaStreamAudioDestinationNode` |

#### Defined in

[use/audio.ts:37](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/audio.ts#L37)
