import React, { useCallback, useEffect, useRef } from "react";
import * as Three from "three";
import Stats from "three/examples/jsm/libs/stats.module";

function ThreeJs() {
  const canvasRef = useRef();
  const renderer = useRef();
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 5;
  const { current: camera } = useRef(
    new Three.PerspectiveCamera(fov, aspect, near, far)
  );
  const { current: scene } = useRef(new Three.Scene());
  // 用于创建方块实例
  const makeInstance = useCallback((geometry, color, x) => {
    // const material = new Three.MeshBasicMaterial({color}) // 这种材质不受灯光影响
    const material = new Three.MeshPhongMaterial({ color }); // 增加灯光后改为使用这种材质
    const cube = new Three.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x;
    return cube;
  }, []);
  // 检查画布分辨率是否和展示器一致
  const resizeRendererToDisplaySize = useCallback(() => {
    const canvas = renderer.current.domElement;
    const pixelRatio = window.devicePixelRatio; // 获取设备像素使渲染像素与之匹配
    const width = canvas.clientWidth * pixelRatio || 0;
    const height = canvas.clientHeight * pixelRatio || 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.current.setSize(width, height, false);
    }
    return needResize;
  }, []);
  // 程序主逻辑
  const main = useCallback(() => {
    canvasRef.current = document.getElementById("canvasRef");
    renderer.current = new Three.WebGLRenderer({ canvas: canvasRef.current });
    camera.position.z = 2;
    const radius = 1;
    const height = 1;
    const radialSegment = 16;
    const geometry = new Three.ConeGeometry(radius, height, radialSegment);
    const cubes = [
      makeInstance(geometry, 0x44aa88, 0),
      makeInstance(geometry, 0x8844aa, -2),
      makeInstance(geometry, 0xaa8844, 2),
    ];
    // 添加light
    const color = 0xffffff;
    const intensity = 1;
    const light = new Three.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
    const animationRender = (time) => {
      time *= 0.001;
      // 检测到分辨率变更则触发视角重构, 并通过校验方法更新分辨率
      if (resizeRendererToDisplaySize()) {
        const canvas = renderer.current.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      // 设置相机的宽高比, 保持视野下的方块不变形
      const canvas = renderer.current.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      cubes.forEach((cube, idx) => {
        const speed = 1 + idx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });
      renderer.current.render(scene, camera);
      requestAnimationFrame(animationRender);
    };
    requestAnimationFrame(animationRender);
  }, []);
  useEffect(() => {
    main();
  }, []);
  return <canvas id={"canvasRef"}>123</canvas>;
}

export default ThreeJs;
