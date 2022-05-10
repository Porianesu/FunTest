//@ts-ignore
import Matter from "matter-js";
import React, {
  DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
const useLeadingDebounce = (
  fn: Function,
  delay: number,
  deps: DependencyList
) => {
  const isLeading = useRef<boolean>(false);
  const debounceFunc = useRef<Function>();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    debounceFunc.current = fn;
  }, deps);
  return () => {
    if (!isLeading.current) {
      debounceFunc.current && debounceFunc.current();
      isLeading.current = true;
    }
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      isLeading.current = false;
    }, delay);
  };
};
const useDebounce = (fn: Function, delay: number, deps: DependencyList) => {
  const debounceFunc = useRef<Function>();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    debounceFunc.current = fn;
  }, deps);
  return () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      debounceFunc.current && debounceFunc.current();
    }, delay);
  };
};
const STATIC_DENSITY = 15;
const MatterJs: React.FC = () => {
  const engineRef = useRef<any>();
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);
  const [constraints, setConstraints] = useState<DOMRect>();
  const [scene, setScene] = useState<any>();
  const handleResize = useCallback(() => {
    const newConstrains = boxRef.current?.getBoundingClientRect();
    setConstraints(newConstrains);
  }, []);
  const wall = useCallback((x, y, width, height) => {
    return Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: "#868e96",
      },
    });
  }, []);
  const peg = useCallback((x, y) => {
    return Matter.Bodies.circle(x, y, 14, {
      lable: "peg",
      restitution: 0.5,
      isStatic: true,
      render: {
        fillStyle: "#82c91e",
      },
    });
  }, []);
  const bead = useCallback(() => {
    return Matter.Bodies.circle(280, 40, 11, {
      restitution: 0.5,
      render: {
        fillStyle: "#e64980",
      },
    });
  }, []);
  const rand = useCallback((min, max) => {
    return Math.random() * (max - min) + min;
  }, []);
  const dropBead = useLeadingDebounce(
    () => {
      const preDroppedBead = bead();
      Matter.Body.setVelocity(preDroppedBead, {
        x: rand(-0.05, 0.05),
        y: 0,
      });
      Matter.Body.setAngularVelocity(preDroppedBead, rand(-0.05, 0.05));
      Matter.World.add(engineRef.current.world, preDroppedBead);
    },
    500,
    [bead, rand]
  );
  const onCollisionStart = useCallback(
    (events) => {
      events.pairs
        .filter(
          (pair: { bodyA: { lable: string } }) => pair.bodyA.lable === "peg"
        )
        .forEach((pair: { bodyA: { render: { fillStyle: string } } }) => {
          const newColor = `#${parseInt(rand(0, 17895696), 10).toString(16)}`;
          pair.bodyA.render.fillStyle = newColor;
        });
    },
    [rand]
  );
  const main = useCallback(() => {
    const { Engine, Render, Runner, Bodies, Composite, World } = Matter;
    const engine = Engine.create();
    engineRef.current = engine;
    Matter.Events.on(engine, "collisionStart", onCollisionStart);
    const render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: 560,
        height: 800,
        background: "#f8f9fa",
        wireframes: false,
      },
    });
    const bottom = Bodies.rectangle(280, 800, 560, 20, {
      isStatic: true,
      render: {
        fillStyle: "#868e96",
      },
    });
    World.add(engine.world, bottom);
    World.add(engine.world, [
      wall(280, 0, 560, 20),
      wall(280, 800, 560, 20),
      wall(0, 400, 20, 800),
      wall(560, 400, 20, 800),
    ]);
    for (let x = 0; x <= 560; x += 80) {
      const divider = wall(x, 610, 20, 360);
      World.add(engine.world, divider);
    }
    let isStaggerRow = false;
    for (let y = 200; y <= 400; y += 40) {
      let startX = isStaggerRow ? 80 : 40;
      for (let x = startX; x <= 520; x += 80) {
        World.add(engine.world, peg(x, y));
      }
      isStaggerRow = !isStaggerRow;
    }
    Engine.run(engine);
    Render.run(render);

    setConstraints(boxRef.current?.getBoundingClientRect());
    setScene(render);

    window.addEventListener("resize", handleResize);
  }, [handleResize, onCollisionStart, peg, wall]);
  useEffect(() => {
    main();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    if (constraints) {
      const { width, height } = constraints;

      scene.bounds.max.x = width;
      scene.bounds.max.y = height;
      scene.options.width = width;
      scene.options.height = height;
      scene.canvas.width = width;
      scene.canvas.height = height;

      const floor = scene.engine.world.bodies[0];

      Matter.Body.setPosition(floor, {
        x: width / 2,
        y: height + STATIC_DENSITY / 2,
      });

      Matter.Body.setVertices(floor, [
        { x: 0, y: height },
        { x: width, y: height },
        { x: width, y: height + STATIC_DENSITY },
        { x: 0, y: height + STATIC_DENSITY },
      ]);
    }
  }, [scene, constraints]);
  return (
    <div>
      <div ref={boxRef}>
        <canvas ref={canvasRef} />
      </div>
      <button onClick={dropBead}>Click Here!!!  </button>
    </div>
  );
};

export default MatterJs;
