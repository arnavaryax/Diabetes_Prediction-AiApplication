/* =========================================================
   DIABETES PREDICTION
========================================================= */


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL =
    "https://washer-backspace-eastward.ngrok-free.dev";


/* =========================================================
   SCROLL TO PREDICTION
========================================================= */

function scrollToPrediction() {

    const section =
        document.getElementById("prediction");

    if (!section) {
        return;
    }

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   ELEMENTS
========================================================= */

const form =
    document.getElementById("predictionForm");

const predictBtn =
    document.getElementById("predictBtn");

const buttonText =
    document.getElementById("buttonText");

const loader =
    document.getElementById("loader");

const resetBtn =
    document.getElementById("resetBtn");

const resultBox =
    document.getElementById("resultBox");

const resultTitle =
    document.getElementById("resultTitle");

const resultIcon =
    document.getElementById("resultIcon");

const probabilityText =
    document.getElementById("probabilityText");

const progressBar =
    document.getElementById("progressBar");

const resultMessage =
    document.getElementById("resultMessage");

const errorBox =
    document.getElementById("errorBox");


/* =========================================================
   SAFE CHECK
========================================================= */

if (!form) {
    console.error(
        "Prediction form not found."
    );
}


/* =========================================================
   SUBMIT PREDICTION
========================================================= */

if (form) {

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* -------------------------------------------------
               CLEAR PREVIOUS RESULT
            ------------------------------------------------- */

            if (errorBox) {
                errorBox.style.display = "none";
                errorBox.textContent = "";
            }

            if (resultBox) {
                resultBox.classList.remove("show");
            }


            /* -------------------------------------------------
               BROWSER VALIDATION
            ------------------------------------------------- */

            if (!form.reportValidity()) {
                return;
            }


            /* -------------------------------------------------
               LOADING STATE
            ------------------------------------------------- */

            if (predictBtn) {
                predictBtn.disabled = true;
            }

            if (buttonText) {
                buttonText.textContent =
                    "Generating...";
            }

            if (loader) {
                loader.classList.remove("hidden");
            }


            try {

                /* =================================================
                   COLLECT INPUT DATA
                ================================================= */

                const data = {

                    Pregnancies:
                        Number(
                            document.getElementById(
                                "Pregnancies"
                            ).value
                        ),

                    Glucose:
                        Number(
                            document.getElementById(
                                "Glucose"
                            ).value
                        ),

                    BloodPressure:
                        Number(
                            document.getElementById(
                                "BloodPressure"
                            ).value
                        ),

                    SkinThickness:
                        Number(
                            document.getElementById(
                                "SkinThickness"
                            ).value
                        ),

                    Insulin:
                        Number(
                            document.getElementById(
                                "Insulin"
                            ).value
                        ),

                    BMI:
                        Number(
                            document.getElementById(
                                "BMI"
                            ).value
                        ),

                    DiabetesPedigreeFunction:
                        Number(
                            document.getElementById(
                                "DiabetesPedigreeFunction"
                            ).value
                        ),

                    Age:
                        Number(
                            document.getElementById(
                                "Age"
                            ).value
                        )
                };


                /* =================================================
                   VALIDATE VALUES
                ================================================= */

                for (
                    const [key, value]
                    of Object.entries(data)
                ) {

                    if (
                        !Number.isFinite(value) ||
                        value < 0
                    ) {

                        throw new Error(
                            `Please enter a valid value for ${key}.`
                        );
                    }
                }


                /* =================================================
                   SEND REQUEST TO FLASK API
                ================================================= */

                const response =
                    await fetch(
                        `${API_URL}/predict`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "ngrok-skip-browser-warning":
                                    "true"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                /* =================================================
                   READ SERVER RESPONSE
                ================================================= */

                const result =
                    await response.json();


                /* =================================================
                   HANDLE SERVER ERROR
                ================================================= */

                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Prediction request failed."
                    );
                }


                /* =================================================
                   GET PREDICTION VALUES
                ================================================= */

                const prediction =
                    Number(
                        result.prediction
                    );

                const probability =
                    Number(
                        result.probability
                    );


                /* -------------------------------------------------
                   VALIDATE SERVER RESPONSE
                ------------------------------------------------- */

                if (
                    !Number.isFinite(
                        prediction
                    )
                ) {

                    throw new Error(
                        "The server returned an invalid prediction."
                    );
                }

                if (
                    !Number.isFinite(
                        probability
                    )
                ) {

                    throw new Error(
                        "The server returned an invalid probability."
                    );
                }


                /* =================================================
                   CONVERT PROBABILITY
                ================================================= */

                const percentage =
                    Math.round(
                        probability * 100
                    );


                /* =================================================
                   DISPLAY RESULT
                ================================================= */

                if (prediction === 1) {

                    resultTitle.textContent =
                        "Higher likelihood detected";

                    resultIcon.textContent =
                        "!";

                    resultMessage.textContent =
                        "The model indicates a higher likelihood of diabetes based on the provided values.";

                } else {

                    resultTitle.textContent =
                        "Lower likelihood detected";

                    resultIcon.textContent =
                        "✓";

                    resultMessage.textContent =
                        "The model indicates a lower likelihood of diabetes based on the provided values.";
                }


                /* =================================================
                   DISPLAY PROBABILITY
                ================================================= */

                probabilityText.textContent =
                    `${percentage}%`;


                /* Start progress from zero */

                progressBar.style.width =
                    "0%";


                /* Animate progress */

                requestAnimationFrame(() => {

                    progressBar.style.width =
                        `${percentage}%`;
                });


                /* =================================================
                   SHOW RESULT BOX
                ================================================= */

                resultBox.classList.add(
                    "show"
                );


                /* Scroll to result */

                setTimeout(() => {

                    resultBox.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }, 200);


            } catch (error) {

                console.error(
                    "Prediction error:",
                    error
                );


                /* =================================================
                   SHOW ERROR
                ================================================= */

                if (errorBox) {

                    errorBox.textContent =
                        error.message ||
                        "Something went wrong while generating the prediction.";

                    errorBox.style.display =
                        "block";
                }

            } finally {

                /* =================================================
                   RESET LOADING STATE
                ================================================= */

                if (predictBtn) {
                    predictBtn.disabled = false;
                }

                if (buttonText) {

                    buttonText.textContent =
                        "Generate Prediction";
                }

                if (loader) {
                    loader.classList.add("hidden");
                }
            }

        }
    );
}


