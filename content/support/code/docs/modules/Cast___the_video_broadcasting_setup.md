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

use/cast.ts:51

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

use/cast.ts:273

___

### currentCamera

• `Const` **currentCamera**: `RemovableRef`<`string`\>

#### Defined in

use/cast.ts:9

___

### currentMic

• `Const` **currentMic**: `RemovableRef`<`string`\>

#### Defined in

use/cast.ts:10

___

### devices

• **devices**: `Ref`<`MediaDeviceInfo`[]\>

#### Defined in

use/cast.ts:50

___

### fileNames

• `Const` **fileNames**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `camera` | `string` |
| `screen` | `string` |

#### Defined in

use/cast.ts:42

___

### microphones

• **microphones**: `ComputedRef`<`MediaDeviceInfo`[]\>

#### Defined in

use/cast.ts:52

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

use/cast.ts:17

___

### mimeType

• `Const` **mimeType**: `RemovableRef`<`string`\>

#### Defined in

use/cast.ts:15

___

### recordCamera

• `Const` **recordCamera**: `Ref`<`boolean`\>

#### Defined in

use/cast.ts:14

___

### recordingName

• `Const` **recordingName**: `Ref`<`string`\>

#### Defined in

use/cast.ts:13

___

### showRecordingDialog

• `Const` **showRecordingDialog**: `Ref`<`any`\>

#### Defined in

use/cast.ts:11

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

use/cast.ts:67

___

### ensureDevicesListPermissions

▸ **ensureDevicesListPermissions**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

node_modules/.pnpm/@vueuse+core@9.12.0_vue@3.2.47/node_modules/@vueuse/core/index.d.ts:1199

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

use/cast.ts:23

___

### getSupportedMimeTypes

▸ **getSupportedMimeTypes**(): `string`[]

#### Returns

`string`[]

#### Defined in

use/cast.ts:35

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

use/cast.ts:76
