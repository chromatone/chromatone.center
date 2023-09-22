[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / Cast - the video broadcasting setup

# Module: Cast - the video broadcasting setup

## Table of contents

### Variables

- [cameras](Cast___the_video_broadcasting_setup.md#cameras)
- [cast](Cast___the_video_broadcasting_setup.md#cast)
- [currentCamera](Cast___the_video_broadcasting_setup.md#currentcamera)
- [currentMic](Cast___the_video_broadcasting_setup.md#currentmic)
- [devices](Cast___the_video_broadcasting_setup.md#devices)
- [fileNames](Cast___the_video_broadcasting_setup.md#filenames)
- [microphones](Cast___the_video_broadcasting_setup.md#microphones)
- [mimeExtMap](Cast___the_video_broadcasting_setup.md#mimeextmap)
- [mimeType](Cast___the_video_broadcasting_setup.md#mimetype)
- [recordCamera](Cast___the_video_broadcasting_setup.md#recordcamera)
- [recordingName](Cast___the_video_broadcasting_setup.md#recordingname)
- [showRecordingDialog](Cast___the_video_broadcasting_setup.md#showrecordingdialog)

### Functions

- [download](Cast___the_video_broadcasting_setup.md#download)
- [ensureDevicesListPermissions](Cast___the_video_broadcasting_setup.md#ensuredeviceslistpermissions)
- [getFilename](Cast___the_video_broadcasting_setup.md#getfilename)
- [getSupportedMimeTypes](Cast___the_video_broadcasting_setup.md#getsupportedmimetypes)
- [useRecording](Cast___the_video_broadcasting_setup.md#userecording)

## Variables

### cameras

• **cameras**: `ComputedRef`<`MediaDeviceInfo`[]\>

#### Defined in

[use/cast.ts:51](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L51)

___

### cast

• `Const` **cast**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `recorderCamera` | `ShallowRef`<`any`\> |
| `recorderSlides` | `ShallowRef`<`any`\> |
| `recording` | `Ref`<`boolean`\> |
| `recordingTime` | `ComputedRef`<`number`\> |
| `showAvatar` | `Ref`<`boolean`\> |
| `startRecording` | (`customConfig?`: {}) => `Promise`<`void`\> |
| `stopRecording` | () => `Promise`<`void`\> |
| `streamCamera` | `ShallowRef`<`any`\> |
| `streamCapture` | `ShallowRef`<`any`\> |
| `streamSlides` | `ShallowRef`<`any`\> |
| `toggleAvatar` | () => `Promise`<`void`\> |
| `toggleRecording` | () => `void` |

#### Defined in

[use/cast.ts:273](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L273)

___

### currentCamera

• `Const` **currentCamera**: `RemovableRef`<`string`\>

#### Defined in

[use/cast.ts:9](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L9)

___

### currentMic

• `Const` **currentMic**: `RemovableRef`<`string`\>

#### Defined in

[use/cast.ts:10](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L10)

___

### devices

• **devices**: `Ref`<`MediaDeviceInfo`[]\>

#### Defined in

[use/cast.ts:50](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L50)

___

### fileNames

• `Const` **fileNames**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `camera` | `string` |
| `screen` | `string` |

#### Defined in

[use/cast.ts:42](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L42)

___

### microphones

• **microphones**: `ComputedRef`<`MediaDeviceInfo`[]\>

#### Defined in

[use/cast.ts:52](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L52)

___

### mimeExtMap

• `Const` **mimeExtMap**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `video/webm` | `string` |
| `video/webm;codecs=h264` | `string` |
| `video/x-matroska;codecs=avc1` | `string` |

#### Defined in

[use/cast.ts:17](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L17)

___

### mimeType

• `Const` **mimeType**: `RemovableRef`<`string`\>

#### Defined in

[use/cast.ts:15](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L15)

___

### recordCamera

• `Const` **recordCamera**: `Ref`<`boolean`\>

#### Defined in

[use/cast.ts:14](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L14)

___

### recordingName

• `Const` **recordingName**: `Ref`<`string`\>

#### Defined in

[use/cast.ts:13](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L13)

___

### showRecordingDialog

• `Const` **showRecordingDialog**: `Ref`<`any`\>

#### Defined in

[use/cast.ts:11](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L11)

## Functions

### download

▸ **download**(`name`, `url`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `url` | `any` |

#### Returns

`void`

#### Defined in

[use/cast.ts:67](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L67)

___

### ensureDevicesListPermissions

▸ **ensureDevicesListPermissions**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

node_modules/.pnpm/@vueuse+core@10.4.1_vue@3.3.4/node_modules/@vueuse/core/index.d.cts:1404

___

### getFilename

▸ **getFilename**(`media`, `mimeType?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `media` | `string` |
| `mimeType?` | `string` |

#### Returns

`string`

#### Defined in

[use/cast.ts:23](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L23)

___

### getSupportedMimeTypes

▸ **getSupportedMimeTypes**(): `string`[]

#### Returns

`string`[]

#### Defined in

[use/cast.ts:35](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L35)

___

### useRecording

▸ **useRecording**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `recorderCamera` | `ShallowRef`<`any`\> |
| `recorderSlides` | `ShallowRef`<`any`\> |
| `recording` | `Ref`<`boolean`\> |
| `recordingTime` | `ComputedRef`<`number`\> |
| `showAvatar` | `Ref`<`boolean`\> |
| `startRecording` | (`customConfig?`: {}) => `Promise`<`void`\> |
| `stopRecording` | () => `Promise`<`void`\> |
| `streamCamera` | `ShallowRef`<`any`\> |
| `streamCapture` | `ShallowRef`<`any`\> |
| `streamSlides` | `ShallowRef`<`any`\> |
| `toggleAvatar` | () => `Promise`<`void`\> |
| `toggleRecording` | () => `void` |

#### Defined in

[use/cast.ts:76](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/cast.ts#L76)
