[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / [Tempo](../modules/Tempo.md) / Tempo

# Interface: Tempo

[Tempo](../modules/Tempo.md).Tempo

## Table of contents

### Properties

- [blink](Tempo.Tempo.md#blink)
- [bpm](Tempo.Tempo.md#bpm)
- [clock](Tempo.Tempo.md#clock)
- [color](Tempo.Tempo.md#color)
- [digit](Tempo.Tempo.md#digit)
- [hz](Tempo.Tempo.md#hz)
- [initialized](Tempo.Tempo.md#initialized)
- [metre](Tempo.Tempo.md#metre)
- [midiClock](Tempo.Tempo.md#midiclock)
- [mute](Tempo.Tempo.md#mute)
- [note](Tempo.Tempo.md#note)
- [playing](Tempo.Tempo.md#playing)
- [position](Tempo.Tempo.md#position)
- [progress](Tempo.Tempo.md#progress)
- [set](Tempo.Tempo.md#set)
- [started](Tempo.Tempo.md#started)
- [stopped](Tempo.Tempo.md#stopped)
- [tap](Tempo.Tempo.md#tap)
- [ticks](Tempo.Tempo.md#ticks)
- [volume](Tempo.Tempo.md#volume)

## Properties

### blink

• **blink**: `boolean`

#### Defined in

use/tempo.ts:25

___

### bpm

• **bpm**: `MaybeComputedRef`<`number`\>

#### Defined in

use/tempo.ts:18

___

### clock

• `Optional` **clock**: `number`

#### Defined in

use/tempo.ts:23

___

### color

• **color**: `MaybeComputedRef`<`string`\>

#### Defined in

use/tempo.ts:22

___

### digit

• **digit**: `MaybeComputedRef`<`number`\>

#### Defined in

use/tempo.ts:21

___

### hz

• **hz**: `MaybeComputedRef`<`string`\>

#### Defined in

use/tempo.ts:19

___

### initialized

• **initialized**: `boolean`

#### Defined in

use/tempo.ts:17

___

### metre

• **metre**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `num` | `MaybeComputedRef`<`string`\> |
| `over` | `number` |
| `under` | `number` |

#### Defined in

use/tempo.ts:35

___

### midiClock

• **midiClock**: `MaybeComputedRef`<`boolean`\>

#### Defined in

use/tempo.ts:24

___

### mute

• **mute**: `MaybeComputedRef`<`boolean`\>

#### Defined in

use/tempo.ts:29

___

### note

• **note**: `MaybeComputedRef`<`string`\>

#### Defined in

use/tempo.ts:20

___

### playing

• **playing**: `boolean`

#### Defined in

use/tempo.ts:27

___

### position

• **position**: `string`

#### Defined in

use/tempo.ts:32

___

### progress

• **progress**: `number`

#### Defined in

use/tempo.ts:31

___

### set

• **set**: (`diff`: `number`) => `void`

#### Type declaration

▸ (`diff`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `diff` | `number` |

##### Returns

`void`

#### Defined in

use/tempo.ts:34

___

### started

• **started**: `boolean`

#### Defined in

use/tempo.ts:26

___

### stopped

• **stopped**: `number` \| `boolean`

#### Defined in

use/tempo.ts:28

___

### tap

• **tap**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bpm` | `number` |
| `diff` | `number` |
| `last` | `number` |
| `tap` | `Function` |
| `timeout` | `number` |
| `times` | `number`[] |

#### Defined in

use/tempo.ts:40

___

### ticks

• **ticks**: `number`

#### Defined in

use/tempo.ts:33

___

### volume

• **volume**: `MaybeComputedRef`<`number`\>

#### Defined in

use/tempo.ts:30
