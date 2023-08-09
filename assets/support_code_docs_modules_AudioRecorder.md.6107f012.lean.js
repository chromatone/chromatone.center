import{_ as e,v as t,b as r,R as o}from"./chunks/framework.7e747cd7.js";const g=JSON.parse('{"title":"Module: AudioRecorder","description":"","frontmatter":{},"headers":[],"relativePath":"support/code/docs/modules/AudioRecorder.md","filePath":"support/code/docs/modules/AudioRecorder.md"}'),d={name:"support/code/docs/modules/AudioRecorder.md"},a=o('<p><a href="./../README.html">Use-chromatone documentation</a> / <a href="./../modules.html">Exports</a> / AudioRecorder</p><h1 id="module-audiorecorder" tabindex="-1">Module: AudioRecorder <a class="header-anchor" href="#module-audiorecorder" aria-label="Permalink to &quot;Module: AudioRecorder&quot;">​</a></h1><h2 id="table-of-contents" tabindex="-1">Table of contents <a class="header-anchor" href="#table-of-contents" aria-label="Permalink to &quot;Table of contents&quot;">​</a></h2><h3 id="variables" tabindex="-1">Variables <a class="header-anchor" href="#variables" aria-label="Permalink to &quot;Variables&quot;">​</a></h3><ul><li><a href="./AudioRecorder.html#record">record</a></li><li><a href="./AudioRecorder.html#recorder">recorder</a></li><li><a href="./AudioRecorder.html#recording">recording</a></li></ul><h3 id="functions" tabindex="-1">Functions <a class="header-anchor" href="#functions" aria-label="Permalink to &quot;Functions&quot;">​</a></h3><ul><li><a href="./AudioRecorder.html#userecorder">useRecorder</a></li></ul><h2 id="variables-1" tabindex="-1">Variables <a class="header-anchor" href="#variables-1" aria-label="Permalink to &quot;Variables&quot;">​</a></h2><h3 id="record" tabindex="-1">record <a class="header-anchor" href="#record" aria-label="Permalink to &quot;record&quot;">​</a></h3><p>• <code>Const</code> <strong>record</strong>: <code>Object</code></p><h4 id="type-declaration" tabindex="-1">Type declaration <a class="header-anchor" href="#type-declaration" aria-label="Permalink to &quot;Type declaration&quot;">​</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>start</code></td><td style="text-align:left;">() =&gt; <code>void</code></td></tr><tr><td style="text-align:left;"><code>stop</code></td><td style="text-align:left;">() =&gt; <code>Promise</code>&lt;<code>void</code>&gt;</td></tr></tbody></table><h4 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/chromatone/chromatone.center/blob/e9f21f6f9/use/recorder.ts#L21" target="_blank" rel="noreferrer">use/recorder.ts:21</a></p><hr><h3 id="recorder" tabindex="-1">recorder <a class="header-anchor" href="#recorder" aria-label="Permalink to &quot;recorder&quot;">​</a></h3><p>• <strong>recorder</strong>: <code>Recorder</code></p><h4 id="defined-in-1" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-1" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/chromatone/chromatone.center/blob/e9f21f6f9/use/recorder.ts#L11" target="_blank" rel="noreferrer">use/recorder.ts:11</a></p><hr><h3 id="recording" tabindex="-1">recording <a class="header-anchor" href="#recording" aria-label="Permalink to &quot;recording&quot;">​</a></h3><p>• <code>Const</code> <strong>recording</strong>: <code>Ref</code>&lt;<code>boolean</code>&gt;</p><h4 id="defined-in-2" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-2" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/chromatone/chromatone.center/blob/e9f21f6f9/use/recorder.ts#L13" target="_blank" rel="noreferrer">use/recorder.ts:13</a></p><h2 id="functions-1" tabindex="-1">Functions <a class="header-anchor" href="#functions-1" aria-label="Permalink to &quot;Functions&quot;">​</a></h2><h3 id="userecorder" tabindex="-1">useRecorder <a class="header-anchor" href="#userecorder" aria-label="Permalink to &quot;useRecorder&quot;">​</a></h3><p>▸ <strong>useRecorder</strong>(): <code>Object</code></p><h4 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>Object</code></p><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>duration</code></td><td style="text-align:left;"><code>ComputedRef</code>&lt;<code>number</code>&gt;</td></tr><tr><td style="text-align:left;"><code>record</code></td><td style="text-align:left;">{ <code>start</code>: () =&gt; <code>void</code> ; <code>stop</code>: () =&gt; <code>Promise</code>&lt;<code>void</code>&gt; }</td></tr><tr><td style="text-align:left;"><code>record.start</code></td><td style="text-align:left;">[object Object]</td></tr><tr><td style="text-align:left;"><code>record.stop</code></td><td style="text-align:left;">[object Object]</td></tr><tr><td style="text-align:left;"><code>recorder</code></td><td style="text-align:left;"><code>Recorder</code></td></tr><tr><td style="text-align:left;"><code>recording</code></td><td style="text-align:left;"><code>Ref</code>&lt;<code>boolean</code>&gt;</td></tr><tr><td style="text-align:left;"><code>toggled</code></td><td style="text-align:left;"><code>Ref</code>&lt;<code>number</code>&gt;</td></tr></tbody></table><h4 id="defined-in-3" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-3" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/chromatone/chromatone.center/blob/e9f21f6f9/use/recorder.ts#L40" target="_blank" rel="noreferrer">use/recorder.ts:40</a></p>',32),c=[a];function l(n,i,s,h,u,f){return t(),r("div",null,c)}const m=e(d,[["render",l]]);export{g as __pageData,m as default};