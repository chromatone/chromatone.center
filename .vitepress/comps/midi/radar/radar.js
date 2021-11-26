import { midi } from "@use/midi";
import paper from "paper";

export const radar = reactive({
  angle: 0,
  loaded: false,
});

export function useRadar() {
  const screen = ref();

  onMounted(() => {
    paper.setup(screen.value);
    paper.view.draw();
    radar.loaded = true;
  });
  onBeforeUnmount(() => {
    paper.project.clear();
    radar.loaded = false;
  });
  watch(
    () => midi.clock,
    () => {
      radar.angle += 360 / 192;
    }
  );
  return {
    screen,
    radar,
  };
}

export function polarXY(center = { x: 100, y: 100 }, radius = 0, angle = 0) {
  let radians = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y + radius * Math.sin(radians),
  };
}
