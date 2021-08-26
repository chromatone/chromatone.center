---
title: Perceptual color models
subtitle: Color spaces based on the "standard observer" perception of colors
tags: color
date: 2021-08-08
cover: /theory/color/CIE_1976_UCS.png
---

### HSL and HSV

HSL (for hue, saturation, lightness) and HSV (for hue, saturation, value; also known as HSB, for hue, saturation, brightness) are alternative representations of the RGB color model, designed in the 1970s by computer graphics researchers to more closely align with the way human vision perceives color-making attributes. In these models, colors of each hue are arranged in a radial slice, around a central axis of neutral colors which ranges from black at the bottom to white at the top. 

![](./models/hsl.png)

The HSL representation models the way different paints mix together to create colour in the real world, with the lightness dimension resembling the varying amounts of black or white paint in the mixture (e.g. to create "light red", a red pigment can be mixed with white paint; this white paint corresponds to a high "lightness" value in the HSL representation). Fully saturated colors are placed around a circle at a lightness value of ½, with a lightness value of 0 or 1 corresponding to fully black or white, respectively.

Meanwhile, the HSV representation models how colors appear under light. The difference between HSL and HSV is that a color with maximum lightness in HSL is pure white, but a color with maximum value/brightness in HSV is analogous to shining a white light on a colored object (e.g. shining a bright white light on a red object causes the object to still appear red, just brighter and more intense, while shining a dim light on a red object causes the object to appear darker and less bright).

## Interactive HSL, LCH and HWB color mixer

<color-mix-hsl />

The issue with both HSV and HSL is that these approaches do not effectively separate colour into their three value components according to human perception of color. This can be seen when the saturation settings are altered — it is quite easy to notice the difference in perceptual lightness despite the "V" or "L" setting being fixed. 


### CIELUV and CIELAB

CIELUV, is a color space adopted by the International Commission on Illumination (CIE) in 1976, as a simple-to-compute transformation of the 1931 CIE XYZ color space, but which attempted perceptual uniformity.

Due to the distribution of cones in the eye, the tristimulus values depend on the observer's field of view. To eliminate this variable, the CIE defined a color-mapping function called the standard (colorimetric) observer, to represent an average human's chromatic response within a 2° arc inside the fovea. 

![](/media/theory/color/CIE_1976_UCS.png)

The CIELAB color space also referred to as L*a*b* is a color space defined by the International Commission on Illumination (abbreviated CIE) in 1976. It expresses color as three values: L* for perceptual lightness, and a* and b* for the four unique colors of human vision: red, green, blue, and yellow. CIELAB was intended as a perceptually uniform space, where a given numerical change corresponds to similar perceived change in color. While the LAB space is not truly perceptually uniform, it nevertheless is useful in industry for detecting small differences in color.

## Interactive LAB color mixer

<color-mix-lab />


Like the CIEXYZ space it derives from, CIELAB colorspace is a device-independent, "standard observer" model. The colors it defines are not relative to any particular device such as a computer monitor or a printer, but instead relate to the CIE standard observer which is an averaging of the results of color matching experiments under laboratory conditions. 

The CIELAB space is three-dimensional, and covers the entire range of human color perception, or gamut. It is based on the opponent color model of human vision, where red/green forms an opponent pair, and blue/yellow forms an opponent pair. The lightness value, L*, also referred to as "Lstar," defines black at 0 and white at 100. The a* axis is relative to the green–red opponent colors, with negative values toward green and positive values toward red. The b* axis represents the blue–yellow opponents, with negative numbers toward blue and positive toward yellow. 

While the intention behind CIELAB was to create a space that was more perceptually uniform than CIEXYZ using only a simple formula, CIELAB is known to lack perceptually uniformity, particularly in the area of blue hues.

The lightness value, L* in CIELAB is calculated using the cube root of the relative luminance with an offset near black. This results in an effective power curve with an exponent of approximately 0.43 which represents the human eye's response to light under daylight (photopic) conditions. 

<color-table />

