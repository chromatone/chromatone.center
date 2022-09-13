<script setup>
import { useClipboard } from '@vueuse/core'
const props = defineProps({
	text: String
})

const copied = ref(false)



function fallbackCopyTextToClipboard(text) {
	var textArea = document.createElement("textarea");
	textArea.value = text;

	// Avoid scrolling to bottom
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Fallback: Copying text command was ' + msg);
	} catch (err) {
		console.error('Fallback: Oops, unable to copy', err);
	}

	document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text).then(function () {
		console.log('Async: Copying to clipboard was successful!');
		copied.value = true
		setTimeout(() => {
			copied.value = false
		}, 2000);
	}, function (err) {
		console.error('Async: Could not copy text: ', err);
	});
}



</script>

<template lang='pug'>
tspan.font-mono(

	@mousedown="copyTextToClipboard(text)" 
	:class="{active: copied}"
	) {{ text }} {{ copied ? 'copied!' : '' }}
</template>