/* =========================================================
   RESET BUTTON
========================================================= */

if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        () => {

            /* Clear form */

            if (form) {
                form.reset();
            }


            /* Hide result */

            if (resultBox) {

                resultBox.classList.remove(
                    "show"
                );
            }


            /* Hide error */

            if (errorBox) {

                errorBox.style.display =
                    "none";

                errorBox.textContent =
                    "";
            }


            /* Reset probability */

            if (probabilityText) {

                probabilityText.textContent =
                    "0%";
            }


            /* Reset progress */

            if (progressBar) {

                progressBar.style.width =
                    "0%";
            }


            /* Reset result */

            if (resultTitle) {
                resultTitle.textContent =
                    "—";
            }

            if (resultIcon) {
                resultIcon.textContent =
                    "—";
            }

            if (resultMessage) {
                resultMessage.textContent =
                    "";
            }

        }
    );
}


/* =========================================================
   CURSOR RING FIELD
========================================================= */

(function () {
    const FIELD = 500;
    const HALF = FIELD / 2;
    const WORLD = 5;
    const CURSOR_REACH = 0.175;

    const CURSOR_LERP = 0.12;
    const WANDER_LERP = 0.01;
    const HANDOVER_LERP = 0.08;

    const CURSOR_JITTER = 0.01;
    const FOV = 40;
    const DPR_CAP = 2;
    const MAX_POINTS = 65536;
    const TAU = Math.PI * 2;
    const MAX_COLORS = 5;
    const DEFAULT_COLORS = ["#7189ff", "#3074f9", "#0b0b18"];

    const RING_EDGE = 4;

    const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
    + i.y+vec4(0.0,i1.y,i2.y,1.0))
    + i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

    const FIELD_TERMS = `
void fieldTerms(
    vec2 ref, vec2 ringPos, float time,
    float ringRadius, float w1, float w2, float turb,
    out vec2 disp, out float bandT, out float bandHot
){
    float dist = distance(ref, ringPos);

    float n0 = snoise(vec3(ref * 0.2 + vec2(18.4924, 72.9744), time * 0.5));
    float dist1 = distance(ref + (n0 * 0.005), ringPos);

    float t  = smoothstep(ringRadius - (w1 * 2.0), ringRadius, dist)
             - smoothstep(ringRadius, ringRadius + w1, dist1);
    float t2 = smoothstep(ringRadius - (w2 * 2.0), ringRadius, dist)
             - smoothstep(ringRadius, ringRadius + w2, dist1);
    float t3 = smoothstep(ringRadius + w2, ringRadius, dist);

    t  = pow(max(t, 0.0), 2.0);
    t2 = pow(max(t2, 0.0), 3.0);

    t += t2 * 3.0;
    t += t3 * 0.4;
    t += snoise(vec3(ref * 30.0 + vec2(11.4924, 12.9744), time * 0.5)) * t3 * 0.5;

    float nS = snoise(vec3(ref * 2.0 + vec2(18.4924, 72.9744), time * 0.5));
    t += pow((nS + 1.5) * 0.5, 2.0) * 0.6;

    float n1 = snoise(vec3(ref * 4.0 + vec2(88.494, 32.4397), time * 0.35));
    float n2 = snoise(vec3(ref * 4.0 + vec2(50.904, 120.947), time * 0.35));
    float n3 = snoise(vec3(ref * 20.0 + vec2(18.4924, 72.9744), time * 0.5));
    float n4 = snoise(vec3(ref * 20.0 + vec2(50.904, 120.947), time * 0.5));

    vec2 d = vec2(n1, n2) * 0.03 + vec2(n3, n4) * 0.005;
    d.x += sin((ref.x * 20.0) + (time * 4.0)) * 0.02 * clamp(dist, 0.0, 1.0);
    d.y += cos((ref.y * 20.0) + (time * 3.0)) * 0.02 * clamp(dist, 0.0, 1.0);

    disp = d * turb;
    bandT = t;
    bandHot = t2;
}
`;

    const SIM_VERT = `
precision highp float;
attribute vec2 aPos;
varying vec2 vUV;
void main(){
    vUV = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

    const SIM_FRAG = `
precision highp float;

uniform sampler2D uState;
uniform sampler2D uRefs;
uniform vec2  uRingPos;
uniform float uRingRadius;
uniform float uRingWidth;
uniform float uRingWidth2;
uniform float uPush;
uniform float uTurb;
uniform float uTime;

varying vec2 vUV;

${NOISE}
${FIELD_TERMS}

void main(){
    vec4 frame = texture2D(uState, vUV);
    vec2 ref   = texture2D(uRefs, vUV).xy;

    float scale  = frame.z;
    float energy = frame.w;
    float time   = uTime * 0.5;

    vec2 disp; float t; float t2;
    fieldTerms(ref, uRingPos, time, uRingRadius, uRingWidth, uRingWidth2, uTurb, disp, t, t2);

    vec2 mem = frame.xy * 0.8;

    mem -= (uRingPos - (ref + disp)) * pow(max(t2, 0.0), 0.75) * uPush;

    scale += (t - scale) * 0.2;

    vec2 finalPos = ref + disp + (mem * 0.25);

    energy = energy * 0.5 + scale * 0.25;

    gl_FragColor = vec4(finalPos, scale, energy);
}
`;

    const RENDER_VERT = (isStatic) => `
precision highp float;

attribute vec2 aUV;
attribute vec2 aRef;

uniform sampler2D uState;
uniform float uProjF;
uniform float uAspect;
uniform float uCamDist;
uniform float uPointScale;
${
    isStatic
        ? `uniform vec2  uRingPos;
uniform float uRingRadius;
uniform float uRingWidth;
uniform float uRingWidth2;
uniform float uTurb;
uniform float uTime;`
        : ``
}

varying vec2  vLocalPos;
varying float vScale;
varying float vEnergy;

${isStatic ? NOISE : ``}
${isStatic ? FIELD_TERMS : ``}

void main(){
${
    isStatic
        ? `    vec2 disp; float t; float t2;
    fieldTerms(aRef, uRingPos, uTime * 0.5, uRingRadius, uRingWidth, uRingWidth2, uTurb, disp, t, t2);
    vec4 state = vec4(aRef + disp, t, t * 0.5);`
        : `    vec4 state = texture2D(uState, aUV);`
}

    vLocalPos = state.xy;
    vScale    = state.z;
    vEnergy   = state.w;

    vec2 world = state.xy * ${WORLD.toFixed(1)};

    gl_Position = vec4(world.x * uProjF / uAspect, world.y * uProjF, 0.0, uCamDist);

    gl_PointSize = max(vScale, 0.0) * 7.0 * uPointScale;
}
`;

    const RENDER_FRAG = `
precision highp float;

varying vec2  vLocalPos;
varying float vScale;
varying float vEnergy;

uniform vec3  uColors[${MAX_COLORS}];
uniform int   uColorCount;
uniform vec2  uRingPos;
uniform float uTime;

${NOISE}

float sdRoundBox(in vec2 p, in vec2 b, in float r){
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

vec2 rotate(vec2 v, float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, s, -s, c) * v;
}

void main(){
    float noiseAngle = snoise(vec3(vLocalPos * 10.0 + vec2(18.4924, 72.9744), uTime * 0.85));
    float noiseColor = snoise(vec3(vLocalPos * 2.0  + vec2(74.664,  91.556),  uTime * 0.5));
    noiseColor = (noiseColor + 1.0) * 0.5;

    float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);

    vec2 uv = gl_PointCoord.xy - vec2(0.5);
    uv.y *= -1.0;
    uv = rotate(uv, -angle + (noiseAngle * 0.5));

    float p = smoothstep(0.0, 0.75, pow(noiseColor, 2.0));
    vec3 color = uColors[0];
    float countM1 = max(float(uColorCount - 1), 1.0);
    for (int i = 0; i < ${MAX_COLORS - 1}; i++) {
        if (i < uColorCount - 1) {
            float span = 1.0 / countM1;
            float t = clamp((p - float(i) * span) / span, 0.0, 1.0);
            color = mix(color, uColors[i + 1], t);
        }
    }

    float d = sdRoundBox(uv, vec2(0.5, 0.2), 0.25);
    float mask = smoothstep(0.1, 0.0, d);

    float a = mask * smoothstep(0.1, 0.2, vScale);
    if (a < 0.01) discard;

    color = clamp(color, 0.0, 1.0);
    color *= clamp(vEnergy, 0.0, 1.0);

    gl_FragColor = vec4(color, clamp(a, 0.0, 1.0));
}
`;

    function compile(gl, type, src) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(sh);
            gl.deleteShader(sh);
            throw new Error(log || "shader compile failed");
        }
        return sh;
    }

    function program(gl, vs, fs, names) {
        const prog = gl.createProgram();
        const v = compile(gl, gl.VERTEX_SHADER, vs);
        const f = compile(gl, gl.FRAGMENT_SHADER, fs);
        gl.attachShader(prog, v);
        gl.attachShader(prog, f);
        gl.linkProgram(prog);
        gl.deleteShader(v);
        gl.deleteShader(f);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(prog);
            gl.deleteProgram(prog);
            throw new Error(log || "program link failed");
        }
        const u = {};
        const nulls = [];
        for (const n of names) {
            let loc = gl.getUniformLocation(prog, n);
            if (loc === null && n === "uColors[0]") {
                loc = gl.getUniformLocation(prog, "uColors");
            }
            if (loc === null) nulls.push(n);
            u[n] = loc;
        }
        return { prog, u, nulls };
    }

    function makeContext(canvas) {
        const opts = {
            alpha: true,
            antialias: false,
            premultipliedAlpha: false,
            depth: false,
            stencil: false,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
        };
        let gl = canvas.getContext("webgl2", opts);
        let fmt = null;
        if (gl) {
            fmt = gl.getExtension("EXT_color_buffer_float")
                ? { internal: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT }
                : { internal: gl.RGBA16F, format: gl.RGBA, type: gl.HALF_FLOAT };
        } else {
            gl =
                canvas.getContext("webgl", opts) ||
                canvas.getContext("experimental-webgl", opts);
            if (!gl) return null;
            const ok =
                gl.getExtension("OES_texture_float") &&
                gl.getExtension("WEBGL_color_buffer_float");
            fmt = ok ? { internal: gl.RGBA, format: gl.RGBA, type: gl.FLOAT } : null;
        }

        if (gl && gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < 2) {
            fmt = null;
        }
        return { gl, fmt };
    }

    function stateTexture(gl, fmt, size, pixels) {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            fmt.internal,
            size,
            size,
            0,
            fmt.format,
            fmt.type,
            pixels || null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return tex;
    }

    function renderTarget(gl, fmt, size) {
        const tex = stateTexture(gl, fmt, size, null);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            tex,
            0
        );
        const ok =
            gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return { tex, fbo, ok };
    }

    function mulberry32(a) {
        return function () {
            a |= 0;
            a = (a + 0x6d2b79f5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    const linMap = (x, a, b, c, d) =>
        ((x - a) * (d - c)) / (b - a) + c;

    function poissonDisk(size, minD, maxD, tries, rand) {
        const cell = minD / Math.SQRT2;
        const gw = Math.ceil(size / cell);
        const gh = Math.ceil(size / cell);
        const grid = new Int32Array(gw * gh).fill(-1);
        const px = [];
        const py = [];
        const active = [];
        const minD2 = minD * minD;

        const add = (x, y) => {
            const i = px.length;
            px.push(x);
            py.push(y);
            grid[((y / cell) | 0) * gw + ((x / cell) | 0)] = i;
            active.push(i);
        };

        add(rand() * size, rand() * size);

        while (active.length > 0 && px.length < MAX_POINTS) {
            const ai = (rand() * active.length) | 0;
            const idx = active[ai];
            let placed = false;
            for (let t = 0; t < tries; t++) {
                const ang = rand() * TAU;
                const r = minD + (maxD - minD) * rand();
                const nx = px[idx] + Math.cos(ang) * r;
                const ny = py[idx] + Math.sin(ang) * r;
                if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
                const cx = (nx / cell) | 0;
                const cy = (ny / cell) | 0;
                let ok = true;
                for (let j = Math.max(0, cy - 2); j <= Math.min(gh - 1, cy + 2) && ok; j++) {
                    for (let i = Math.max(0, cx - 2); i <= Math.min(gw - 1, cx + 2); i++) {
                        const q = grid[j * gw + i];
                        if (q < 0) continue;
                        const dx = px[q] - nx;
                        const dy = py[q] - ny;
                        if (dx * dx + dy * dy < minD2) {
                            ok = false;
                            break;
                        }
                    }
                }
                if (ok) {
                    add(nx, ny);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                active[ai] = active[active.length - 1];
                active.pop();
            }
        }
        return { px, py, count: px.length };
    }

    function buildField(density) {
        const rand = mulberry32(0x9e3779b9);
        const minD = linMap(density, 0, 300, 10, 2);
        const maxD = linMap(density, 0, 300, 11, 3);
        const { px, py, count } = poissonDisk(FIELD, minD, maxD, 20, rand);

        let texSize = 8;
        while (texSize * texSize < count) texSize *= 2;

        const refs = new Float32Array(texSize * texSize * 4);
        const aUV = new Float32Array(count * 2);
        const aRef = new Float32Array(count * 2);
        for (let i = 0; i < count; i++) {
            const x = (px[i] - HALF) / HALF;
            const y = (py[i] - HALF) / HALF;
            refs[i * 4 + 0] = x;
            refs[i * 4 + 1] = y;
            aRef[i * 2 + 0] = x;
            aRef[i * 2 + 1] = y;

            aUV[i * 2 + 0] = ((i % texSize) + 0.5) / texSize;
            aUV[i * 2 + 1] = (Math.floor(i / texSize) + 0.5) / texSize;
        }
        return { count, texSize, refs, aUV, aRef };
    }

    function valueNoise1(x, seed) {
        const i = Math.floor(x);
        const f = x - i;
        const h = (n) => {
            const s = Math.sin((n + seed) * 127.1) * 43758.5453;
            return s - Math.floor(s);
        };
        const u = f * f * (3 - 2 * f);
        return h(i) * (1 - u) + h(i + 1) * u;
    }

    function hexToRgb(hex) {
        if (typeof hex !== "string") return [1, 1, 1];
        let s = hex.trim();
        const m = s.match(/^rgba?\(([^)]+)\)$/i);
        if (m) {
            const p = m[1].split(",").map((v) => parseFloat(v));
            return [(p[0] || 0) / 255, (p[1] || 0) / 255, (p[2] || 0) / 255];
        }
        s = s.replace("#", "");
        if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
        if (s.length === 8) s = s.slice(0, 6);
        if (s.length !== 6) return [1, 1, 1];
        const n = parseInt(s, 16);
        if (!isFinite(n)) return [1, 1, 1];
        return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }

    function initCursorRingField(options = {}) {
        const canvas =
            typeof options.canvas === "string"
                ? document.getElementById(options.canvas)
                : options.canvas || document.getElementById("cursorRingCanvas");

        if (!canvas) return;

        const ctx = makeContext(canvas);
        if (!ctx) {
            console.warn("CursorRingField: WebGL context not supported.");
            return;
        }

        const { gl, fmt } = ctx;
        let useSim = !!fmt;

        if (useSim) {
            try {
                const testTex = stateTexture(gl, fmt, 8, null);
                const testFbo = gl.createFramebuffer();
                gl.bindFramebuffer(gl.FRAMEBUFFER, testFbo);
                gl.framebufferTexture2D(
                    gl.FRAMEBUFFER,
                    gl.COLOR_ATTACHMENT0,
                    gl.TEXTURE_2D,
                    testTex,
                    0
                );
                const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.deleteTexture(testTex);
                gl.deleteFramebuffer(testFbo);
                if (status !== gl.FRAMEBUFFER_COMPLETE) {
                    useSim = false;
                }
            } catch (err) {
                useSim = false;
            }
        }

        const density =
            options.density !== undefined
                ? options.density
                : (window.innerWidth < 768 ? 200 : 300);
        const dotSize = options.dotSize !== undefined ? options.dotSize : 120;
        const speed = options.speed !== undefined ? options.speed : 6;
        const cameraDistance =
            options.cameraDistance !== undefined ? options.cameraDistance : 160;
        const ring = Object.assign(
            { push: 50, width: 9, radius: 12, turbulence: 100 },
            options.ring || {}
        );
        const rawPoints = (options.colors && options.colors.length)
            ? options.colors
            : DEFAULT_COLORS;

        const ringRadius = ring.radius !== undefined ? ring.radius : 12;
        const ringWidth = ring.width !== undefined ? ring.width : 9;
        const ringPush = ring.push !== undefined ? ring.push : 0;
        const turbulence = ring.turbulence !== undefined ? ring.turbulence : 0;

        const swatches = rawPoints.slice(0, MAX_COLORS).map(hexToRgb);
        if (swatches.length === 0) swatches.push(hexToRgb(DEFAULT_COLORS[0]));
        const flatColors = new Float32Array(MAX_COLORS * 3);
        for (let i = 0; i < MAX_COLORS; i++) {
            const c = swatches[Math.min(i, swatches.length - 1)];
            flatColors[i * 3 + 0] = c[0];
            flatColors[i * 3 + 1] = c[1];
            flatColors[i * 3 + 2] = c[2];
        }

        const live = {
            colors: flatColors,
            colorCount: swatches.length,
            dotSize: dotSize / 100,
            speed: speed / 50,
            camDist: cameraDistance / 100,
            ringRadius: ringRadius / 100,
            ringWidth: Math.max(ringWidth, 1) / 100,
            ringEdge: RING_EDGE / 100,
            push: ringPush / 100,
            turb: turbulence / 100,
        };

        let simProg = null;
        let renderProg = null;

        try {
            if (useSim) {
                simProg = program(gl, SIM_VERT, SIM_FRAG, [
                    "uState",
                    "uRefs",
                    "uRingPos",
                    "uRingRadius",
                    "uRingWidth",
                    "uRingWidth2",
                    "uPush",
                    "uTurb",
                    "uTime",
                ]);
            }

            const renderNames = [
                "uProjF",
                "uAspect",
                "uCamDist",
                "uPointScale",
                "uColors[0]",
                "uColorCount",
                "uRingPos",
                "uTime",
            ];
            if (useSim) {
                renderNames.push("uState");
            } else {
                renderNames.push(
                    "uRingRadius",
                    "uRingWidth",
                    "uRingWidth2",
                    "uTurb"
                );
            }

            renderProg = program(
                gl,
                RENDER_VERT(!useSim),
                RENDER_FRAG,
                renderNames
            );
        } catch (e) {
            console.warn("CursorRingField shader error:", e.message);
            return;
        }

        const quad = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            gl.STATIC_DRAW
        );

        const uvBuf = gl.createBuffer();
        const refBuf = gl.createBuffer();
        let refsTex = null;
        let rt1 = null;
        let rt2 = null;
        let count = 0;
        let texSize = 8;

        function disposeField() {
            if (refsTex) gl.deleteTexture(refsTex);
            if (rt1) {
                gl.deleteTexture(rt1.tex);
                gl.deleteFramebuffer(rt1.fbo);
            }
            if (rt2) {
                gl.deleteTexture(rt2.tex);
                gl.deleteFramebuffer(rt2.fbo);
            }
            refsTex = null;
            rt1 = null;
            rt2 = null;
        }

        function rebuildField(d) {
            disposeField();
            const f = buildField(d);
            count = f.count;
            texSize = f.texSize;

            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
            gl.bufferData(gl.ARRAY_BUFFER, f.aUV, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, refBuf);
            gl.bufferData(gl.ARRAY_BUFFER, f.aRef, gl.STATIC_DRAW);

            if (!useSim) return;

            const src = { internal: fmt.internal, format: gl.RGBA, type: gl.FLOAT };
            refsTex = stateTexture(gl, src, texSize, f.refs);
            rt1 = renderTarget(gl, fmt, texSize);
            rt2 = renderTarget(gl, fmt, texSize);

            gl.bindTexture(gl.TEXTURE_2D, rt1.tex);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                fmt.internal,
                texSize,
                texSize,
                0,
                gl.RGBA,
                gl.FLOAT,
                f.refs
            );
            gl.bindTexture(gl.TEXTURE_2D, rt2.tex);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                fmt.internal,
                texSize,
                texSize,
                0,
                gl.RGBA,
                gl.FLOAT,
                f.refs
            );
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        rebuildField(density);

        let dpr = 1;
        let cssW = 1;
        let cssH = 1;

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
            cssW = Math.max(window.innerWidth, canvas.clientWidth || 1);
            cssH = Math.max(window.innerHeight, canvas.clientHeight || 1);
            const w = Math.max(1, Math.round(cssW * dpr));
            const h = Math.max(1, Math.round(cssH * dpr));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
        };

        resize();
        window.addEventListener("resize", resize);
        if (typeof ResizeObserver !== "undefined") {
            const ro = new ResizeObserver(resize);
            ro.observe(canvas);
        }

        const pointer = { x: 0, y: 0, over: false };
        const ringPos = { x: 0, y: 0 };
        let follow = 0;

        const onMove = (e) => {
            const r = canvas.getBoundingClientRect();
            const w = Math.max(r.width, 1);
            const h = Math.max(r.height, 1);
            pointer.x = ((e.clientX - r.left) / w) * 2 - 1;
            pointer.y = -(((e.clientY - r.top) / h) * 2 - 1);
            pointer.over =
                pointer.x >= -1 && pointer.x <= 1 && pointer.y >= -1 && pointer.y <= 1;
        };

        const onLeave = () => {
            pointer.over = false;
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onMove, { passive: true });
        document.addEventListener("mouseleave", onLeave);
        window.addEventListener("blur", onLeave);

        let raf = 0;
        let last = 0;
        let simTime = 0;
        let wander = 0;
        let ping = true;

        const posLocSim = simProg ? gl.getAttribLocation(simProg.prog, "aPos") : -1;
        const uvLoc = gl.getAttribLocation(renderProg.prog, "aUV");
        const refLoc = gl.getAttribLocation(renderProg.prog, "aRef");

        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);

        gl.blendFuncSeparate(
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA,
            gl.ONE,
            gl.ONE_MINUS_SRC_ALPHA
        );

        const colorLoc =
            renderProg.u["uColors[0]"] !== undefined && renderProg.u["uColors[0]"] !== null
                ? renderProg.u["uColors[0]"]
                : renderProg.u["uColors"];

        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            const L = live;

            if (!count) return;

            const dtRaw = last ? (now - last) / 1000 : 1 / 60;
            last = now;
            const dt = Math.min(dtRaw, 1 / 20);
            simTime = (simTime + dt * L.speed) % 3600;
            wander += dt * L.speed;

            const aspect = Math.max(cssW / Math.max(cssH, 1), 0.0001);
            const projF = 1 / Math.tan(((FOV * Math.PI) / 180) / 2);

            const wx = (valueNoise1(wander * 0.66, 94.234) - 0.5) * 2;
            const wy = (valueNoise1(wander * 0.75, 21.028) - 0.5) * 2;

            follow +=
                ((pointer.over ? 1 : 0) - follow) *
                (1 - Math.pow(1 - HANDOVER_LERP, dt * 60));

            const wanderX = wx * 0.2;
            const wanderY = wy * 0.1;
            let tx = wanderX;
            let ty = wanderY;
            if (follow > 0.0001) {
                const worldX = (pointer.x * aspect * L.camDist) / projF;
                const worldY = (pointer.y * L.camDist) / projF;
                const cx = worldX * CURSOR_REACH + wx * CURSOR_JITTER;
                const cy = worldY * CURSOR_REACH + wy * CURSOR_JITTER;
                tx = wanderX + (cx - wanderX) * follow;
                ty = wanderY + (cy - wanderY) * follow;
            }

            const lerp = WANDER_LERP + (CURSOR_LERP - WANDER_LERP) * follow;
            const rk = 1 - Math.pow(1 - lerp, dt * 60);
            ringPos.x += (tx - ringPos.x) * rk;
            ringPos.y += (ty - ringPos.y) * rk;

            const radius =
                L.ringRadius +
                Math.sin(simTime) * 0.03 +
                Math.cos(simTime * 3) * 0.02;

            if (useSim) {
                const src = ping ? rt1 : rt2;
                const dst = ping ? rt2 : rt1;
                gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
                gl.viewport(0, 0, texSize, texSize);
                gl.disable(gl.BLEND);
                gl.useProgram(simProg.prog);
                gl.bindBuffer(gl.ARRAY_BUFFER, quad);
                if (posLocSim >= 0) {
                    gl.enableVertexAttribArray(posLocSim);
                    gl.vertexAttribPointer(posLocSim, 2, gl.FLOAT, false, 0, 0);
                }
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, src.tex);
                gl.uniform1i(simProg.u.uState, 0);
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, refsTex);
                gl.uniform1i(simProg.u.uRefs, 1);
                gl.uniform2f(simProg.u.uRingPos, ringPos.x, ringPos.y);
                gl.uniform1f(simProg.u.uRingRadius, radius);
                gl.uniform1f(simProg.u.uRingWidth, L.ringWidth);
                gl.uniform1f(simProg.u.uRingWidth2, L.ringEdge);
                gl.uniform1f(simProg.u.uPush, L.push);
                gl.uniform1f(simProg.u.uTurb, L.turb);
                gl.uniform1f(simProg.u.uTime, simTime);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.enable(gl.BLEND);
                ping = !ping;
            }

            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(renderProg.prog);

            if (uvLoc >= 0) {
                gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
                gl.enableVertexAttribArray(uvLoc);
                gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
            }
            if (refLoc >= 0) {
                gl.bindBuffer(gl.ARRAY_BUFFER, refBuf);
                gl.enableVertexAttribArray(refLoc);
                gl.vertexAttribPointer(refLoc, 2, gl.FLOAT, false, 0, 0);
            }

            if (useSim) {
                const shown = ping ? rt1 : rt2;
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, shown.tex);
                gl.uniform1i(renderProg.u.uState, 0);
            } else {
                gl.uniform1f(renderProg.u.uRingRadius, radius);
                gl.uniform1f(renderProg.u.uRingWidth, L.ringWidth);
                gl.uniform1f(renderProg.u.uRingWidth2, L.ringEdge);
                gl.uniform1f(renderProg.u.uTurb, L.turb);
            }

            gl.uniform1f(renderProg.u.uProjF, projF);
            gl.uniform1f(renderProg.u.uAspect, aspect);
            gl.uniform1f(renderProg.u.uCamDist, L.camDist);

            gl.uniform1f(
                renderProg.u.uPointScale,
                (cssW / 2000) * L.dotSize * dpr * 0.5
            );
            if (colorLoc) {
                gl.uniform3fv(colorLoc, L.colors);
            }
            gl.uniform1i(renderProg.u.uColorCount, L.colorCount);
            gl.uniform2f(renderProg.u.uRingPos, ringPos.x, ringPos.y);
            gl.uniform1f(renderProg.u.uTime, simTime);

            gl.drawArrays(gl.POINTS, 0, count);
        };

        raf = requestAnimationFrame(frame);
    }

    window.initCursorRingField = initCursorRingField;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => initCursorRingField());
    } else {
        initCursorRingField();
    }
})();


/* =========================================================
   LIGHT GLASS BUTTON EFFECT
========================================================= */

(function () {
    const LIGHT_FALLOFF = [
        [0, 1],
        [0.08, 0.95],
        [0.18, 0.85],
        [0.3, 0.7],
        [0.42, 0.54],
        [0.55, 0.38],
        [0.68, 0.24],
        [0.8, 0.13],
        [0.9, 0.06],
        [0.96, 0.02],
        [1, 0],
    ];

    function parseColor(input) {
        if (!input) return { r: 255, g: 255, b: 255, a: 1 };
        let c = String(input).trim();
        const token = c.match(/^var\([^,]+,\s*(.+)\)$/i);
        if (token) c = token[1].trim();
        if (c[0] === "#") {
            let h = c.slice(1);
            if (h.length === 3 || h.length === 4) {
                h = h.split("").map((ch) => ch + ch).join("");
            }
            if (h.length !== 6 && h.length !== 8) return { r: 255, g: 255, b: 255, a: 1 };
            const n = parseInt(h, 16);
            if (Number.isNaN(n)) return { r: 255, g: 255, b: 255, a: 1 };
            return h.length === 6
                ? { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 }
                : {
                      r: (n >>> 24) & 255,
                      g: (n >>> 16) & 255,
                      b: (n >>> 8) & 255,
                      a: (n & 255) / 255,
                  };
        }
        const fn = c.match(/rgba?\(([^)]+)\)/i);
        if (fn) {
            const p = fn[1].split(/[,\s/]+/).filter(Boolean).map(Number);
            if (p.length >= 3 && p.slice(0, 3).every((v) => !Number.isNaN(v))) {
                return {
                    r: p[0],
                    g: p[1],
                    b: p[2],
                    a: p.length > 3 && !Number.isNaN(p[3]) ? p[3] : 1,
                };
            }
        }
        return { r: 255, g: 255, b: 255, a: 1 };
    }

    const rgba = (c, a) =>
        `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${Math.max(0, Math.min(1, a))})`;

    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    const lightRadius = (w, h, pct) =>
        Math.max(w, h) * (Math.max(0, Math.min(100, pct)) / 100);

    function attachLightGlassButton(btn, options = {}) {
        if (!btn || btn.dataset.glassInitialized === "true") return;
        btn.dataset.glassInitialized = "true";
        btn.classList.add("glass-btn");

        const lightSize = options.lightSize !== undefined ? options.lightSize : 40;
        const lightIntensity = options.lightIntensity !== undefined ? options.lightIntensity : 100;
        const smoothness = options.smoothness !== undefined ? options.smoothness : 65;
        const lightColor = options.lightColor || "rgba(255, 255, 255, 0.45)";

        const strokeAngle = options.strokeAngle !== undefined ? options.strokeAngle : 180;
        const strokeColorA = options.strokeColorA || "rgba(255, 255, 255, 0.55)";
        const strokeColorB = options.strokeColorB || "rgba(255, 255, 255, 0.25)";

        const AIM_BLEND = 0.18;
        const LIGHT_FADE = 0.6;

        const lightRGB = parseColor(lightColor);
        const lightClear = rgba(lightRGB, 0);
        const lightOpaque = rgba(lightRGB, 1);

        const softStops = (peak) =>
            LIGHT_FALLOFF.map(
                ([at, k]) => `${rgba(lightRGB, peak * k)} ${Math.round(at * 100)}%`
            ).join(", ");

        const lightGradient = [
            `radial-gradient(circle var(--lr, 0px) at var(--mx, 50%) var(--my, 50%), ${softStops(lightRGB.a)})`,
            `radial-gradient(circle calc(var(--lr, 0px) * 1.9) at var(--mx, 50%) var(--my, 50%), ${softStops(lightRGB.a * 0.34)})`,
        ].join(", ");

        const strokeBaseGradient = `linear-gradient(${strokeAngle}deg, ${strokeColorA}, ${strokeColorB})`;
        const strokeLightGradient = `conic-gradient(from calc((var(--la, 0) - var(--lw, 30)) * 1deg), ${lightClear} 0deg, ${lightOpaque} calc(var(--lw, 30) * 1deg), ${lightClear} calc(var(--lw, 30) * 2deg))`;

        const lightEl = document.createElement("span");
        lightEl.className = "glass-btn-light";
        lightEl.setAttribute("aria-hidden", "true");
        lightEl.style.background = lightGradient;

        const strokeBaseEl = document.createElement("span");
        strokeBaseEl.className = "glass-btn-stroke-base";
        strokeBaseEl.setAttribute("aria-hidden", "true");
        strokeBaseEl.style.background = strokeBaseGradient;

        const strokeLightEl = document.createElement("span");
        strokeLightEl.className = "glass-btn-stroke-light";
        strokeLightEl.setAttribute("aria-hidden", "true");
        strokeLightEl.style.background = strokeLightGradient;

        btn.prepend(lightEl, strokeBaseEl, strokeLightEl);

        const tgt = { x: 0.5, y: 0.5, on: 0 };
        const cur = { x: 0.5, y: 0.5, on: 0 };
        let raf = null;
        let last = 0;
        const box = { w: 0, h: 0 };

        const updateBox = () => {
            const r = btn.getBoundingClientRect();
            box.w = r.width;
            box.h = r.height;
            const R = lightRadius(r.width, r.height, lightSize);
            btn.style.setProperty("--lr", `${R.toFixed(1)}px`);
        };

        updateBox();
        if (typeof ResizeObserver !== "undefined") {
            const ro = new ResizeObserver(updateBox);
            ro.observe(btn);
        }

        const paint = () => {
            btn.style.setProperty("--mx", `${(cur.x * 100).toFixed(2)}%`);
            btn.style.setProperty("--my", `${(cur.y * 100).toFixed(2)}%`);

            const amt = Math.max(0, Math.min(100, lightIntensity)) / 100;
            lightEl.style.opacity = (cur.on * amt).toFixed(3);

            const w = box.w;
            const h = box.h;

            const d = clamp01(
                Math.max(Math.abs(cur.x - 0.5), Math.abs(cur.y - 0.5)) * 2
            );

            let ang = 0;
            let half = 30;
            if (w > 0 && h > 0) {
                const px = cur.x * w;
                const py = cur.y * h;
                const s = Math.max(1, Math.min(w, h) * AIM_BLEND);
                const sides = [
                    [px, 0, py],
                    [w - px, w, py],
                    [py, px, 0],
                    [h - py, px, h],
                ];
                const near = Math.min(...sides.map((v) => v[0]));
                let wt = 0;
                let ax = 0;
                let ay = 0;
                for (const [dist, sx, sy] of sides) {
                    const k = Math.exp(-(dist - near) / s);
                    wt += k;
                    ax += k * sx;
                    ay += k * sy;
                }
                const ex = ax / wt - w / 2;
                const ey = ay / wt - h / 2;

                ang = (Math.atan2(ey, ex) * 180) / Math.PI + 90;

                const L = Math.max(1, Math.hypot(ex, ey));
                const reach = lightRadius(w, h, lightSize) * LIGHT_FADE;
                half = (Math.atan(reach / L) * 180) / Math.PI;
            }

            strokeLightEl.style.setProperty("--la", ang.toFixed(1));
            strokeLightEl.style.setProperty(
                "--lw",
                Math.max(3, Math.min(70, half)).toFixed(1)
            );
            strokeLightEl.style.opacity = clamp01(cur.on * d * d * amt).toFixed(3);
        };

        const tick = (t) => {
            const dt = last ? Math.min(0.05, (t - last) / 1000) : 1 / 60;
            last = t;
            const s = Math.max(0, Math.min(100, smoothness)) / 100;
            const per = 0.5 - s * 0.46;
            const k = 1 - Math.pow(1 - per, dt * 60);

            cur.x += (tgt.x - cur.x) * k;
            cur.y += (tgt.y - cur.y) * k;
            cur.on += (tgt.on - cur.on) * k;
            paint();

            const settled =
                Math.abs(tgt.x - cur.x) < 0.001 &&
                Math.abs(tgt.y - cur.y) < 0.001 &&
                Math.abs(tgt.on - cur.on) < 0.002;

            if (settled && tgt.on === 0) {
                cur.x = tgt.x;
                cur.y = tgt.y;
                cur.on = 0;
                paint();
                raf = null;
                last = 0;
                return;
            }
            raf = requestAnimationFrame(tick);
        };

        const kick = () => {
            if (raf == null) {
                last = 0;
                raf = requestAnimationFrame(tick);
            }
        };

        const trackPointer = (e) => {
            const r = btn.getBoundingClientRect();
            if (!r.width || !r.height) return;
            tgt.x = (e.clientX - r.left) / r.width;
            tgt.y = (e.clientY - r.top) / r.height;
            kick();
        };

        const onEnter = (e) => {
            const r = btn.getBoundingClientRect();
            if (r.width && r.height) {
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                tgt.x = x;
                tgt.y = y;
                if (cur.on === 0) {
                    cur.x = x;
                    cur.y = y;
                }
            }
            tgt.on = 1;
            kick();
        };

        const onLeave = (e) => {
            trackPointer(e);
            tgt.on = 0;
            kick();
        };

        btn.addEventListener("pointermove", trackPointer);
        btn.addEventListener("pointerenter", onEnter);
        btn.addEventListener("pointerleave", onLeave);
    }

    function initLightGlassButtons(selector = "button, .primary-button, .submit-button, .reset-button") {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach((btn) => attachLightGlassButton(btn));
    }

    window.attachLightGlassButton = attachLightGlassButton;
    window.initLightGlassButtons = initLightGlassButtons;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => initLightGlassButtons());
    } else {
        initLightGlassButtons();
    }
})();