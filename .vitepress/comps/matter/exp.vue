<template lang="pug">
.absolute.top-0.left-0.-z-1(ref="content")
  #testLabel Testing
  #drawhere
</template>

<script>
import {
  Engine,
  Runner,
  Render,
  World,
  Bodies,
  Body,
  Events,
  Composite,
  Composites,
  Constraint,
  Vertices,
  Mouse,
  MouseConstraint,
  Query,
  Common
} from "matter-js";
import decomp from "poly-decomp";
export default {
  data: function() {
    return {
      debug: null,
      canvasProp: {
        wallWidth: 1
      }
    };
  },
  computed: {
    myObjStyle(top, left) {
      return `position:absolute;top:${top};left:${left}`;
    }
  },
  mounted() {
    window.decomp = decomp;
    let width = window.innerWidth,
      height = window.innerHeight,
      engineOptions = {
        enableSleeping: true,
        timing: {
          //timestamp: 0.5,
          timeScale: 0.5
        }
      },
      renderOptions = {
        width,
        height,
        wireframes: false,
        wireframeBackground: "transparent",
        background: "transparent",
        //background: "#ffffff99",
        showSleeping: true,
        showDebug: false,
        showBroadphase: false,
        showBounds: false,
        showVelocity: false,
        showCollisions: false,
        showSeparations: false,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showShadows: false,
        showVertexNumbers: false,
        showConvexHulls: false,
        showInternalEdges: false,
        showMousePosition: true
      };
    // create an engine
    let engine = Engine.create(engineOptions),
      world = engine.world;
    // create a renderer
    var render = Render.create({
      element: document.querySelector("#drawhere"),
      engine,
      options: renderOptions
    });
    //Bootstrap Mouse Controls
    // add mouse control
    var mouse = Mouse.create(document.body),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.5,
          render: {
            visible: true
          }
        }
      });
    World.add(world, mouseConstraint);
    // keep the mouse in sync with rendering
    render.mouse = mouse;
    // an example of using mouse events on a mouse
    var fsa = [];
    Events.on(mouseConstraint, "startdrag", function(event) {
      fsa = event.body.parts.map(v => v.render.fillStyle);
      event.body.parts = event.body.parts.map(v => {
        v.render.fillStyle = "#FF0000";
        return v;
      });
      //console.log("startdrag", fsa);
    });
    Events.on(mouseConstraint, "enddrag", function(event) {
      event.body.parts.map(
        (v, i) => (event.body.parts[i].render.fillStyle = fsa[i])
      );
      //console.log("enddrag", event.body.parts);
    });
    //Events.on(engine, "collisionStart", console.log);
    //Add Walls
    let leftWall = Bodies.rectangle(
      this.canvasProp.wallWidth,
      height / 2,
      this.canvasProp.wallWidth,
      height,
      { isStatic: true }
    ),
      rightWall = Bodies.rectangle(
        width - this.canvasProp.wallWidth,
        height / 2,
        this.canvasProp.wallWidth,
        height,
        { isStatic: true }
      ),
      topWall = Bodies.rectangle(
        width / 2,
        this.canvasProp.wallWidth,
        width,
        this.canvasProp.wallWidth,
        { isStatic: true }
      ),
      bottomWall = Bodies.rectangle(
        width / 2,
        height - this.canvasProp.wallWidth,
        width,
        this.canvasProp.wallWidth,
        { isStatic: true }
      );
    World.add(world, [leftWall, rightWall, topWall, bottomWall]);
    // Moving Stick
    var boxA = Bodies.rectangle(width / 2, height / 2, width / 4, 16, {
      isStatic: false
    });
    Body.setAngularVelocity(boxA, Math.PI / 18);
    Body.setVelocity(boxA, { x: -10, y: -10 });
    //Static Objects
    var boxB = Bodies.rectangle(
      Math.random() * width,
      Math.random() * height,
      80,
      80,
      { isStatic: true }
    );
    var ball = Bodies.circle(
      Math.random() * width,
      Math.random() * height,
      40,
      { isStatic: true }
    );
    // add all of the bodies to the world
    Events.on(boxA, "sleepEnd", e => console.log);
    World.add(world, [boxA, boxB, ball]);
    //Trying Chiainign
    var boxes = Composites.stack(
      width / 2,
      height / 2,
      1,
      4,
      0,
      0.78,
      (x, y) => Bodies.circle(x, y, 16, { dampening: 1 })
    );
    var chain = Composites.chain(boxes, 0, 0, 0.1, 0.1, {
      dampening: 1,
      stiffness: 1,
      render: { strokeStyle: "transparent", lineWidth: 0 }
    });
    Composite.add(
      boxes,
      Constraint.create({
        pointA: { x: width / 4, y: height / 2 },
        bodyB: boxes.bodies[3],
        length: 1,
        stiffness: 1,
        dampening: 1,
        render: {
          strokeStyle: "#3f3",
          type: "line"
        }
      })
    );
    World.add(world, chain);
    var jfPath = Vertices.fromPath(
      "L0 0 100 0 100 20 60 20 60 40 90 40 90 60 60 60 60 100 40 100 0 80 0 60 40 80 40 20 0 20"
    );
    let jfColor = Common.choose([
      "#556270",
      "#4ECDC4",
      "#C7F464",
      "#FF6B6B",
      "#C44D58"
    ]),
      jf = Bodies.fromVertices(
        width / 2,
        height / 2,
        Common.choose([jfPath]),
        {
          render: {
            fillStyle: jfColor,
            strokeStyle: "transparent",
            lineWidth: 0
          }
        },
        true
      );
    let jfConstraint = Constraint.create({
      pointA: { x: width / 2, y: height / 4 },
      bodyB: jf,
      pointB: { x: 0, y: -20 },
      stiffness: 1,
      damping: 0.99,
      //length:10,
      render: {
        //strokeStyle: "transparent",
        strokeStyle: jfColor,
        type: "line",
        anchors: true,
        visible: true
      }
    });
    World.add(world, [jf, jfConstraint]);
    Events.on(render, "afterRender", e => {
      let el = document.querySelector("#testLabel");
      el.style.position = "absolute";
      el.style.top = `${boxes.bodies[0].position.y - el.clientHeight / 2}px`;
      el.style.left = `${boxes.bodies[0].position.x - el.clientWidth / 2}px`;
    });
    // run the engine
    Runner.run(engine);
    // run the renderer
    Render.run(render);
  },
  beforeUnmount() {
    Runner.stop();
    Render.stop();
  }
}

</script>


<style scoped>
</style>