import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GeometryModelData } from '../types/geometry';
import { 
  Rotate3d, 
  Eye, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Sliders, 
  Sun, 
  Crosshair,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Props {
  modelData: GeometryModelData;
  activeStepElements?: {
    points?: string[];
    edges?: string[];
    faces?: string[];
    showAuxiliary?: boolean;
    showCrossSection?: boolean;
  };
  highlightedLineId?: string;
  cuttingPlaneHeight?: number;
  showCuttingPlane?: boolean;
  onPointClick?: (pointName: string) => void;
  language?: 'vi' | 'en';
}

export const Geometry3DCanvas: React.FC<Props> = ({
  modelData,
  activeStepElements,
  highlightedLineId,
  cuttingPlaneHeight = 0,
  showCuttingPlane = false,
  onPointClick,
  language = 'vi'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const cuttingPlaneMeshRef = useRef<THREE.Mesh | null>(null);

  // Bottom dock & UI state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showAxes, setShowAxes] = useState(false);
  const [wireframeOnly, setWireframeOnly] = useState(false);
  const [slicingSlider, setSlicingSlider] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraPresetName, setCameraPresetName] = useState('Perspective');

  // Animation & Rendering helpers
  const requestRenderRef = useRef<(() => void) | null>(null);

  // Helper to generate procedural text label sprites
  const createLabelSprite = useCallback((text: string, color: string = '#ffffff') => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw circular tag
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(64, 64, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 52px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 66);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ 
      map: texture, 
      depthTest: false,
      transparent: true 
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.65, 0.65, 1);
    return sprite;
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.035);
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const initialCam = modelData.cameraPreset || { x: 5, y: 4, z: 6 };
    camera.position.set(initialCam.x, initialCam.y, initialCam.z);
    cameraRef.current = camera;

    // 3. Setup WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 1.0, 0);
    controls.maxDistance = 25;
    controls.minDistance = 2;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't flip under the floor
    controlsRef.current = controls;

    // 6. Balanced 3-point Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 0.65);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 1.2); // Warm key
    keyLight.position.set(8, 14, 8);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 30;
      keyLight.shadow.camera.left = -6;
      keyLight.shadow.camera.right = 6;
      keyLight.shadow.camera.top = 6;
      keyLight.shadow.camera.bottom = -6;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.5); // Cool fill
    fillLight.position.set(-8, 6, -8);
    scene.add(fillLight);

    // 7. Ground Grid & Contact Shadow Ground Plane
    const gridHelper = new THREE.GridHelper(16, 16, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(12, 12);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.02;
    scene.add(shadowPlane);

    // 8. Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 9. Coordinate Axes Helper (toggleable)
    const axesGroup = new THREE.Group();
    axesGroup.name = 'axesGroup';
    axesGroup.visible = false;
    const axesHelper = new THREE.AxesHelper(3.5);
    axesGroup.add(axesHelper);
    scene.add(axesGroup);

    // Render loop mechanism
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        renderDirty = false;
        controls.update();
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    requestRenderRef.current = requestRender;
    controls.addEventListener('change', requestRender);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };

    window.addEventListener('resize', handleResize);
    requestRender();

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('change', requestRender);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Re-build 3D Geometry model whenever modelData or step changes
  useEffect(() => {
    const scene = sceneRef.current;
    const modelGroup = modelGroupRef.current;
    if (!scene || !modelGroup) return;

    // Clear previous children
    while (modelGroup.children.length > 0) {
      const child = modelGroup.children[0] as any;
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m: any) => m.dispose());
        else child.material.dispose();
      }
      modelGroup.remove(child);
    }

    const pointsMap = new Map<string, THREE.Vector3>();

    // 1. Draw Points (Sphere meshes + Labels)
    const sphereGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const virtualSphereGeo = new THREE.SphereGeometry(0.12, 16, 16);

    modelData.points.forEach((p) => {
      const pos = new THREE.Vector3(p.x, p.y, p.z);
      pointsMap.set(p.name, pos);

      const isStepHighlighted = activeStepElements?.points?.includes(p.name);
      const isVirtual = p.isVirtual;

      const pointColor = isStepHighlighted 
        ? '#f59e0b' 
        : (p.color || (isVirtual ? '#ef4444' : '#3b82f6'));

      const pointMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(pointColor),
        roughness: 0.2,
        metalness: 0.8,
        emissive: isStepHighlighted ? new THREE.Color(0xf59e0b) : new THREE.Color(0x000000),
        emissiveIntensity: isStepHighlighted ? 0.6 : 0,
      });

      const sphere = new THREE.Mesh(isVirtual ? virtualSphereGeo : sphereGeo, pointMat);
      sphere.position.copy(pos);
      sphere.castShadow = true;
      sphere.userData = { name: p.name, type: 'point' };
      modelGroup.add(sphere);

      // Label sprite
      if (showLabels) {
        const sprite = createLabelSprite(p.name, pointColor);
        if (sprite) {
          sprite.position.copy(pos).add(new THREE.Vector3(0, 0.35, 0));
          modelGroup.add(sprite);
        }
      }
    });

    // 2. Draw Edges (Solid or Dashed Lines)
    const allEdges = [
      ...modelData.edges,
      ...(activeStepElements?.showAuxiliary && modelData.auxiliaryLines ? modelData.auxiliaryLines : [])
    ];

    allEdges.forEach((edge) => {
      const p1 = pointsMap.get(edge.from);
      const p2 = pointsMap.get(edge.to);
      if (!p1 || !p2) return;

      const isStepHighlighted = activeStepElements?.edges?.includes(edge.id) || edge.id === highlightedLineId;
      const edgeColor = isStepHighlighted 
        ? '#10b981' 
        : (edge.color || '#94a3b8');

      if (edge.dashed && !isStepHighlighted) {
        // Spatial math convention: dashed hidden line
        const points = [p1, p2];
        const dashedGeo = new THREE.BufferGeometry().setFromPoints(points);
        const dashedMat = new THREE.LineDashedMaterial({
          color: new THREE.Color(edgeColor),
          dashSize: 0.18,
          gapSize: 0.12,
          linewidth: 2,
        });
        const line = new THREE.Line(dashedGeo, dashedMat);
        line.computeLineDistances();
        modelGroup.add(line);
      } else {
        // Solid visible line or highlighted intersection line
        // Use TubeGeometry or Cylinder for glowing thick 3D line
        const distance = p1.distanceTo(p2);
        const path = new THREE.LineCurve3(p1, p2);
        const tubeGeo = new THREE.TubeGeometry(
          path, 
          12, 
          isStepHighlighted ? 0.045 : 0.022, 
          8, 
          false
        );
        const tubeMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(edgeColor),
          roughness: 0.3,
          metalness: 0.5,
          emissive: isStepHighlighted ? new THREE.Color(edgeColor) : new THREE.Color(0x000000),
          emissiveIntensity: isStepHighlighted ? 0.8 : 0,
        });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        tubeMesh.castShadow = true;
        modelGroup.add(tubeMesh);
      }
    });

    // 3. Draw Faces (Polygons / Transparent planes)
    if (!wireframeOnly) {
      const allFaces = [
        ...modelData.faces,
        ...(activeStepElements?.showCrossSection && modelData.auxiliaryPlanes ? modelData.auxiliaryPlanes : [])
      ];

      allFaces.forEach((face) => {
        const isStepHighlighted = activeStepElements?.faces?.includes(face.id);
        const faceColor = isStepHighlighted 
          ? '#f59e0b' 
          : (face.color || '#3b82f6');
        const opacity = isStepHighlighted ? 0.45 : (face.opacity || 0.25);

        // Build planar polygon triangulation
        const vertices: number[] = [];
        const validCoords: THREE.Vector3[] = [];

        face.points.forEach((ptName) => {
          const pt = pointsMap.get(ptName);
          if (pt) validCoords.push(pt);
        });

        if (validCoords.length >= 3) {
          // Triangulate polygon fan from first vertex
          for (let i = 1; i < validCoords.length - 1; i++) {
            vertices.push(
              validCoords[0].x, validCoords[0].y, validCoords[0].z,
              validCoords[i].x, validCoords[i].y, validCoords[i].z,
              validCoords[i + 1].x, validCoords[i + 1].y, validCoords[i + 1].z,
              // Double sided back-faces
              validCoords[0].x, validCoords[0].y, validCoords[0].z,
              validCoords[i + 1].x, validCoords[i + 1].y, validCoords[i + 1].z,
              validCoords[i].x, validCoords[i].y, validCoords[i].z
            );
          }

          const faceGeo = new THREE.BufferGeometry();
          faceGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
          faceGeo.computeVertexNormals();

          const faceMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(faceColor),
            transparent: true,
            opacity: opacity,
            roughness: 0.2,
            metalness: 0.1,
            side: THREE.DoubleSide,
            depthWrite: false,
          });

          const faceMesh = new THREE.Mesh(faceGeo, faceMat);
          faceMesh.renderOrder = 1;
          modelGroup.add(faceMesh);
        }
      });
    }

    // 4. Interactive Cutting Plane (if enabled)
    if (showCuttingPlane) {
      const planeGeo = new THREE.PlaneGeometry(6, 6);
      const planeMat = new THREE.MeshPhysicalMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const cuttingPlaneMesh = new THREE.Mesh(planeGeo, planeMat);
      cuttingPlaneMesh.rotation.x = Math.PI / 2;
      cuttingPlaneMesh.position.y = 1.2 + slicingSlider;
      cuttingPlaneMeshRef.current = cuttingPlaneMesh;
      modelGroup.add(cuttingPlaneMesh);
    }

    requestRenderRef.current?.();
  }, [modelData, activeStepElements, highlightedLineId, showLabels, wireframeOnly, showCuttingPlane, slicingSlider, createLabelSprite]);

  // Handle Slicing height slider update
  const handleSlicingChange = (val: number) => {
    setSlicingSlider(val);
    if (cuttingPlaneMeshRef.current) {
      cuttingPlaneMeshRef.current.position.y = 1.2 + val;
      requestRenderRef.current?.();
    }
  };

  // Camera presets
  const setCameraView = (type: 'iso' | 'top' | 'front' | 'side') => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    sound.playStep();

    let targetCam = { x: 5, y: 4, z: 6 };
    let viewName = 'Perspective';

    if (type === 'iso') {
      targetCam = { x: 5.5, y: 4.5, z: 5.5 };
      viewName = 'Isometric 3D';
    } else if (type === 'top') {
      targetCam = { x: 0, y: 8, z: 0.01 };
      viewName = 'Top View (Từ trên)';
    } else if (type === 'front') {
      targetCam = { x: 0, y: 2, z: 7 };
      viewName = 'Front View (Chính diện)';
    } else if (type === 'side') {
      targetCam = { x: 7, y: 2, z: 0 };
      viewName = 'Side View (Cạnh bên)';
    }

    setCameraPresetName(viewName);

    // Smoothly set camera and update controls
    camera.position.set(targetCam.x, targetCam.y, targetCam.z);
    controls.target.set(0, 1.0, 0);
    controls.update();
    requestRenderRef.current?.();
  };

  // Auto-rotate tick
  useEffect(() => {
    if (!autoRotate) return;
    let animId = 0;
    const tick = () => {
      const controls = controlsRef.current;
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.0;
        controls.update();
        rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      if (controlsRef.current) controlsRef.current.autoRotate = false;
    };
  }, [autoRotate]);

  // Toggle coordinate axes
  const toggleAxes = () => {
    const scene = sceneRef.current;
    if (!scene) return;
    const axes = scene.getObjectByName('axesGroup');
    if (axes) {
      axes.visible = !showAxes;
      setShowAxes(!showAxes);
      requestRenderRef.current?.();
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Minimal Top-Left Spec / Title Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {language === 'vi' ? 'Không gian 3D Tương tác' : 'Interactive 3D Space'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-medium">
            {cameraPresetName}
          </span>
        </div>
        <div className="text-xs text-slate-400 font-medium px-1 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>{language === 'vi' ? 'Giữ chuột trái để xoay • Cuộn để phóng to' : 'Drag left-click to orbit • Scroll to zoom'}</span>
        </div>
      </div>

      {/* Top-Right Quick Toggles (Sound & Reset Camera) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => {
            sound.enabled = !soundEnabled;
            setSoundEnabled(!soundEnabled);
          }}
          title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
          className="p-2.5 bg-slate-900/85 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 shadow-lg transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <button
          onClick={() => setCameraView('iso')}
          title="Reset Camera"
          className="p-2.5 bg-slate-900/85 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 shadow-lg transition-colors"
        >
          <Crosshair className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* Unified Ergonomic Collapsible Bottom Dock (Zero Viewport Occlusion Constitution) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[860px] flex flex-col items-center">
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsCollapsed(!isCollapsed);
          }}
          className="mb-2 px-3.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
        >
          {isCollapsed ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'vi' ? 'Mở thanh công cụ 3D' : 'Show 3D Controls'}</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'vi' ? 'Thu gọn (Toàn cảnh)' : 'Hide Controls (Zen Mode)'}</span>
            </>
          )}
        </button>

        {/* Dock Panel */}
        {!isCollapsed && (
          <div className="w-full bg-slate-900/95 border border-slate-700/70 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-slate-200">
            {/* View presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase text-slate-400 mr-1 tracking-wider">
                {language === 'vi' ? 'Góc nhìn:' : 'Views:'}
              </span>
              <button
                onClick={() => setCameraView('iso')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white transition-colors border border-slate-700"
              >
                3D Phối cảnh
              </button>
              <button
                onClick={() => setCameraView('top')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white transition-colors border border-slate-700"
              >
                Mặt phẳng đáy
              </button>
              <button
                onClick={() => setCameraView('front')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white transition-colors border border-slate-700"
              >
                Chính diện
              </button>
            </div>

            {/* Display Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowLabels(!showLabels);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  showLabels 
                    ? 'bg-blue-600/30 border-blue-500/60 text-blue-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Tên điểm' : 'Labels'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  toggleAxes();
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  showAxes 
                    ? 'bg-amber-600/30 border-amber-500/60 text-amber-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Trục toạ độ' : 'Axes'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setAutoRotate(!autoRotate);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  autoRotate 
                    ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Rotate3d className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Tự quay' : 'Rotate'}</span>
              </button>
            </div>

            {/* Slicing plane interactive slider (if enabled) */}
            {showCuttingPlane && (
              <div className="flex items-center gap-2 w-full pt-2 border-t border-slate-800">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-cyan-300 font-medium">
                  {language === 'vi' ? 'Độ cao mp cắt:' : 'Cut Height:'}
                </span>
                <input
                  type="range"
                  min="-1.2"
                  max="1.5"
                  step="0.05"
                  value={slicingSlider}
                  onChange={(e) => handleSlicingChange(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono text-cyan-200 w-10 text-right">
                  {slicingSlider.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
